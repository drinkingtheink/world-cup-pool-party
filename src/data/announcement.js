// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-13-semis-last-supper',
  title: 'Day 33/39 — The Final Four. Seats Not Guaranteed.',
  body: `Every player enters the Final Four with a live team. All 8 of you — in a pool this size, that wasn't very likely.\n\nSavor it. Because the two semifinals will eliminate between 2 and 6 of you before the Final is even played. Someone is getting up from this table no matter what.\n\nAnd for half of you, the math already has an answer — you have teams still in the competition, but you cannot win the Pool Prize.`,
  callout: { stat: '2 – 6', label: 'players eliminated before the Final' },
  winPaths: [
    { name: 'Tommy',   can: true,  bestFinish: 1, path: 'Argentina wins the Final — either opponent.' },
    { name: 'Jared',   can: true,  bestFinish: 1, path: 'Spain beats Argentina in the Final. A Spain vs England Final is a genuine toss-up with Jay.' },
    { name: 'Jason',   can: true,  bestFinish: 1, path: 'France wins the Final — either opponent.' },
    { name: 'Jay',     can: true,  bestFinish: 1, path: 'England beats France or Argentina in the Final. A Spain vs England Final is a toss-up with Jared.' },
    { name: 'Charley', can: false, bestFinish: 2, path: "Can't win 1st — but can finish 2nd if England wins the Final." },
    { name: 'Gabe',    can: false, bestFinish: 3, path: "Can't win 1st — but can finish 3rd if England wins the Final." },
    { name: 'Dan',     can: false, bestFinish: 3, path: "Can't win 1st — but can finish 3rd if Spain wins the Final." },
    { name: 'James',   can: false, bestFinish: 5, path: 'No prize path. Even a Spain title gets him to ~176pts — Tommy already sits at 193.' },
  ],
  matchStage: 'Semifinal',
  cta: 'Live Mas. The Math Cometh.',
  multipliers: [
    { stage: 'Semifinal',   multiplier: '3×', pillClass: 'pill-t2' },
    { stage: 'Third Place', multiplier: '3×', pillClass: 'pill-t2' },
    { stage: 'Final',       multiplier: '4×', pillClass: 'pill-t1' },
  ],
  image: '/last-supper.png',
}
