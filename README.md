```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░                                                                     ░
░    ⚽  W O R L D   C U P   P O O L   P A R T Y   2 0 2 6  ⚽      ░
░                                                                     ░
░           a neon-drenched points engine for the beautiful game      ░
░                                                                     ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

> **Vue 3 · Pinia · Vite · Netlify Functions**
> Mobile-first. No backend. No database. Fully reactive. Serverless live scoring via API-Football.

---

## 🌊 What Is This

A full-featured World Cup pool tracker for a private group of 8 players. Each player drafts 6 national teams before the tournament. Points accumulate across every match those teams play, scaled by stage multipliers that reward performance deeper in the bracket.

The app tracks everything live — standings, goals, badges, path-to-prize analysis, mathematical elimination, and a "Wrapped"-style end-of-season breakdown — and pushes it all to a mobile-first vaporwave UI.

---

## 💜 Stack

| Layer | Tech |
|---|---|
| UI Framework | Vue 3 (Composition API) |
| State | Pinia store |
| Bundler | Vite |
| Routing | Vue Router |
| Icons | Lucide Vue Next |
| Hosting | Netlify |
| Live Scoring | Netlify Functions → API-Football |
| Data Store | `src/data/matches.json` (committed to repo) |

No backend. No auth. No external DB. All persistent state lives in version-controlled JSON and is patched via GitHub API from serverless functions.

---

## 🔮 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│                                                             │
│  src/data/index.js          src/data/matches.json           │
│  ┌──────────────────┐       ┌─────────────────────────┐    │
│  │  players[]       │       │  matches[]               │    │
│  │  tiers[]         │       │  (scores, goals, cards)  │    │
│  │  quotes[]        │       │  patched live via GH API │    │
│  └────────┬─────────┘       └────────────┬────────────┘    │
│           └──────────────┬───────────────┘                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   SCORING ENGINE                             │
│                                                             │
│  src/services/points.js                                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  matchPointsForTeam(team, match)                   │     │
│  │    → raw score (W/D/G/CS/FG/CB/PEN) × multiplier  │     │
│  │                                                    │     │
│  │  calcPlayerPoints(player, matches)                 │     │
│  │    → sum across all 6 teams, all matches           │     │
│  │                                                    │     │
│  │  buildLeaderboard(players, matches)                │     │
│  │    → sorted array with rank, total, breakdown      │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   PINIA STORE  (pool.js)                    │
│                                                             │
│  leaderboard  (computed) ─── enrichedMatches  (computed)   │
│  teamPlayerMap            ─── tierMap                       │
│  paperStrength            ─── tierGroups                    │
│                                                             │
│  Polls matches.json every 60s during live match windows     │
│  Syncs ESPN minute via autoUpdateScores() every 3 min       │
└──────────────────┬───────────────────────────────────────────┘
                   │
     ┌─────────────┼──────────────────────────────┐
     │             │                              │
     ▼             ▼                              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐
│Leaderboard│ │ Matches  │  │ MyTeams  │  │  Bracket  │
│   .vue  │  │  .vue    │  │  .vue    │  │   .vue    │
└─────────┘  └──────────┘  └──────────┘  └───────────┘
     ▲
     │  AnnouncementModal.vue (dismissible, id-gated)
     └─────────────────────────────────────────────
```

---

## ⚡ Scoring Engine

Source: `src/services/points.js` — pure functions, zero Vue/Pinia dependencies.

### Points Per Match (Raw)

```
┌────────────────────────────────────────┬────────┐
│ Event                                  │  Pts   │
├────────────────────────────────────────┼────────┤
│ Win                                    │   +3   │
│ Draw                                   │   +1   │
│ Goal scored (regular time + ET)        │ +1 each│
│ Clean sheet (zero conceded)            │   +1   │
│ First goal of the match                │   +1   │
│ Comeback win (team trailed at any pt)  │   +2   │
│ Win on penalties                       │   +2   │
└────────────────────────────────────────┴────────┘
```

> ℹ️ Penalty shootout goals do **not** count toward the goals total. Only the `+2` bonus applies.

