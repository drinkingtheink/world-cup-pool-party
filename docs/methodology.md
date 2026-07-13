# Pool Math Methodology

Analytical methods used for standings projections, prize-path determination, and elimination tracking. Covers the semifinal / final phase of the 2026 pool.

---

## 1. Scoring Engine

Source: `src/services/points.js`

Every match awards points to each player whose team participated. The raw score is calculated first, then multiplied by the stage multiplier.

### Raw points per team per match

| Event | Points |
|---|---|
| Win | +3 |
| Draw | +1 |
| Goal scored (regular time + ET, not penalties) | +1 each |
| Clean sheet | +1 |
| First goal of the match | +1 |
| Comeback win (team trailed at some point) | +2 |
| Win on penalties | +2 |

### Stage multipliers

| Stage | Multiplier |
|---|---|
| Group Stage | ×1 |
| Round of 32 | ×1.5 |
| Round of 16 | ×1.5 |
| Quarterfinal | ×2 |
| Semifinal | ×3 |
| Third Place | ×3 |
| Final | ×4 |

**Formula:** `(raw points) × (stage multiplier)` = match points

**Example:** A team wins 2–1, scoring the first goal and mounting a comeback. Raw = 3 (W) + 2 (goals) + 1 (FG) + 2 (CB) = 8. In a Quarterfinal: 8 × 2 = **16 pts**.

### Live / in-progress scoring (snapshot mode)

When a match is in progress, only goals scored and the first-goal bonus are tracked (no result, clean sheet, or comeback bonuses yet). These are finalized on match completion.

---

## 2. Semifinal / Final Point Projection (QF-Proxy Method)

With SF and Final matches unplayed, we estimate future points using each team's **actual Quarterfinal match as a proxy for their scoring level**.

### Why QF as proxy?

The QF is the most recent completed high-stakes match for each remaining team. It reflects current form at the same competition intensity.

### Conversion

| Projected stage | Formula | Reasoning |
|---|---|---|
| Semifinal (×3) | QF pts × 1.5 | SF multiplier (3) is 1.5× the QF multiplier (2) |
| Final (×4) | QF pts × 2 | Final multiplier (4) is 2× the QF multiplier (2) |

**Example:** A team earned 14 pts in the QF (7 raw × ×2).  
Projected SF: 14 × 1.5 = **21 pts** · Projected Final: 14 × 2 = **28 pts**

### Limitations

- Assumes consistent raw performance (same goals, same bonuses)
- Actual results will vary — this is a central estimate, not a guarantee
- Used only for comparison and prize-path analysis, never displayed as a hard prediction

---

## 3. Path To The Prize

Determines each player's best achievable pool finish given the remaining bracket.

### Bracket structure (Final Four)

```
SF1: France  vs Spain     → winner to Final
SF2: England vs Argentina → winner to Final
```

This produces exactly **4 possible Finals**:

| Final | Notes |
|---|---|
| France vs England | France wins SF1, England wins SF2 |
| France vs Argentina | France wins SF1, Argentina wins SF2 |
| Spain vs England | Spain wins SF1, England wins SF2 |
| Spain vs Argentina | Spain wins SF1, Argentina wins SF2 |

Within each Final, either team can win — giving **8 total scenarios**.

### How each scenario is computed

For each of the 8 outcomes:
1. Identify which teams are alive at each stage (SF winner, Final winner/runner-up)
2. Each player earns projected points for every live team they picked
3. Sum base points + projected SF points + projected Final points (where applicable)
4. Sort all 8 players by projected total → assign finish positions

### Assigning bestFinish

Each player's `bestFinish` is the highest (lowest numeric) finish they can achieve across all 8 scenarios:
- `1` — can win the pool outright in at least one scenario
- `2` — can finish 2nd in at least one scenario, but cannot win
- `3` — can finish 3rd in at least one scenario, but cannot win or place 2nd
- `5` — cannot finish in the prize positions (top 3) in any scenario

Players with `bestFinish > 3` are considered **mathematically eliminated from prize contention**.

### Shared-team constraint

When two players both pick the same team, they earn **identical future points** from that team. This means the current points gap between them is permanent for that team's contribution. If one player's only remaining live teams are all shared with a higher-ranked player, they cannot overtake that player — regardless of how many matches remain.

---

## 4. Mathematical Elimination

A player is mathematically eliminated from **winning the pool** when there is no remaining scenario in which they can outscore the current leader.

### Key mechanism: shared-team blocking

If Player A and Player B both have Team X as their only relevant remaining team, and Player A currently leads Player B, then Player B **cannot overtake Player A via Team X** — they earn identical points from that team from this point forward. Player B can only win if they have *other* live teams that Player A does not have, and those teams earn enough additional points to close the gap.

### Elimination date determination

For each eliminated player, we identify the date when the blocking condition became permanent:

1. Find the player's "independent teams" — teams not shared with the player who eventually blocks them
2. Identify when those independent teams were eliminated from the tournament
3. From that date forward, the blocked player's only live teams are shared — the gap is locked in

The elimination date is when the last independent team was eliminated, provided the blocking player was already ahead at that point.

### Example (Charley)

Charley's only remaining live team is England. Jay also has England — and Jay has a higher point total. Since they earn identical England points going forward, Charley cannot overtake Jay for 1st. Charley was mathematically eliminated from **winning** when his last non-Jay-overlapping live team was eliminated and Jay was ahead.

Note: Mathematical elimination from **winning** (1st place) is distinct from elimination from **prize contention** (top 3). Charley cannot win 1st but can still finish 2nd.

---

## 5. Score Sensitivity

After determining *whether* a player can win or place, we assess *how reliably* they can achieve that finish — i.e., whether it depends on specific score margins or holds across all realistic outcomes.

### Score-independent result

A result is **score-independent** when all players involved earn the same future points from a shared team pool. The relative gap between them is locked in regardless of how many goals are scored.

**Example:** Charley and Gabe both pick England and have no other live teams. Jay also picks England. In any England-wins-Final scenario, all three earn identical England SF + Final points. Their finishing order is determined entirely by their current point totals — no scoreline can change it.

**Example:** Jay always finishes exactly 4.5 pts ahead of Charley in any England-wins scenario, because that is their current gap and they share all remaining points.

### Score-dependent result

A result is **score-dependent** when a player needs their team to perform at or above a certain level to achieve the target finish.

The break-even is calculated as:

```
Player A wins when:
  (Player A base) + (A's future projected pts) > (Player B base) + (B's future projected pts)
```

Rearranged to find the minimum performance threshold.

**Example:** Jason (France) vs Tommy (Argentina) in a France-wins-Final scenario:

Jason needs: `FranceSF + FranceFinal > ArgSF + 23.5` (the current base gap)

At QF-proxy estimates (France 49 combined, Argentina SF 21): Jason leads by ~4.5 pts.  
At minimum scoring (France 28 combined, Argentina SF 12): Tommy leads by ~7.5 pts.  
→ Score-dependent: France needs to perform near QF level.

### Score sensitivity labels in the UI

The **Score Sensitivity** section under each player's Path To The Prize entry describes:
- Whether their target finish is guaranteed (score-independent)
- The approximate margin at estimated scoring
- What would need to go wrong for the result to flip
