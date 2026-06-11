// ─── Points Engine ────────────────────────────────────────────────────────────
// Pure functions. No Vue/Pinia deps. All scoring logic lives here.

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

// Points for a single team in a single match (before multiplier)
function matchPointsForTeam(team, match) {
  const { home, away, home_score, away_score, bonuses, stage } = match
  const hs = Number(home_score)
  const as = Number(away_score)
  const isHome = home === team
  const isAway = away === team
  if (!isHome && !isAway) return 0
  if (home_score === '' || away_score === '') return 0 // match not played yet

  const scored = isHome ? hs : as
  const conceded = isHome ? as : hs
  const bonusFlags = (bonuses || '').split(',').map(b => b.trim()).filter(Boolean)
  const side = isHome ? 'home' : 'away'

  let pts = 0

  // Result
  if (scored > conceded) pts += 3
  else if (scored === conceded) pts += 1

  // Goals scored
  pts += scored

  // Clean sheet
  if (conceded === 0) pts += 1

  // Bonus events
  if (bonusFlags.includes(`${side}_first_goal`)) pts += 1
  if (bonusFlags.includes(`${side}_comeback`)) pts += 2
  if (bonusFlags.includes(`${side}_penalties`)) pts += 2

  return pts * multiplierFor(stage)
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
      else result = 'draw'
    }
    return { ...m, played, result }
  })
}
