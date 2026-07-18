// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-18-sour-grapes-derby',
  title: 'Day 38/39 — The Sour Grapes Derby',
  body: `The players don't want to be here. The managers are rotating. Everyone's mentally on a beach somewhere.\n\nBut 3× points don't care about vibes — and if Mbappé or Bellingham shows up with something to prove, this "meaningless" match moves the leaderboard.`,
  callout: { stat: '3×', label: 'Third Place still counts' },
  pathsDisclaimer: 'Calculated before 3rd Place & Final',
  winPaths: [
    { name: 'Tommy',   can: true,  bestFinish: 1,
      path:  'Argentina wins the Final. Tommy leads at 175pts — any Argentina win at any scoreline is enough.',
      path2: 'Bulletproof. Argentina winning 1-0 earns Tommy +20pts while Jared earns 0 from Spain\'s loss. The 3.5pt gap becomes a 23.5pt win. No scoreline dependency.' },
    { name: 'Jared',   can: true,  bestFinish: 1,
      path:  'Spain wins the Final. Jared trails Tommy by just 3.5pts — Spain winning even 1-0 clears the gap immediately.',
      path2: 'Spain wins 1-0: Jared +20=191.5pts, Tommy earns 0=175pts. Jared wins by 16.5pts. Any Spain win works — one goal and a clean sheet is all it takes.' },
    { name: 'Jay',     can: true,  bestFinish: 1,
      path:  'Spain wins the Final AND England wins the 3rd place game. Jay is the only player with two live teams — 4× from the Final, 3× from 3rd place.',
      path2: 'England wins 3rd 2-0: +18→175pts. Spain wins Final 2-0: +24→199pts. Tommy (175pts) can\'t keep pace. Risk: if Argentina wins, Tommy pockets the big Final payout and Jay\'s Spain haul shrinks to just their goals in a loss.' },
    { name: 'Dan',     can: false, bestFinish: 3,
      path:  "Can't win 1st — Jay and Jared both hold Spain and start ahead. Can reach 3rd if Spain wins the Final with 3+ goals while Argentina stays scoreless.",
      path2: 'Spain wins 3-0: Dan +28=176pts, Tommy stays 175pts (Argentina scored 0) — Dan takes 3rd by 1pt. Any Argentina goal in the Final and Tommy stays above Dan. Razor thin.' },
    { name: 'Jason',   can: false, bestFinish: 3,
      path:  'Can still reach 3rd — France plays England in the 3rd place match (3×). Needs France to win convincingly and Argentina to win the Final with Spain scoring 0 goals.',
      path2: 'France winning 3-0 brings Jason to ~160pts. The obstacle is Jay — every Spain goal in the Final earns Jay points too. Spain stays scoreless and Argentina runs away: podium opens up.' },
    { name: 'Charley', can: false, bestFinish: 4,
      path:  'No prize path. England is in the 3rd place game (3×, not the Final). Even England winning 5-0 only brings Charley to 161.5pts — Jared is already at 171.5pts and still earns Final points on top.',
      path2: 'The gap to Jay is permanent — identical England picks mean he\'s always 22.5pts ahead. Best finish is 4th.' },
    { name: 'Gabe',    can: false, bestFinish: 4,
      path:  'No prize path. Same situation as Charley — England is in the 3rd place game and the Final\'s 4× multiplier belongs to Spain and Argentina only.',
      path2: 'Tied with Charley throughout. The prize window closed when England lost to Argentina in the semifinal.' },
    { name: 'James',   can: false, bestFinish: 5,
      path:  'No prize path. James holds Spain but Dan (148pts) always earns the same Final payout with a 17.5pt head start — that gap never closes.',
      path2: "Didn't work out for you this Cup, but you'll always have a saved seat next to your favorite 'cuzzi jet." },
  ],
  showPathLink: true,
  matchStage: 'Third Place',
  multipliers: [
    { stage: 'Third Place', multiplier: '3×', pillClass: 'pill-t2' },
    { stage: 'Final',       multiplier: '4×', pillClass: 'pill-t1' },
  ],
  cta: 'Fine. Let\'s Watch.',
  image: '/sour-grapes.png',
}
