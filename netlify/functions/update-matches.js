'use strict'

// Netlify Function: update-matches
// Fetches today's World Cup fixtures + events from API-Football, then commits
// any score/goal/card changes back to matches.json on GitHub.
//
// Required env vars (set in Netlify dashboard):
//   API_FOOTBALL_KEY  — API-Football key (api-sports.io dashboard)
//   GITHUB_TOKEN      — Personal access token with repo write scope
//   GITHUB_OWNER      — GitHub username/org (e.g. "drinkingtheink")
//   GITHUB_REPO       — Repo name (e.g. "world-cup-pool-party")
//   UPDATE_SECRET     — Random string; callers must pass ?secret=<this>

const API_BASE   = 'https://v3.football.api-sports.io'
const WC_LEAGUE  = 1
const WC_SEASON  = 2026

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type':                 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

function todayISO() {
  // Match dates are stored in CT (CDT = UTC-5)
  const t = new Date(Date.now() - 5 * 60 * 60 * 1000)
  return t.toISOString().slice(0, 10)
}

function utcDateISO() {
  return new Date().toISOString().slice(0, 10)
}

// Preserve compact single-line-per-match format of existing file
function serializeMatches(matches) {
  return '[\n' + matches.map(m => '  ' + JSON.stringify(m)).join(',\n') + '\n]\n'
}

// ─── Team name normalization ───────────────────────────────────────────────────
// API-Football uses slightly different names than our matches.json.

const API_OVERRIDE = {
  'korea republic':               'South Korea',
  'republic of korea':            'South Korea',
  'ir iran':                      'Iran',
  'united states':                'USA',
  'ivory coast':                  "Côte d'Ivoire",
  "cote d'ivoire":                "Côte d'Ivoire",
  'cote divoire':                 "Côte d'Ivoire",
  'dr congo':                     'DR Congo',
  'congo dr':                     'DR Congo',
  'democratic republic of congo': 'DR Congo',
  'bosnia':                       'Bosnia & Herzegovina',
  'bosnia and herzegovina':       'Bosnia & Herzegovina',
  'curacao':                      'Curaçao',
  'turkey':                       'Türkiye',
  'turkiye':                      'Türkiye',
  'cape verde islands':           'Cape Verde',
}

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ').trim()
}

