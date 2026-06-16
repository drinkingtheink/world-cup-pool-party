'use strict'

// Netlify Function: patch-match
// Accepts a POST with partial match data, patches matches.json on GitHub, triggers redeploy.
//
// Body: { secret, date, home, away, home_score, away_score, goals, cards, snapshot_minute }

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

function serializeMatches(matches) {
  return '[\n' + matches.map(m => '  ' + JSON.stringify(m)).join(',\n') + '\n]\n'
}

async function readGitHubFile(owner, repo, path, token) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'netlify-patch-match', Accept: 'application/vnd.github.v3+json' } }
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
        'User-Agent': 'netlify-patch-match',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, content: Buffer.from(content, 'utf-8').toString('base64'), sha }),
    }
  )
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`)
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Invalid JSON' }) }

  const { secret, date, home, away, home_score, away_score, goals, cards, snapshot_minute } = body

  if (!process.env.UPDATE_SECRET || secret !== process.env.UPDATE_SECRET) return json(401, { error: 'Unauthorized' })
  if (!date || !home || !away) return json(400, { error: 'date, home, away required' })

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) return json(500, { error: 'Missing GitHub env vars' })

  try {
    const ghFile = await readGitHubFile(GITHUB_OWNER, GITHUB_REPO, 'src/data/matches.json', GITHUB_TOKEN)
    const allMatches = JSON.parse(Buffer.from(ghFile.content, 'base64').toString('utf-8'))

    const idx = allMatches.findIndex(m =>
      m.date === date &&
      m.home.toLowerCase() === home.toLowerCase() &&
      m.away.toLowerCase() === away.toLowerCase()
    )
    if (idx === -1) return json(404, { error: `Match not found: ${home} vs ${away} on ${date}` })

    const existing = allMatches[idx]
    const updated = {
      ...existing,
      home_score: home_score ?? existing.home_score,
      away_score: away_score ?? existing.away_score,
      goals: goals ?? existing.goals,
      cards: cards ?? existing.cards,
      snapshot_minute: snapshot_minute !== undefined ? snapshot_minute : existing.snapshot_minute,
    }

    if (JSON.stringify(updated) === JSON.stringify(existing)) return json(200, { message: 'No changes' })

    allMatches[idx] = updated
    await writeGitHubFile(
      GITHUB_OWNER, GITHUB_REPO, 'src/data/matches.json',
      serializeMatches(allMatches), ghFile.sha,
      `chore: update match data ${date}`,
      GITHUB_TOKEN
    )

    return json(200, { message: 'Match updated', match: updated })
  } catch (err) {
    console.error('patch-match error:', err)
    return json(500, { error: err.message })
  }
}
