// ─── App Data ─────────────────────────────────────────────────────────────────
// Edit this file to update players, matches, and tiers.
// Match scores: leave home_score / away_score as '' for unplayed matches.
// Bonus flags (comma-separated): home_first_goal, away_first_goal,
//   home_comeback, away_comeback, home_penalties, away_penalties

export const players = [
  { name: 'Charley', team1: 'England', team2: 'Brazil', team3: 'Norway', team4: 'Germany', team5: 'Morocco', team6: 'Scotland' },
  { name: 'Jason',   team1: 'France', team2: 'Netherlands', team3: 'Japan', team4: 'Croatia', team5: 'Ivory Coast', team6: 'Sweden' },
  { name: 'Dan',     team1: 'Mexico', team2: 'Croatia', team3: 'Ivory Coast', team4: 'Spain', team5: 'Brazil', team6: 'Colombia' },
  { name: 'Jay',     team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Jared',   team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
  { name: 'Gabe',    team1: 'England', team2: 'Brazil', team3: 'Mexico', team4: 'Sweden', team5: 'Senegal', team6: 'Bosnia & Herzegovina' },
  { name: 'James',   team1: 'Senegal', team2: 'Japan', team3: 'Colombia', team4: 'Ecuador', team5: 'DR Congo', team6: 'Spain' },
  { name: 'Tommy',   team1: '', team2: '', team3: '', team4: '', team5: '', team6: '' },
]

export const matches = [
  // ── Group Stage ──────────────────────────────────────────────────────────────
  // Add matches here as the schedule is confirmed.
  // Example:
  // { date: '2026-06-11', stage: 'Group Stage', home: 'Mexico', away: 'USA', home_score: '', away_score: '', bonuses: '', time: '2:00 PM CT' },
]

export const tiers = [
  // Tier 1 — Contenders (+450 to 20-1)
  // odds stored as positive American odds integer (+450 → 450, 14-1 → 1400)
  { team: 'Spain',                tier: 1, odds:   450 },
  { team: 'France',               tier: 1, odds:   500 },
  { team: 'England',              tier: 1, odds:   700 },
  { team: 'Portugal',             tier: 1, odds:   800 },
  { team: 'Argentina',            tier: 1, odds:   900 },
  { team: 'Brazil',               tier: 1, odds:   900 },
  { team: 'Germany',              tier: 1, odds:  1400 },
  { team: 'Netherlands',          tier: 1, odds:  2000 },
  { team: 'Belgium',              tier: 1, odds:  3300 },
  { team: 'Norway',               tier: 1, odds:  3300 },
  { team: 'Colombia',             tier: 1, odds:  4000 },
  { team: 'Morocco',              tier: 1, odds:  4000 },
  // Tier 2 — Dark Horses (50-1 to 150-1)
  { team: 'Japan',                tier: 2, odds:  5000 },
  { team: 'USA',                  tier: 2, odds:  5000 },
  { team: 'Mexico',               tier: 2, odds:  6600 },
  { team: 'Senegal',              tier: 2, odds:  6600 },
  { team: 'Switzerland',          tier: 2, odds:  6600 },
  { team: 'Turkey',               tier: 2, odds:  6600 },
  { team: 'Uruguay',              tier: 2, odds:  6600 },
  { team: 'Croatia',              tier: 2, odds:  8000 },
  { team: 'Ecuador',              tier: 2, odds:  8000 },
  { team: 'Sweden',               tier: 2, odds: 10000 },
  { team: 'Austria',              tier: 2, odds: 15000 },
  { team: 'Canada',               tier: 2, odds: 15000 },
  // Tier 3 — Solid (200-1 to 500-1)
  { team: 'Ivory Coast',          tier: 3, odds: 20000 },
  { team: 'Algeria',              tier: 3, odds: 25000 },
  { team: 'Bosnia & Herzegovina', tier: 3, odds: 25000 },
  { team: 'Czech Republic',       tier: 3, odds: 25000 },
  { team: 'Egypt',                tier: 3, odds: 25000 },
  { team: 'South Korea',          tier: 3, odds: 25000 },
  { team: 'Paraguay',             tier: 3, odds: 25000 },
  { team: 'Scotland',             tier: 3, odds: 25000 },
  { team: 'Australia',            tier: 3, odds: 50000 },
  { team: 'Ghana',                tier: 3, odds: 50000 },
  { team: 'Iran',                 tier: 3, odds: 50000 },
  { team: 'Tunisia',              tier: 3, odds: 50000 },
  // Tier 4 — Cinderellas (750-1 to 2500-1)
  { team: 'DR Congo',             tier: 4, odds:  75000 },
  { team: 'Cape Verde',           tier: 4, odds: 100000 },
  { team: 'Iraq',                 tier: 4, odds: 100000 },
  { team: 'Jordan',               tier: 4, odds: 100000 },
  { team: 'New Zealand',          tier: 4, odds: 100000 },
  { team: 'Panama',               tier: 4, odds: 100000 },
  { team: 'Qatar',                tier: 4, odds: 100000 },
  { team: 'Saudi Arabia',         tier: 4, odds: 100000 },
  { team: 'South Africa',         tier: 4, odds: 100000 },
  { team: 'Uzbekistan',           tier: 4, odds: 100000 },
  { team: 'Curaçao',              tier: 4, odds: 250000 },
  { team: 'Haiti',                tier: 4, odds: 250000 },
]
