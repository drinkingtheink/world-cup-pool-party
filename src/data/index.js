// ─── App Data ─────────────────────────────────────────────────────────────────
// Edit this file to update players, matches, and tiers.
// Match scores: leave home_score / away_score as '' for unplayed matches.
// Bonus flags (comma-separated): home_first_goal, away_first_goal,
//   home_comeback, away_comeback, home_penalties, away_penalties

export const players = [
  { name: 'Charley', team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Jason',   team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Dan',     team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Jay',     team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Jared',   team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Gabe',    team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'James',   team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Tommy',   team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
]

export const matches = [
  // ── Group Stage ──────────────────────────────────────────────────────────────
  // Add matches here as the schedule is confirmed.
  // Example:
  // { date: '2026-06-11', stage: 'Group Stage', home: 'Mexico', away: 'USA', home_score: '', away_score: '', bonuses: '', time: '2:00 PM CT' },
]

export const tiers = [
  // Tier 1 — Favorites
  { team: 'Spain',        tier: 1 },
  { team: 'France',       tier: 1 },
  { team: 'England',      tier: 1 },
  { team: 'Brazil',       tier: 1 },
  { team: 'Argentina',    tier: 1 },
  { team: 'Germany',      tier: 1 },
  { team: 'Portugal',     tier: 1 },
  { team: 'Netherlands',  tier: 1 },
  { team: 'Belgium',      tier: 1 },
  // Tier 2 — Contenders
  { team: 'USA',          tier: 2 },
  { team: 'Mexico',       tier: 2 },
  { team: 'Japan',        tier: 2 },
  { team: 'Morocco',      tier: 2 },
  { team: 'Croatia',      tier: 2 },
  { team: 'Uruguay',      tier: 2 },
  { team: 'Denmark',      tier: 2 },
  { team: 'Switzerland',  tier: 2 },
  { team: 'Colombia',     tier: 2 },
  { team: 'Italy',        tier: 2 },
  // Tier 3 — Dark horses
  { team: 'Senegal',      tier: 3 },
  { team: 'Poland',       tier: 3 },
  { team: 'Serbia',       tier: 3 },
  { team: 'Ecuador',      tier: 3 },
  { team: 'South Korea',  tier: 3 },
  { team: 'Australia',    tier: 3 },
  { team: 'Wales',        tier: 3 },
  { team: 'Ghana',        tier: 3 },
  { team: 'Tunisia',      tier: 3 },
  { team: 'Canada',       tier: 3 },
  // Tier 4 — Underdogs
  { team: 'Cameroon',     tier: 4 },
  { team: 'Costa Rica',   tier: 4 },
  { team: 'Saudi Arabia', tier: 4 },
  { team: 'Iran',         tier: 4 },
  { team: 'Qatar',        tier: 4 },
]
