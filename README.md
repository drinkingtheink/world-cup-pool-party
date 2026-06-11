# ⚽ WC Pool Party 2026

Vue 3 + Vite mobile-first app for running a World Cup pool. All data lives in a single file — no backend, no API keys, no external dependencies.

---

## How It Works

All players, matches, and team tiers are defined in `src/data/index.js`. Edit that file to update picks, enter scores, and manage tiers. The app recalculates standings automatically on every save.

---

## Data Structure

### Players
Each player gets six team picks:
```js
{ name: 'Alice', team1: 'Brazil', team2: 'France', team3: 'Japan', team4: 'Ecuador', team5: 'Ghana', team6: 'Qatar' }
```

### Matches
```js
{ date: '2026-06-11', stage: 'Group Stage', home: 'Mexico', away: 'USA', home_score: '', away_score: '', bonuses: '', time: '2:00 PM CT' }
```

Leave `home_score`/`away_score` blank for upcoming matches.

Stage values (exact casing): `Group Stage`, `Round of 32`, `Round of 16`, `Quarterfinal`, `Semifinal`, `Third Place`, `Final`

Bonus flags (comma-separated, no spaces):
`home_first_goal`, `away_first_goal` (+1 each)
`home_comeback`, `away_comeback` (+2 each)
`home_penalties`, `away_penalties` (+2 each)

### Tiers
```js
{ team: 'Brazil', tier: 1 }  // 1 = Contenders, 4 = Cinderellas
```

---

## Run Locally

```
npm install
npm run dev
```

Open http://localhost:5173

---

## Deploy

**Netlify:** `npm run build` → drag `dist/` to netlify.com/drop

**Vercel:** `npm i -g vercel && vercel`

---

## Scoring

| Event | Points |
|---|---|
| Win | +3 |
| Draw | +1 |
| Goal scored | +1 |
| Clean sheet | +1 |
| First goal bonus | +1 |
| Comeback win | +2 |
| Win on penalties | +2 |

**Stage multipliers:** R32/R16 ×1.5 · QF ×2 · SF ×3 · Final ×4
