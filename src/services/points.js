// ─── Points Engine ────────────────────────────────────────────────────────────
// Pure functions. No Vue/Pinia deps. All scoring logic lives here.
//
// Match shape:
//   home, away, stage, home_score, away_score
//   goals: [{ team: 'home'|'away', minute: Number }]  — chronological
//   penalties_winner: 'home' | 'away' | null

const STAGE_MULTIPLIERS = {
  'Group Stage':    1,
  'Round of 32':    1.5,
  'Round of 16':    1.5,
  'Quarterfinal':   2,
  'Semifinal':      3,
  'Third Place':    3,
  'Final':          4,
}

function multiplierFor(stage) {
  return STAGE_MULTIPLIERS[stage] ?? 1
}

// Derive bonus flags from the goals timeline + penalties_winner
function deriveBonuses(match) {
  const { goals = [], penalties_winner = null } = match
  const flags = new Set()

  const hs = Number(match.home_score)
  const as = Number(match.away_score)
  if (!match.snapshot_minute) {
    if (as === 0) flags.add('home_clean_sheet')
    if (hs === 0) flags.add('away_clean_sheet')
  }

  if (goals.length > 0) {
    // First goal
    flags.add(`${goals[0].team}_first_goal`)

    // Comeback win — winner was losing at some point
    const winner = hs > as ? 'home' : as > hs ? 'away' : null
    if (winner) {
      let h = 0, a = 0
      let wasTrailing = false
      for (const g of goals) {
        if (g.team === 'home') h++; else a++
        if (winner === 'home' && a > h) wasTrailing = true
        if (winner === 'away' && h > a) wasTrailing = true
      }
      if (wasTrailing) flags.add(`${winner}_comeback`)
    }
  }

  if (penalties_winner) flags.add(`${penalties_winner}_penalties`)

  return flags
}

// Points for a single team in a single match (before multiplier)
export function matchPointsForTeam(team, match) {
  const { home, away, home_score, away_score, stage } = match
  const isHome = home === team
  const isAway = away === team
  if (!isHome && !isAway) return 0
  if (home_score === '' || away_score === '') return 0

  const hs = Number(home_score)
  const as = Number(away_score)
  const side = isHome ? 'home' : 'away'
  const scored = isHome ? hs : as
  const conceded = isHome ? as : hs

  if (match.snapshot_minute) {
    const bonuses = deriveBonuses(match)
    let pts = scored
    if (bonuses.has(`${side}_first_goal`)) pts += 1
    return pts * multiplierFor(stage)
  }

  const bonuses = deriveBonuses(match)

  let pts = 0

  // Result
  if (scored > conceded) pts += 3
  else if (scored === conceded) pts += 1

  // Goals scored (regular time + ET, not penalties)
  pts += scored

  // Clean sheet
  if (conceded === 0) pts += 1

  // Bonus events
  if (bonuses.has(`${side}_first_goal`)) pts += 1
  if (bonuses.has(`${side}_comeback`))   pts += 2
  if (bonuses.has(`${side}_penalties`))  pts += 2

  return pts * multiplierFor(stage)
}

// Point-by-point breakdown for a single team in a single match
export function matchBreakdownForTeam(team, match) {
  const isHome = match.home === team
  const isAway = match.away === team
  if (!isHome && !isAway) return null
  if (match.home_score === '' || match.away_score === '' || match.snapshot_minute) return null

  const hs = Number(match.home_score)
  const as = Number(match.away_score)
  const side = isHome ? 'home' : 'away'
  const scored   = isHome ? hs : as
  const conceded = isHome ? as : hs
  const mul = multiplierFor(match.stage)
  const bonuses = deriveBonuses(match)

  const items = []
  if (scored > conceded)      items.push({ key: 'W',           pts: 3 })
  else if (scored === conceded) items.push({ key: 'D',          pts: 1 })
  if (scored > 0)              items.push({ key: `${scored}G`,  pts: scored })
  if (conceded === 0)          items.push({ key: 'CS',          pts: 1 })
  if (bonuses.has(`${side}_first_goal`)) items.push({ key: 'FG', pts: 1 })
  if (bonuses.has(`${side}_comeback`))   items.push({ key: 'CB', pts: 2 })
  if (bonuses.has(`${side}_penalties`))  items.push({ key: 'PEN', pts: 2 })

  const raw = items.reduce((s, i) => s + i.pts, 0)
  return {
    opponent: isHome ? match.away : match.home,
    date: match.date,
    scoreStr: `${hs}–${as}`,
    items,
    mul,
    total: Math.round(raw * mul * 10) / 10,
  }
}

// All points for a player across all matches
export function calcPlayerPoints(player, matches) {
  const teams = [
    player.team1, player.team2, player.team3,
    player.team4, player.team5, player.team6,
  ].filter(Boolean)

  let total = 0
  const breakdown = {}

  teams.forEach(team => {
    breakdown[team] = 0
    matches.forEach(match => {
      const pts = matchPointsForTeam(team, match)
      breakdown[team] += pts
      total += pts
    })
  })

  return { total: Math.round(total * 10) / 10, breakdown }
}

// Full leaderboard sorted by total
export function buildLeaderboard(players, matches) {
  return players
    .map(p => {
      const { total, breakdown } = calcPlayerPoints(p, matches)
      const teams = [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
      return { name: p.name, total, breakdown, teams }
    })
    .sort((a, b) => b.total - a.total)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))
}

// Match list enriched with computed flags
export function enrichMatches(matches) {
  return matches.map(m => {
    const played = m.home_score !== '' && m.away_score !== ''
    const hs = Number(m.home_score)
    const as = Number(m.away_score)
    let result = null
    if (played) {
      if (hs > as) result = 'home'
      else if (as > hs) result = 'away'
      else if (m.penalties_winner) result = m.penalties_winner
      else result = 'draw'
    }
    const bonuses = played ? deriveBonuses(m) : new Set()
    return { ...m, played, result, bonusFlags: bonuses }
  })
}
