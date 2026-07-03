// ─── App Data ─────────────────────────────────────────────────────────────────
// Edit this file to update players, matches, and tiers.
// Match scores: leave home_score / away_score as '' for unplayed matches.
// goals: array of { team: 'home'|'away', minute: 23 } in chronological order
// cards: array of { team: 'home'|'away', minute: 23, type: 'yellow'|'red' } in chronological order
// penalties_winner: 'home', 'away', or null

export const quotes = [
  { text: 'We lost because we didn\'t win.',                                              author: 'Ronaldo Nazário' },
  { text: 'It\'s one of them days when you just say, \'It\'s one of them days\'.',        author: 'Ian Wright' },
  { text: 'That was only a yard away from being an inch-perfect pass.',                   author: 'Murdo MacLeod' },
  { text: 'Well, Clive, it\'s all about the two Ms — movement and positioning.',          author: 'Ron Atkinson' },
  { text: 'I only show emotion in bed.',                                                  author: 'Mauricio Pochettino' },
  { text: 'I made mistakes, and I paid for them. But the ball is still pure.',            author: 'Diego Maradona' },
]

export const players = [
  { name: 'Charley', team1: 'England', team2: 'Germany', team3: 'Norway', team4: 'Uruguay', team5: 'Morocco', team6: 'Scotland' },
  { name: 'Jason',   team1: 'France', team2: 'Netherlands', team3: 'Japan', team4: 'Croatia', team5: 'Côte d\'Ivoire', team6: 'Switzerland' },
  { name: 'Dan',     team1: 'Mexico', team2: 'Croatia', team3: 'Côte d\'Ivoire', team4: 'Spain', team5: 'Brazil', team6: 'Uruguay' },
  { name: 'Jay',     team1: 'England', team2: 'Spain', team3: 'USA', team4: 'Croatia', team5: 'Czechia', team6: 'DR Congo' },
  { name: 'Jared',   team1: 'Spain', team2: 'Netherlands', team3: 'Mexico', team4: 'Switzerland', team5: 'South Korea', team6: 'Morocco' },
  { name: 'Gabe',    team1: 'England', team2: 'Brazil', team3: 'Mexico', team4: 'Sweden', team5: 'Senegal', team6: 'Bosnia & Herzegovina' },
  { name: 'James',   team1: 'Senegal', team2: 'Japan', team3: 'Colombia', team4: 'Ecuador', team5: 'DR Congo', team6: 'Spain' },
  { name: 'Tommy',   team1: 'Argentina', team2: 'Portugal', team3: 'USA', team4: 'Switzerland', team5: 'Colombia', team6: 'Côte d\'Ivoire' },
]

export { default as matches } from './matches.json'

export const ELIMINATED_TEAMS = new Set([
  'Czechia', 'Qatar', 'Haiti', 'Türkiye', 'Curaçao', 'Tunisia',
  'New Zealand', 'Saudi Arabia', 'Uruguay', 'Iraq', 'Jordan', 'Panama',
  'South Korea', 'Scotland', 'Iran', 'Uzbekistan', 'Japan', 'Netherlands', 
  'Germany', 'South Africa', 'Côte d\'Ivoire', 'Sweden', 'DR Congo',
  'Bosnia & Herzegovina', 'Senegal', 'Ecuador', 'Austria', 'Croatia', 'Algeria', 'Australia'
])

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
  { team: 'Türkiye',              tier: 2, odds:  6600, fifaRank: 22 },
  { team: 'Uruguay',              tier: 2, odds:  6600, fifaRank: 17 },
  { team: 'Croatia',              tier: 2, odds:  8000, fifaRank: 11 },
  { team: 'Ecuador',              tier: 2, odds:  8000, fifaRank: 23 },
  { team: 'Sweden',               tier: 2, odds: 10000, fifaRank: 38 },
  { team: 'Austria',              tier: 2, odds: 15000, fifaRank: 24 },
  { team: 'Canada',               tier: 2, odds: 15000, fifaRank: 30 },
  // Tier 3 — Solid (200-1 to 500-1)
  { team: 'Côte d\'Ivoire',          tier: 3, odds: 20000, fifaRank: 34 },
  { team: 'Algeria',              tier: 3, odds: 25000, fifaRank: 28 },
  { team: 'Bosnia & Herzegovina', tier: 3, odds: 25000, fifaRank: 65 },
  { team: 'Czechia',       tier: 3, odds: 25000, fifaRank: 41 },
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

