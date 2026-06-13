'use strict'

// Netlify Function: update-matches
// Fetches today's ESPN match data, parses it directly into our schema,
// then commits the updated matches.json back to GitHub (triggering a redeploy).
//
// Required env vars (set in Netlify dashboard):
//   GITHUB_TOKEN   — Personal access token with repo write scope
//   GITHUB_OWNER   — GitHub username/org (e.g. "drinkingtheink")
//   GITHUB_REPO    — Repo name (e.g. "world-cup-pool-party")
//   UPDATE_SECRET  — Random string; callers must pass ?secret=<this>

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
  const d = todayESPN()
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
}

// Preserve compact single-line-per-match format of existing file
function serializeMatches(matches) {
  return '[\n' + matches.map(m => '  ' + JSON.stringify(m)).join(',\n') + '\n]\n'
}

// ─── Team name normalization ───────────────────────────────────────────────────
// ESPN uses different names than we do for some teams. We normalize both sides
// and apply explicit overrides for the known mismatches.

const ESPN_OVERRIDE = {
  'united states': 'USA',
  'usa': 'USA',
  'korea republic': 'South Korea',
  'republic of korea': 'South Korea',
  'czech republic': 'Czechia',
  "cote divoire": 'Ivory Coast',
  "cote d ivoire": 'Ivory Coast',
  'ivory coast': 'Ivory Coast',
  'dr congo': 'DR Congo',
  'democratic republic of congo': 'DR Congo',
  'congo dr': 'DR Congo',
  'trinidad and tobago': 'Trinidad & Tobago',
  'bosnia and herzegovina': 'Bosnia & Herzegovina',
  'north macedonia': 'North Macedonia',
  'cape verde': 'Cape Verde',
}

function normalize(s) {
  return s.toLowerCase()
    .replace(/&/g, 'and')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ').trim()
}

function resolveTeamName(espnName, ourTeams) {
  const norm = normalize(espnName)
  if (ESPN_OVERRIDE[norm]) return ESPN_OVERRIDE[norm]
  for (const t of ourTeams) {
    if (normalize(t) === norm) return t
  }
  // partial fallback
  for (const t of ourTeams) {
    const nt = normalize(t)
    if (norm.includes(nt) || nt.includes(norm)) return t
  }
  return espnName
}

// ─── Clock parsing ─────────────────────────────────────────────────────────────
// ESPN gives clock as elapsed seconds. Math.ceil(value/60) = display minute.
// 1020s → 17', 5580s → 93' (handles stoppage time naturally).

function secondsToMinute(seconds) {
  if (seconds == null) return null
  return Math.ceil(seconds / 60) || null
}

// ─── ESPN event parser ─────────────────────────────────────────────────────────

function parseESPNEvent(event, ourTeams) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const homeComp = comp.competitors?.find(c => c.homeAway === 'home')
  const awayComp = comp.competitors?.find(c => c.homeAway === 'away')
  if (!homeComp || !awayComp) return null

  const homeName = resolveTeamName(homeComp.team?.displayName || homeComp.team?.name || '', ourTeams)
  const awayName = resolveTeamName(awayComp.team?.displayName || awayComp.team?.name || '', ourTeams)
  const homeTeamId = homeComp.team?.id
  const awayTeamId = awayComp.team?.id

  const state = comp.status?.type?.state         // 'pre' | 'in' | 'post'
  const completed = comp.status?.type?.completed  // boolean
  const started = state !== 'pre'
  const finished = completed || state === 'post'
  const snapshotMinute = finished ? null : (started ? secondsToMinute(comp.status?.clock) : null)

  const homeScore = started ? (homeComp.score ?? '') : ''
  const awayScore = started ? (awayComp.score ?? '') : ''

  const goals = []
  const cards = []

  for (const detail of (comp.details || [])) {
    const teamId = detail.team?.id
    const side = teamId === homeTeamId ? 'home' : teamId === awayTeamId ? 'away' : null
    if (!side) continue

    const eventMinute = secondsToMinute(detail.clock?.value)
    const detailType = detail.type?.text

    const isGoal = detailType === 'Goal' || detail.scoringPlay === true
    const isYellow = detail.yellowCard || detailType === 'Yellow Card'
    const isRed = detail.redCard || detailType === 'Red Card' || detailType === 'Yellow-Red Card'

    if (isGoal) {
      const athlete = detail.athletesInvolved?.[0]
      // Use short name's surname, falling back to full name's last word
      const lastName = athlete
        ? (athlete.shortName?.split('. ').pop() || athlete.displayName?.split(' ').pop() || 'Unknown')
        : 'Unknown'

      if (detail.ownGoal) {
        // ESPN's team on an OG event = the benefiting team (already correct — don't flip)
        goals.push({ team: side, minute: eventMinute, scorer: `${lastName} (OG)` })
      } else {
        const scorer = detail.penaltyKick ? `${lastName} (P)` : lastName
        goals.push({ team: side, minute: eventMinute, scorer })
      }
    } else if (isYellow || isRed) {
      cards.push({ team: side, minute: eventMinute, type: isRed ? 'red' : 'yellow' })
    }
  }

  goals.sort((a, b) => a.minute - b.minute)
  cards.sort((a, b) => a.minute - b.minute)

  return { homeName, awayName, homeScore, awayScore, snapshotMinute, goals, cards }
}