### Stage Multipliers

Points are not created equal. Every match score is multiplied by the round it's played in:

```
  GROUP STAGE    ×1.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ROUND OF 32    ×1.5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ROUND OF 16    ×1.5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  QUARTERFINAL   ×2.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  SEMIFINAL      ×3.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  THIRD PLACE    ×3.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  FINAL          ×4.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

**Formula:** `(W/D + goals + CS + FG + CB + PEN) × stage_multiplier = match points`

**Example:** Team wins 2–1, scores the first goal, trailed at 0–1 before the comeback.
```
  3 (Win) + 2 (goals) + 1 (FG) + 2 (CB) = 8 raw
  8 × 2 (Quarterfinal) = 16 pts
```

### Live / In-Progress Scoring (Snapshot Mode)

While a match is live, the data file stores a `snapshot_minute`. During this state, only **goals scored** and the **first-goal bonus** are tracked. Result bonuses (W/D), clean sheets, and comebacks are finalized when the match is marked complete.

```
  LIVE MATCH                       FINAL MATCH
  ┌───────────────────┐            ┌───────────────────────┐
  │ ✓ Goals scored    │            │ ✓ Win / Draw          │
  │ ✓ First goal      │  ──────▶  │ ✓ Goals scored        │
  │ ✗ Win/Draw        │   settled  │ ✓ Clean sheet         │
  │ ✗ Clean sheet     │            │ ✓ First goal          │
  │ ✗ Comeback        │            │ ✓ Comeback win        │
  │ ✗ Penalties       │            │ ✓ Penalties win       │
  └───────────────────┘            └───────────────────────┘
```

---

## 🎮 Live Scoring Pipeline

```
  Netlify Function: update-matches.js
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │   Client polls /.netlify/functions/update-matches          │
  │   every 3 minutes during active match windows             │
  │                                                            │
  │   Function:                                                │
  │   1. Hits API-Football v3 for today's WC fixtures          │
  │   2. Diffs incoming scores/goals/cards vs matches.json     │
  │   3. If changes found → patches file via GitHub API        │
  │   4. Returns live minute readings to client                │
  │                                                            │
  │   Client:                                                  │
  │   5. Stores ESPN minute anchors in liveAnchors ref         │
  │   6. Extrapolates match clock forward in real time         │
  │   7. Re-polls matches.json every 60s to catch commits      │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

  Other functions:
  ┌──────────────────┬─────────────────────────────────────────┐
  │ patch-match.js   │ Manual score entry via admin endpoint   │
  │ notify-dismiss.js│ Logs when players dismiss announcements │
  │ deploy-status.js │ Health check / deploy metadata endpoint │
  └──────────────────┴─────────────────────────────────────────┘
```

---

## 🌸 Data Structures

### Players (`src/data/index.js`)

```js
{
  name: 'Alice',
  team1: 'Brazil',
  team2: 'France',
  team3: 'Japan',
  team4: 'Ecuador',
  team5: 'Ghana',
  team6: 'Qatar'
}
```

Each player picks exactly 6 national teams before the tournament starts. Points from all 6 teams accumulate throughout.

### Matches (`src/data/matches.json`)

```js
{
  date: '2026-06-11',
  stage: 'Group Stage',        // exact casing required — see stage values below
  home: 'Mexico',
  away: 'USA',
  home_score: '2',             // leave '' for upcoming matches
  away_score: '1',
  time: '2:00 PM CT',
  goals: [                     // chronological goal log
    { team: 'home', minute: 23 },
    { team: 'away', minute: 67 },
    { team: 'home', minute: 89 }
  ],
  penalties_winner: null,      // 'home' | 'away' | null
  snapshot_minute: null        // set while match is live; null when complete
}
```

**Valid stage values:**
```
Group Stage  ·  Round of 32  ·  Round of 16  ·  Quarterfinal
Semifinal  ·  Third Place  ·  Final
```

### Tiers (`src/data/index.js`)

```js
{ team: 'Brazil', tier: 1, odds: 350, fifaRank: 1 }

