'use strict'

// Netlify Function: update-matches
// Fetches today's ESPN match data, asks Claude to map it to our schema,
// then commits the updated matches.json back to GitHub (triggering a redeploy).
//
// Required env vars (set in Netlify dashboard):
//   ANTHROPIC_API_KEY   — Claude API key
//   GITHUB_TOKEN        — Personal access token with repo write scope
//   GITHUB_OWNER        — GitHub username/org (e.g. "drinkingtheink")
//   GITHUB_REPO         — Repo name (e.g. "world-cup-pool-party")
//   UPDATE_SECRET       — Random string; callers must pass ?secret=<this>

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

function todayESPN() {
  const t = new Date()
  const y = t.getUTCFullYear()
  const m = String(t.getUTCMonth() + 1).padStart(2, '0')
  const d = String(t.getUTCDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function todayISO() {
  const t = new Date()
  const y = t.getUTCFullYear()
  const m = String(t.getUTCMonth() + 1).padStart(2, '0')
  const d = String(t.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Keep matches.json compact — one match object per line, matching existing format
function serializeMatches(matches) {
  return '[\n' + matches.map(m => '  ' + JSON.stringify(m)).join(',\n') + '\n]\n'
}

async function fetchESPN(dateStr) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${dateStr}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`ESPN scoreboard failed: ${res.status}`)
  return res.json()
}

async function fetchESPNSummary(eventId) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${eventId}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) return null
  return res.json()
}

async function readGitHubFile(owner, repo, path, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'netlify-update-matches',
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function writeGitHubFile(owner, repo, path, content, sha, message, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const encoded = Buffer.from(content, 'utf-8').toString('base64')
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'netlify-update-matches',
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content: encoded, sha }),
  })
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function callClaude(apiKey, prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Claude API failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.content[0].text
}

function buildPrompt(todayMatches, scoreboard, summaries) {
  return `You are updating match data for a World Cup 2026 fantasy pool app.

## Our current match records for today:
${JSON.stringify(todayMatches, null, 2)}

## ESPN scoreboard data for today:
${JSON.stringify(scoreboard, null, 2)}

## ESPN match summaries (detailed events):
${JSON.stringify(summaries, null, 2)}

## Your task:
Update our match records to reflect the latest ESPN data.
Return ONLY a JSON array — no markdown fences, no explanation, just the raw JSON array.

## Rules:
- Match ESPN teams to our team names. Examples: "United States" → "USA", "Korea Republic" → "South Korea", "Bosnia and Herzegovina" → "Bosnia & Herzegovina", "Iran" → "IR Iran" etc. Use fuzzy matching.
- Only update these fields: home_score, away_score, goals, cards, snapshot_minute, penalties_winner
- Keep ALL other fields exactly as-is (date, stage, home, away, time, etc.)
- goals format: [{ "team": "home"|"away", "minute": <integer>, "scorer": "<LastName>" }]
  - Penalty goals: scorer = "LastName (P)"
  - Own goals: scorer = "LastName (OG)" and team = the side that benefits (opposite of the scorer's team)
  - Stoppage time: convert to total minutes (90+3 → 93, 45+2 → 47)
- cards format: [{ "team": "home"|"away", "minute": <integer>, "type": "yellow"|"red" }]
  - Second yellow resulting in red: record as type "red"
- snapshot_minute: integer (current match minute) if in progress, null if final or not yet started
- If match not yet started: keep home_score and away_score as ""
- Return the complete updated match objects (all fields), not just changed fields
- If a match has no ESPN data (not found), return it unchanged`
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  // Auth check
  const secret = event.queryStringParameters?.secret
  if (!process.env.UPDATE_SECRET || secret !== process.env.UPDATE_SECRET) {
    return json(401, { error: 'Unauthorized' })
  }

  const {
    ANTHROPIC_API_KEY,
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
  } = process.env

  if (!ANTHROPIC_API_KEY || !GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return json(500, { error: 'Missing required environment variables' })
  }

  try {
    const today = todayISO()
    const espnDate = todayESPN()

    // 1. Fetch ESPN scoreboard for today
    const scoreboard = await fetchESPN(espnDate)
    const events = scoreboard.events || []

    if (events.length === 0) {
      return json(200, { message: `No ESPN events found for ${today}`, updated: [] })
    }

    // 2. Fetch individual match summaries for detail (goal scorers, cards)
    const summaries = {}
    await Promise.all(
      events.map(async (evt) => {
        const summary = await fetchESPNSummary(evt.id)
        if (summary) summaries[evt.id] = summary
      })
    )

    // 3. Read current matches.json from GitHub
    const ghFile = await readGitHubFile(GITHUB_OWNER, GITHUB_REPO, 'src/data/matches.json', GITHUB_TOKEN)
    const allMatches = JSON.parse(Buffer.from(ghFile.content, 'base64').toString('utf-8'))
    const fileSha = ghFile.sha

    // 4. Extract today's matches
    const todayMatches = allMatches.filter(m => m.date === today)
    if (todayMatches.length === 0) {
      return json(200, { message: `No matches scheduled for ${today} in our data`, updated: [] })
    }

    // 5. Ask Claude to parse and update
    const prompt = buildPrompt(todayMatches, scoreboard, summaries)
    const claudeText = await callClaude(ANTHROPIC_API_KEY, prompt)

    // 6. Parse Claude's JSON response
    let updatedToday
    try {
      // Claude might wrap in markdown fences despite instructions — strip them
      const cleaned = claudeText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
      updatedToday = JSON.parse(cleaned)
    } catch {
      return json(500, { error: 'Claude returned invalid JSON', raw: claudeText.slice(0, 500) })
    }

    if (!Array.isArray(updatedToday)) {
      return json(500, { error: 'Claude response was not an array', raw: claudeText.slice(0, 500) })
    }

    // 7. Merge updated today's matches back into the full list
    const updatedAll = allMatches.map(m => {
      if (m.date !== today) return m
      const updated = updatedToday.find(u => u.home === m.home && u.away === m.away)
      return updated || m
    })

    // 8. Serialize and commit to GitHub
    const newContent = serializeMatches(updatedAll)
    const commitDate = new Date().toISOString().slice(0, 10)
    await writeGitHubFile(
      GITHUB_OWNER,
      GITHUB_REPO,
      'src/data/matches.json',
      newContent,
      fileSha,
      `chore: update match data ${commitDate}`,
      GITHUB_TOKEN
    )

    const summary = updatedToday.map(m => {
      const status = m.snapshot_minute ? `${m.snapshot_minute}'` : (m.home_score !== '' ? 'FT' : 'NS')
      return `${m.home} ${m.home_score || '-'}:${m.away_score || '-'} ${m.away} [${status}]`
    })

    return json(200, { message: 'Match data updated and committed', date: today, updated: summary })

  } catch (err) {
    console.error('update-matches error:', err)
    return json(500, { error: err.message })
  }
}