// ─── GitHub helpers ────────────────────────────────────────────────────────────

async function readGitHubFile(owner, repo, path, token) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'netlify-update-matches', Accept: 'application/vnd.github.v3+json' } }
  )
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`)
  return res.json()
}

async function writeGitHubFile(owner, repo, path, content, sha, message, token) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'netlify-update-matches',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, content: Buffer.from(content, 'utf-8').toString('base64'), sha }),
    }
  )
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`)
}

// ─── Handler ───────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  const secret = event.queryStringParameters?.secret
  if (!process.env.UPDATE_SECRET || secret !== process.env.UPDATE_SECRET) {
    return json(401, { error: 'Unauthorized' })
  }

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return json(500, { error: 'Missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars' })
  }

  try {
    const today = todayISO()
    const espnDate = todayESPN()

    // 1. Fetch ESPN scoreboard for today
    const espnRes = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${espnDate}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    if (!espnRes.ok) throw new Error(`ESPN fetch failed: ${espnRes.status}`)
    const { events = [] } = await espnRes.json()

    if (!events.length) {
      return json(200, { message: `ESPN has no events for ${today}`, updated: [] })
    }

    // 2. Read current matches.json from GitHub
    const ghFile = await readGitHubFile(GITHUB_OWNER, GITHUB_REPO, 'src/data/matches.json', GITHUB_TOKEN)
    const allMatches = JSON.parse(Buffer.from(ghFile.content, 'base64').toString('utf-8'))
    const fileSha = ghFile.sha

    const todayMatches = allMatches.filter(m => m.date === today)
    if (!todayMatches.length) {
      return json(200, { message: `No matches for ${today} in our data`, updated: [] })
    }

    // 3. Get all team names we use today for normalization
    const ourTeams = [...new Set(todayMatches.flatMap(m => [m.home, m.away]))]

    // 4. Parse ESPN events
    const espnParsed = events.map(evt => parseESPNEvent(evt, ourTeams)).filter(Boolean)

    // 5. Merge updates into full match list
    let changed = 0
    const updatedAll = allMatches.map(m => {
      if (m.date !== today) return m

      const espn = espnParsed.find(e =>
        normalize(e.homeName) === normalize(m.home) &&
        normalize(e.awayName) === normalize(m.away)
      )
      if (!espn) return m

      // If ESPN has a non-zero score but no goal events yet, preserve our existing goal data
      const totalGoals = Number(espn.homeScore || 0) + Number(espn.awayScore || 0)
      const goals = (totalGoals > 0 && espn.goals.length === 0) ? (m.goals || []) : espn.goals
      const cards = (espn.cards.length === 0 && (m.cards || []).length > 0) ? m.cards : espn.cards

      const updated = {
        ...m,
        home_score: espn.homeScore,
        away_score: espn.awayScore,
        goals,
        cards,
        snapshot_minute: espn.snapshotMinute,
      }

      if (JSON.stringify(updated) !== JSON.stringify(m)) changed++
      return updated
    })

    if (!changed) {
      return json(200, { message: 'Scores checked — no changes', updated: [] })
    }

    // 6. Commit updated file to GitHub
    await writeGitHubFile(
      GITHUB_OWNER, GITHUB_REPO, 'src/data/matches.json',
      serializeMatches(updatedAll), fileSha,
      `chore: update match data ${today}`,
      GITHUB_TOKEN
    )

    const summary = updatedAll
      .filter(m => m.date === today)
      .map(m => {
        const status = m.snapshot_minute ? `${m.snapshot_minute}'` : (m.home_score !== '' ? 'FT' : 'NS')
        return `${m.home} ${m.home_score || '-'}:${m.away_score || '-'} ${m.away} [${status}]`
      })

    return json(200, { message: `Updated ${changed} match(es)`, date: today, updated: summary })

  } catch (err) {
    console.error('update-matches error:', err)
    return json(500, { error: err.message })
  }
}