function resolveTeamName(apiName, ourTeams) {
  const norm = normalize(apiName)
  if (API_OVERRIDE[norm]) return API_OVERRIDE[norm]
  for (const t of ourTeams) {
    if (normalize(t) === norm) return t
  }
  for (const t of ourTeams) {
    const nt = normalize(t)
    if (norm.includes(nt) || nt.includes(norm)) return t
  }
  return apiName
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const FINISHED = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO'])
const LIVE     = new Set(['1H', 'HT', '2H', 'ET', 'P', 'BT', 'SUSP', 'INT'])

function fixtureMinute(status) {
  if (!LIVE.has(status?.short)) return null
  return (status.elapsed ?? 0) + (status.extra ?? 0) || null
}

// ─── API-Football fetch ────────────────────────────────────────────────────────

async function apiFetch(path, apiKey) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'x-apisports-key': apiKey },
  })
  if (!res.ok) throw new Error(`API-Football ${path} → ${res.status}`)
  const { response, errors } = await res.json()
  if (errors && Object.keys(errors).length) {
    throw new Error(`API-Football errors: ${JSON.stringify(errors)}`)
  }
  return response ?? []
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
        Authorization:  `Bearer ${token}`,
        'User-Agent':   'netlify-update-matches',
        Accept:         'application/vnd.github.v3+json',
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

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, API_FOOTBALL_KEY } = process.env
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return json(500, { error: 'Missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars' })
  }
  if (!API_FOOTBALL_KEY) {
    return json(500, { error: 'Missing API_FOOTBALL_KEY env var' })
  }

  try {
    const today = todayISO()

    // 1. Fetch fixtures for both CT date and UTC date — late-night CT games (e.g. 10PM CT = 3AM UTC)
    //    are stored under the next UTC date in API-Football's system
    const dates = [...new Set([today, utcDateISO()])]
    const fixtureArrays = await Promise.all(
      dates.map(d => apiFetch(`/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&date=${d}`, API_FOOTBALL_KEY))
    )
    const fixtures = fixtureArrays.flat()

    if (!fixtures.length) {
      return json(200, { message: `No fixtures from API-Football for ${today}`, updated: [] })
    }

    // 2. Read current matches.json from GitHub
    const ghFile = await readGitHubFile(GITHUB_OWNER, GITHUB_REPO, 'src/data/matches.json', GITHUB_TOKEN)
    const allMatches = JSON.parse(Buffer.from(ghFile.content, 'base64').toString('utf-8'))
    const fileSha = ghFile.sha

    const todayMatches = allMatches.filter(m => m.date === today)
    if (!todayMatches.length) {
      return json(200, { message: `No matches for ${today} in our data`, updated: [] })
    }

    // 3. Parse each fixture; fetch events in parallel for started ones
    const ourTeams = [...new Set(todayMatches.flatMap(m => [m.home, m.away]))]

    const parsed = await Promise.all(fixtures.map(async (fx) => {
      const status    = fx.fixture?.status ?? {}
      const finished  = FINISHED.has(status.short)
      const started   = finished || LIVE.has(status.short)

      const homeName  = resolveTeamName(fx.teams?.home?.name ?? '', ourTeams)
      const awayName  = resolveTeamName(fx.teams?.away?.name ?? '', ourTeams)
      const homeId    = fx.teams?.home?.id
      const awayId    = fx.teams?.away?.id

      const homeScore       = started ? String(fx.goals?.home ?? '') : ''
      const awayScore       = started ? String(fx.goals?.away ?? '') : ''
      const snapshotMinute  = fixtureMinute(status)

      // Penalty shootout winner
      let penalties_winner = null
      if (finished && fx.score?.penalty?.home != null) {
        const pH = fx.score.penalty.home ?? 0
        const pA = fx.score.penalty.away ?? 0
        if (pH !== pA) penalties_winner = pH > pA ? 'home' : 'away'
      }

      const goals = []
      const cards = []

      if (started) {
        const events = await apiFetch(`/fixtures/events?fixture=${fx.fixture.id}`, API_FOOTBALL_KEY)

        for (const e of events) {
          const teamId = e.team?.id
          const side   = teamId === homeId ? 'home' : teamId === awayId ? 'away' : null
          if (!side) continue

          const minute     = (e.time?.elapsed ?? 0) + (e.time?.extra ?? 0)
          const playerName = (e.player?.name ?? '').trim()
          const lastName   = playerName.split(' ').filter(Boolean).pop() ?? 'Unknown'

          if (e.type === 'Goal') {
            const detail = e.detail ?? ''
            if (detail === 'Own Goal') {
              // API-Football tags the OG with the player's team — flip to get benefiting side
              const scoring = side === 'home' ? 'away' : 'home'
              goals.push({ team: scoring, minute, scorer: `${lastName} (OG)` })
            } else if (detail === 'Penalty') {
              goals.push({ team: side, minute, scorer: `${lastName} (P)` })
            } else {
              goals.push({ team: side, minute, scorer: lastName })
            }
          } else if (e.type === 'Card') {
            const detail = e.detail ?? ''
            const type   = (detail === 'Red Card' || detail === 'Yellow Red Card') ? 'red' : 'yellow'
            cards.push({ team: side, minute, type })
          }
          // Ignore substitutions, VAR reviews, etc.
        }

        goals.sort((a, b) => a.minute - b.minute)
        cards.sort((a, b) => a.minute - b.minute)
      }

      return { homeName, awayName, homeScore, awayScore, snapshotMinute, goals, cards, penalties_winner }
    }))

    // 4. Build live snapshot for client minute resync (returned on every call)
    const live = todayMatches.map(m => {
      const fx = parsed.find(f =>
        normalize(f.homeName) === normalize(m.home) &&
        normalize(f.awayName) === normalize(m.away)
      )
      if (!fx) return null
      return { home: m.home, away: m.away, minute: fx.snapshotMinute, home_score: fx.homeScore, away_score: fx.awayScore }
    }).filter(Boolean)

    // 5. Merge updates into full match list — only commit on meaningful changes
    let changed = 0
    const updatedAll = allMatches.map(m => {
      if (m.date !== today) return m

      const fx = parsed.find(f =>
        normalize(f.homeName) === normalize(m.home) &&
        normalize(f.awayName) === normalize(m.away)
      )
      if (!fx) return m

      // If API has a score but no goal events yet, keep our existing goal data
      const totalGoals = Number(fx.homeScore || 0) + Number(fx.awayScore || 0)
      const goals = (totalGoals > 0 && fx.goals.length === 0) ? (m.goals || []) : fx.goals
      const cards = (fx.cards.length === 0 && (m.cards || []).length > 0) ? m.cards : fx.cards

      const wasLive = m.snapshot_minute != null
      const isLive  = fx.snapshotMinute != null

      const meaningfulChange =
        fx.homeScore  !== m.home_score ||
        fx.awayScore  !== m.away_score ||
        JSON.stringify(goals) !== JSON.stringify(m.goals || []) ||
        JSON.stringify(cards) !== JSON.stringify(m.cards || []) ||
        (fx.penalties_winner ?? null) !== (m.penalties_winner ?? null) ||
        wasLive !== isLive

      if (!meaningfulChange) return m

      changed++
      return {
        ...m,
        home_score:       fx.homeScore,
        away_score:       fx.awayScore,
        goals,
        cards,
        snapshot_minute:  fx.snapshotMinute,
        penalties_winner: fx.penalties_winner,
      }
    })

    if (!changed) {
      return json(200, { message: 'Scores checked — no changes', updated: [], live })
    }

    // 6. Commit updated file to GitHub (triggers Netlify redeploy)
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

    return json(200, { message: `Updated ${changed} match(es)`, date: today, updated: summary, live })

  } catch (err) {
    console.error('update-matches error:', err)
    return json(500, { error: err.message })
  }
}