// tier 1 = Contenders  (pre-tournament favorites)
// tier 2 = Challengers
// tier 3 = Wildcards
// tier 4 = Cinderellas (long shots)
```

---

## 💫 Pool Math & Prize Projections

See [`docs/methodology.md`](docs/methodology.md) for the complete deep-dive. Summary below.

### Semifinal / Final Point Projection (QF-Proxy Method)

With knockout matches still to play, we project future points using each team's **most recent Quarterfinal result as a performance proxy**.

```
  KNOWN                      PROJECTED
  ─────────────────────────────────────────────────────────
  QF points (×2 multiplier)
       │
       ├─ × 1.5  ──────────▶  Estimated SF points (×3 mul)
       │
       └─ × 2.0  ──────────▶  Estimated Final points (×4 mul)
```

This works because the multipliers scale linearly: SF/QF = 3/2 = 1.5, Final/QF = 4/2 = 2.0.

### Path To The Prize: Scenario Engine

The bracket locks in 4 possible Finals. Within each, either team can win — giving 8 total outcome scenarios.

```
  ╔═══════════════════════════════════════════════════════════╗
  ║                   FINAL FOUR BRACKET                     ║
  ╠═══════════════════════════════════════════════════════════╣
  ║                                                          ║
  ║   SF1: France  ──┐                                       ║
  ║                  ├──▶ ??? ──┐                            ║
  ║   SF1: Spain   ──┘          │                            ║
  ║                             ├──▶  FINAL  ──▶  CHAMPION  ║
  ║   SF2: England ──┐          │                            ║
  ║                  ├──▶ ??? ──┘                            ║
  ║   SF2: Argentina──┘                                      ║
  ║                                                          ║
  ╠═══════════════════════════════════════════════════════════╣
  ║  4 possible Finals × 2 possible winners = 8 scenarios    ║
  ╚═══════════════════════════════════════════════════════════╝
```

**For each scenario:**

```
  FOR EACH OF 8 OUTCOMES:
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │  1. Identify live teams at each remaining stage            │
  │                                                            │
  │  2. Each player earns:                                     │
  │     base pts + projected SF pts + projected Final pts      │
  │     (only for their picked teams that are still alive)     │
  │                                                            │
  │  3. Sort all 8 players by projected total                  │
  │                                                            │
  │  4. Record finish position for each player                 │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

  ACROSS ALL 8 SCENARIOS:
  ┌────────────────────────────────────────────────────────────┐
  │  bestFinish = best (lowest) rank achieved in any scenario  │
  │                                                            │
  │  1 → Can win the pool outright                             │
  │  2 → Can finish 2nd; cannot win                            │
  │  3 → Can finish 3rd; cannot win or place 2nd              │
  │  5 → Cannot reach the prize positions in any scenario      │
  └────────────────────────────────────────────────────────────┘
```

### Mathematical Elimination

```
  PLAYER IS MATHEMATICALLY ELIMINATED WHEN:
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │  All of their remaining live teams are SHARED with a       │
  │  player who currently has MORE POINTS.                     │
  │                                                            │
  │  Since shared teams earn IDENTICAL future points for       │
  │  both players, the current gap is PERMANENT —             │
  │  no scoreline can change the relative order.               │
  │                                                            │
  │  The elimination date = the day their last               │
  │  "independent" team (not shared with their blocker)       │
  │  was knocked out of the tournament.                       │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

  Example:
  ┌────────────────────────────────────────────┐
  │ Charley  162.5 pts  →  England             │
  │ Jay      167.0 pts  →  England + Spain     │
  │                                            │
  │ Both earn identical England points ahead.  │
  │ Jay's 4.5 pt lead is locked in forever.   │
  │ Charley cannot win 1st.  ✗                │
  │ Charley can still finish 2nd.  ✓           │
  └────────────────────────────────────────────┘
