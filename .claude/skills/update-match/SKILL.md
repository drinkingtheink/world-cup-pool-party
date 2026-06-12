---
name: update-match
description: Fetch live or final match data from ESPN and update src/data/matches.json
---

The user wants to update a match in `src/data/matches.json` with real score, goal, and card data.

## Arguments
Args will be two team names, e.g. `/update-match South Korea Czech Republic` or `/update-match England vs Croatia`.
Strip "vs" if present. Home team is listed first in matches.json — use that order to find the match.

## Steps

### 1. Find the match in matches.json
Read `src/data/matches.json`. Find the entry where `home` and `away` match the provided team names (case-insensitive, partial match ok). Confirm the match with the user if ambiguous.

### 2. Fetch match data from ESPN
Search: `"{home} vs {away}" 2026 FIFA World Cup ESPN score goals cards`
From the results, grab the ESPN match URL (pattern: `espn.com/soccer/match/_/gameId/...`).
Fetch that URL with this prompt:
> Give me: (1) final score home and away, (2) match status — final or in progress + current minute, (3) every goal with minute and which team (home/away), (4) every card with minute, team (home/away), and type (yellow/red). If the match is not yet played, say so.

### 3. Confirm before writing (if in progress)
If the match is still in progress, tell the user the current score and ask if they want to save it now or wait for the final whistle.

### 4. Update matches.json
Read `src/data/matches.json`. Find the match by home+away. Update ONLY these fields:
- `home_score` — string, e.g. `"2"`
- `away_score` — string, e.g. `"0"`
- `goals` — array of `{ "team": "home"|"away", "minute": <number> }`, chronological
- `cards` — array of `{ "team": "home"|"away", "minute": <number>, "type": "yellow"|"red" }`, chronological
- `penalties_winner` — `"home"`, `"away"`, or `null`

Use `Read` then `Edit` (not `Write`) so other matches are not touched.
For stoppage-time minutes, use the base minute + stoppage (e.g. 90+2 → 92).

### 5. Report back
Show a compact summary:
- Score
- Goals (minute + side)
- Cards (minute + side + type)
- Which pool players benefit and estimated points earned