export const GROUP_MAP = {
  // Group A
  'Mexico':               'A',
  'South Korea':          'A',
  'Czechia':              'A',
  'South Africa':         'A',
  // Group B
  'Switzerland':          'B',
  'Canada':               'B',
  'Qatar':                'B',
  'Bosnia & Herzegovina': 'B',
  // Group C
  'Morocco':              'C',
  'Brazil':               'C',
  'Scotland':             'C',
  'Haiti':                'C',
  // Group D
  'USA':                  'D',
  'Türkiye':               'D',
  'Australia':            'D',
  'Paraguay':             'D',
  // Group E
  'Germany':              'E',
  'Curaçao':              'E',
  "Côte d'Ivoire":        'E',
  'Ecuador':              'E',
  // Group F
  'Netherlands':          'F',
  'Japan':                'F',
  'Sweden':               'F',
  'Tunisia':              'F',
  // Group G
  'Belgium':              'G',
  'Egypt':                'G',
  'Iran':                 'G',
  'New Zealand':          'G',
  // Group H
  'Spain':                'H',
  'Cape Verde':           'H',
  'Saudi Arabia':         'H',
  'Uruguay':              'H',
  // Group I
  'France':               'I',
  'Senegal':              'I',
  'Iraq':                 'I',
  'Norway':               'I',
  // Group J
  'Argentina':            'J',
  'Algeria':              'J',
  'Austria':              'J',
  'Jordan':               'J',
  // Group K
  'Portugal':             'K',
  'DR Congo':             'K',
  'Uzbekistan':           'K',
  'Colombia':             'K',
  // Group L
  'England':              'L',
  'Croatia':              'L',
  'Ghana':                'L',
  'Panama':               'L',
}

export const FLAG_MAP = {
  'Spain':                '🇪🇸',
  'France':               '🇫🇷',
  'England':              '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Portugal':             '🇵🇹',
  'Argentina':            '🇦🇷',
  'Brazil':               '🇧🇷',
  'Germany':              '🇩🇪',
  'Netherlands':          '🇳🇱',
  'Belgium':              '🇧🇪',
  'Norway':               '🇳🇴',
  'Colombia':             '🇨🇴',
  'Morocco':              '🇲🇦',
  'Japan':                '🇯🇵',
  'USA':                  '🇺🇸',
  'Mexico':               '🇲🇽',
  'Senegal':              '🇸🇳',
  'Switzerland':          '🇨🇭',
  'Türkiye':               '🇹🇷',
  'Uruguay':              '🇺🇾',
  'Croatia':              '🇭🇷',
  'Ecuador':              '🇪🇨',
  'Sweden':               '🇸🇪',
  'Austria':              '🇦🇹',
  'Canada':               '🇨🇦',
  'Côte d\'Ivoire':       '🇨🇮',
  'Algeria':              '🇩🇿',
  'Bosnia & Herzegovina': '🇧🇦',
  'Czechia':       '🇨🇿',
  'Egypt':                '🇪🇬',
  'South Korea':          '🇰🇷',
  'Paraguay':             '🇵🇾',
  'Scotland':             '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Australia':            '🇦🇺',
  'Ghana':                '🇬🇭',
  'Iran':                 '🇮🇷',
  'Tunisia':              '🇹🇳',
  'DR Congo':             '🇨🇩',
  'Cape Verde':           '🇨🇻',
  'Iraq':                 '🇮🇶',
  'Jordan':               '🇯🇴',
  'New Zealand':          '🇳🇿',
  'Panama':               '🇵🇦',
  'Qatar':                '🇶🇦',
  'Saudi Arabia':         '🇸🇦',
  'South Africa':         '🇿🇦',
  'Uzbekistan':           '🇺🇿',
  'Curaçao':              '🇨🇼',
  'Haiti':                '🇭🇹',
}