```

> Note: Elimination from **winning** (1st) is tracked separately from elimination from **prize contention** (top 3). A player can be done chasing 1st but still fighting for a podium finish.

### Score Sensitivity

Once a player's best-case scenario is known, we assess whether their target finish is guaranteed or score-dependent.

```
  SCORE-INDEPENDENT                 SCORE-DEPENDENT
  ──────────────────────────────    ──────────────────────────────
  Both players share all            Player needs their team to
  remaining teams →                 perform at/above a threshold →
  current gap is permanent,         specific score margins matter,
  result won't change regardless    flat performances can flip it
  of how many goals are scored

  Example: Charley vs Gabe          Example: Jason (France) vs
  Both pick England only.           Tommy (Argentina) in a
  Charley always finishes 5.5       France-wins Final:
  pts ahead regardless of           needs France to score near
  England's scoring output.         QF level or Tommy edges him.
```

---

## 🏊 Leaderboard Features

The leaderboard is the core view, built around a reactive computed `leaderboard` from the Pinia store. Each player card displays a dense badge system derived from computed analytics.

### Badge System (complete)

**Prize Path**

| Badge | Trigger |
|---|---|
| ⚡ In It | Can still win the pool outright |
| 🥈 2nd Max | Best possible finish is 2nd place |
| 🥉 3rd Max | Best possible finish is 3rd place |
| 🚫 No Path | Mathematically eliminated from all prize positions |
| 🚫 Jul XX | Date of mathematical elimination from prize contention |

**Standing & Momentum**

| Badge | Trigger |
|---|---|
| 👑 Crown (on name) | Current points leader |
| 🏊 Pacer | Current points leader (badge form) |
| 🔥 Trending | Most points earned over the last 3 matchdays |
| 🚀 On the Rise | Biggest standings jump since yesterday |
| 🪨 Sinker | Biggest standings drop since yesterday |
| 🌊 1st Wave | First time this player has reached 1st place |
| 👑🌊 Nd (on name) | Led the pool for the most match days overall |
| 🌊 Nd | Led the pool for N match days |
| 🎯 -N | Chasing — within close range of the leader |
| 📡 -N | In Reach — within a defined threshold of the leader |
| −N pts | Beyond reach — points behind the leader |

**Goals & Scoring**

| Badge | Trigger |
|---|---|
| ⚡ GB N | Overall Gold Boot — most total goals scored across all teams |
| ⚡ GB - GS N | Gold Boot (Group Stage only) |
| ⚡ GB - KO N | Gold Boot (Knockout Rounds only) |
| 🧤 GG N | Gold Glove — fewest goals conceded in the Group Stage |
| 🎯 Clinical | Most goals per game across all teams |
| 📈 N g/g | Peak GPG — all-time highest goals-per-game average in pool history |
| 🧊 Shrinkage | Fewest goals scored in the Group Stage |
| 🪃 N | Comeback Kid — most comeback wins (teams that trailed and won) |
| 💦 Early Finisher | Majority of goals scored in the first half |
| 🌙 N | Goals scored after the 80th minute |
| 👑🌙 N | Late Show leader — most goals scored after the 80th minute |

**Single-Day Performance**

| Badge | Trigger |
|---|---|
| 🥇 +N | Best single-day points total in the pool |
| 🥈 +N | 2nd best single-day points total in the pool |
| 🥇 2 20+ | Back-to-Back — two consecutive 20+ point matchdays |
| 🏆 N | Community Shield — most points through the Group Stage |
| 🥈 GS N | 2nd most Group Stage points |
| 🥉 GS N | 3rd most Group Stage points |
| 🌊 GS N | Group Stage points (4th or below) |

**Draft Strategy**

| Badge | Trigger |
|---|---|
| 💪 Ballsy | Picked below-average European teams by FIFA ranking |
| 🍍 Pro-Poly | Most teams shared with other pool players |
| 🥁 Diff Beat | Most teams no one else picked |
| 🛁 'Cuzzi Bros | Picked the single most-shared team in the pool |
| 🙄 Puhleez | Highest-ranked pool by average FIFA ranking (the snob pick) |
| 🫃 Swim Test | Lowest-ranked pool by average FIFA ranking |
| 💡 Mad Genius? | Least likely pool to win based on pre-tournament odds |
| 🦅🇺🇸 | Picked the USA |
| 👌🏴󠁧󠁢󠁥󠁮󠁧󠁿 | Picked England (Ok with Imperialism) |
| 👀 sus | Did not pick the USA. The US Government has been notified. |

**Discipline**

| Badge | Trigger |
|---|---|
| 🧽 Spotless | Fewest total cards with zero red cards |
| 🟨 N | Yellow card count across all teams |
| 👑🟨 N | Dirty Pool — most yellow cards in the pool |
| 🟥 N | Red card count across all teams |
| 👑🟥 N | Dirty Pool+ — most red cards in the pool |

**Team Health / Survival**

| Badge | Trigger |
|---|---|
| 🤽 Floaties | 4 or more teams still alive in the tournament |
| 🐟 1/2 Sunk | Exactly half of picked teams have been eliminated |
| 🏊 Undertow | Only 2 teams still alive |
| 🦵 Last Leg | Only 1 team still alive |
| 🍹 Poolside | No matches scheduled today for this player |
| 😤 Pool Bully | Most knockout wins against teams picked by other pool players |
| 🛟 LG Duty (on name + badge) | Most teams eliminated from the pool overall |
| 🧼 Washed Up | First pool player to have all teams eliminated |
| 🚿 Out of the Pool | All teams eliminated |
| 📋 FOIA | Jason is leading — data is public, available upon request |

### Path To The Prize Section

Below the leaderboard, a dedicated **Path To The Prize** section renders each player's prize path with:
- Their win condition in plain language
- A **Score Sensitivity** note (in cyan) explaining how score-dependent the path is
- Badge indicating their best achievable finish

---

## 📡 Views

| Route | View | Description |
|---|---|---|
| `/` | `Leaderboard.vue` | Live standings, badge system, path-to-prize |
| `/matches` | `Matches.vue` | Full match list with live scores |
| `/bracket` | `Bracket.vue` | Tournament bracket visualization |
| `/teams` | `Teams.vue` | All teams by tier with player associations |
| `/my-teams` | `MyTeams.vue` | Personal team view for each player |
| `/rules` | `Rules.vue` | Scoring rules and pool FAQ |
| `/wrapped` | `Wrapped.vue` | End-of-season Wrapped recap (gated) |

### Announcement Modal

A dismissible announcement system (`AnnouncementModal.vue`) fires on page load based on a unique `id` stored in `localStorage`. Used for milestone moments: phase transitions, elimination notices, final four previews.

```js
// src/data/announcement.js
export const announcement = {
  enabled: true,
  alwaysShow: false,         // set true during dev to always show
  id: 'unique-id-per-post',  // change to re-trigger for all players
  title: '...',
  body: '...',
  winPaths: [...],           // per-player prize path entries
  matchStage: 'Semifinal',   // filters featured matches shown in modal
  cta: '...',
  image: '/image.png',
}
```

---

## 🖥️ Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

Live scoring functions require env vars — the app runs fully without them, using `matches.json` as static data.

---

## 🚀 Deploy

### Netlify (recommended)

```bash
npm run build
```

Push to GitHub and connect the repo in Netlify. Set these env vars in the Netlify dashboard:

```
API_FOOTBALL_KEY   — api-sports.io key for live score fetching
GITHUB_TOKEN       — Personal access token (repo write scope)
GITHUB_OWNER       — your GitHub username
GITHUB_REPO        — this repo name
UPDATE_SECRET      — random string; clients must pass ?secret=<this>
VITE_UPDATE_SECRET — same value, exposed to client-side polling
```

### Vercel

```bash
npm i -g vercel && vercel
```

> ⚠️ Netlify Functions are Node.js-based and not directly portable to Vercel Edge — minor adaptation required.

---

## 📐 Full Methodology

→ [`docs/methodology.md`](docs/methodology.md)

Covers the complete analytical framework: scoring engine internals, QF-proxy projection math, 8-scenario prize path enumeration, mathematical elimination date derivation, and score sensitivity break-even calculations.

---

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░                    B U I L T   I N   T H E   G R I D                ░
░                   V U E  3  ·  P I N I A  ·  V I T E               ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```
