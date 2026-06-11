# ⚽ WC Pool 2026

Vue 3 + Vite mobile-first app. Reads from a publicly published Google Sheet — no backend, no API key needed. Scores update automatically every 2 minutes.

---

## 1. Set Up Your Google Sheet

Create a new Google Sheet with **3 tabs** named exactly: `players`, `matches`, `tiers`

### Tab: players
Columns: name | team1 | team2 | team3 | team4 | team5 | team6 | chosen1 | chosen2
- chosen1/chosen2 = the 2 teams the player freely picked; other 4 came from tiered draw
- One row per player, 8 rows total

### Tab: matches
Columns: date | stage | home | away | home_score | away_score | bonuses | time

Stage values (exact casing): Group Stage, Round of 32, Round of 16, Quarterfinal, Semifinal, Third Place, Final

Bonus flags (comma-separated, no spaces):
  home_first_goal, away_first_goal (+1 each)
  home_comeback, away_comeback (+2 each)
  home_penalties, away_penalties (+2 each)

Leave home_score/away_score blank for upcoming matches.

### Tab: tiers
Columns: team | tier (1=favorites, 4=underdogs)

---

## 2. Publish the Sheet

File → Share → Publish to web → Entire Document → Web page → Publish
Copy your Sheet ID from the URL: docs.google.com/spreadsheets/d/SHEET_ID/edit

---

## 3. Configure

  cp .env.example .env.local
  # Edit .env.local and set VITE_SHEET_ID=your_sheet_id

---

## 4. Run Locally

  npm install
  npm run dev

Open http://localhost:5173

---

## 5. Deploy Free

Netlify: npm run build → drag dist/ to netlify.com/drop → add VITE_SHEET_ID env var
Vercel:  npm i -g vercel && vercel → add VITE_SHEET_ID in project settings

---

## Scoring

Win +3 | Draw +1 | Goal +1 | Clean sheet +1 | First goal +1 | Comeback +2 | Pens +2
R32/R16 ×1.5 | QF ×2 | SF ×3 | Final ×4

The app auto-refreshes every 2 minutes. Tap ↻ to force refresh.
