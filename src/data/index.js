// ─── App Data ─────────────────────────────────────────────────────────────────
// Edit this file to update players, matches, and tiers.
// Match scores: leave home_score / away_score as '' for unplayed matches.
// Bonus flags (comma-separated): home_first_goal, away_first_goal,
//   home_comeback, away_comeback, home_penalties, away_penalties

export const players = [
  { name: 'Charley', team1: 'England', team2: 'Germany', team3: 'Norway', team4: 'Uruguay', team5: 'Morocco', team6: 'Scotland' },
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
  // odds: positive American odds (+450 → 450, 14-1 → 1400) | fifaRank: April 2026
  { team: 'Spain',                tier: 1, odds:   450, fifaRank:  2 },
  { team: 'France',               tier: 1, odds:   500, fifaRank:  1 },
  { team: 'England',              tier: 1, odds:   700, fifaRank:  4 },
  { team: 'Portugal',             tier: 1, odds:   800, fifaRank:  5 },
  { team: 'Argentina',            tier: 1, odds:   900, fifaRank:  3 },
  { team: 'Brazil',               tier: 1, odds:   900, fifaRank:  6 },
  { team: 'Germany',              tier: 1, odds:  1400, fifaRank: 10 },
  { team: 'Netherlands',          tier: 1, odds:  2000, fifaRank:  7 },
  { team: 'Belgium',              tier: 1, odds:  3300, fifaRank:  9 },
  { team: 'Norway',               tier: 1, odds:  3300, fifaRank: 31 },
  { team: 'Colombia',             tier: 1, odds:  4000, fifaRank: 13 },
  { team: 'Morocco',              tier: 1, odds:  4000, fifaRank:  8 },
  // Tier 2 — Dark Horses (50-1 to 150-1)
  { team: 'Japan',                tier: 2, odds:  5000, fifaRank: 18 },
  { team: 'USA',                  tier: 2, odds:  5000, fifaRank: 16 },
  { team: 'Mexico',               tier: 2, odds:  6600, fifaRank: 15 },
  { team: 'Senegal',              tier: 2, odds:  6600, fifaRank: 14 },
  { team: 'Switzerland',          tier: 2, odds:  6600, fifaRank: 19 },
  { team: 'Turkey',               tier: 2, odds:  6600, fifaRank: 22 },
  { team: 'Uruguay',              tier: 2, odds:  6600, fifaRank: 17 },
  { team: 'Croatia',              tier: 2, odds:  8000, fifaRank: 11 },
  { team: 'Ecuador',              tier: 2, odds:  8000, fifaRank: 23 },
  { team: 'Sweden',               tier: 2, odds: 10000, fifaRank: 38 },
  { team: 'Austria',              tier: 2, odds: 15000, fifaRank: 24 },
  { team: 'Canada',               tier: 2, odds: 15000, fifaRank: 30 },
  // Tier 3 — Solid (200-1 to 500-1)
  { team: 'Ivory Coast',          tier: 3, odds: 20000, fifaRank: 34 },
  { team: 'Algeria',              tier: 3, odds: 25000, fifaRank: 28 },
  { team: 'Bosnia & Herzegovina', tier: 3, odds: 25000, fifaRank: 65 },
  { team: 'Czech Republic',       tier: 3, odds: 25000, fifaRank: 41 },
  { team: 'Egypt',                tier: 3, odds: 25000, fifaRank: 29 },
  { team: 'South Korea',          tier: 3, odds: 25000, fifaRank: 25 },
  { team: 'Paraguay',             tier: 3, odds: 25000, fifaRank: 40 },
  { team: 'Scotland',             tier: 3, odds: 25000, fifaRank: 43 },
  { team: 'Australia',            tier: 3, odds: 50000, fifaRank: 27 },
  { team: 'Ghana',                tier: 3, odds: 50000, fifaRank: 74 },
  { team: 'Iran',                 tier: 3, odds: 50000, fifaRank: 21 },
  { team: 'Tunisia',              tier: 3, odds: 50000, fifaRank: 44 },
  // Tier 4 — Cinderellas (750-1 to 2500-1)
  { team: 'DR Congo',             tier: 4, odds:  75000, fifaRank: 46 },
  { team: 'Cape Verde',           tier: 4, odds: 100000, fifaRank: 69 },
  { team: 'Iraq',                 tier: 4, odds: 100000, fifaRank: 57 },
  { team: 'Jordan',               tier: 4, odds: 100000, fifaRank: 63 },
  { team: 'New Zealand',          tier: 4, odds: 100000, fifaRank: 85 },
  { team: 'Panama',               tier: 4, odds: 100000, fifaRank: 33 },
  { team: 'Qatar',                tier: 4, odds: 100000, fifaRank: 55 },
  { team: 'Saudi Arabia',         tier: 4, odds: 100000, fifaRank: 61 },
  { team: 'South Africa',         tier: 4, odds: 100000, fifaRank: 60 },
  { team: 'Uzbekistan',           tier: 4, odds: 100000, fifaRank: 50 },
  { team: 'Curaçao',              tier: 4, odds: 250000, fifaRank: 82 },
  { team: 'Haiti',                tier: 4, odds: 250000, fifaRank: 83 },
]
