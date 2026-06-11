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
  { team: 'Spain',                tier: 1 },
  { team: 'France',               tier: 1 },
  { team: 'England',              tier: 1 },
  { team: 'Portugal',             tier: 1 },
  { team: 'Argentina',            tier: 1 },
  { team: 'Brazil',               tier: 1 },
  { team: 'Germany',              tier: 1 },
  { team: 'Netherlands',          tier: 1 },
  { team: 'Belgium',              tier: 1 },
  { team: 'Norway',               tier: 1 },
  { team: 'Colombia',             tier: 1 },
  { team: 'Morocco',              tier: 1 },
  // Tier 2 — Dark Horses (50-1 to 150-1)
  { team: 'Japan',                tier: 2 },
  { team: 'USA',                  tier: 2 },
  { team: 'Mexico',               tier: 2 },
  { team: 'Senegal',              tier: 2 },
  { team: 'Switzerland',          tier: 2 },
  { team: 'Turkey',               tier: 2 },
  { team: 'Uruguay',              tier: 2 },
  { team: 'Croatia',              tier: 2 },
  { team: 'Ecuador',              tier: 2 },
  { team: 'Sweden',               tier: 2 },
  { team: 'Austria',              tier: 2 },
  { team: 'Canada',               tier: 2 },
  // Tier 3 — Solid (200-1 to 500-1)
  { team: 'Ivory Coast',          tier: 3 },
  { team: 'Algeria',              tier: 3 },
  { team: 'Bosnia & Herzegovina', tier: 3 },
  { team: 'Czech Republic',       tier: 3 },
  { team: 'Egypt',                tier: 3 },
  { team: 'South Korea',          tier: 3 },
  { team: 'Paraguay',             tier: 3 },
  { team: 'Scotland',             tier: 3 },
  { team: 'Australia',            tier: 3 },
  { team: 'Ghana',                tier: 3 },
  { team: 'Iran',                 tier: 3 },
  { team: 'Tunisia',              tier: 3 },
  // Tier 4 — Cinderellas (750-1 to 2500-1)
  { team: 'DR Congo',             tier: 4 },
  { team: 'Cape Verde',           tier: 4 },
  { team: 'Iraq',                 tier: 4 },
  { team: 'Jordan',               tier: 4 },
  { team: 'New Zealand',          tier: 4 },
  { team: 'Panama',               tier: 4 },
  { team: 'Qatar',                tier: 4 },
  { team: 'Saudi Arabia',         tier: 4 },
  { team: 'South Africa',         tier: 4 },
  { team: 'Uzbekistan',           tier: 4 },
  { team: 'Curaçao',              tier: 4 },
  { team: 'Haiti',                tier: 4 },
]
