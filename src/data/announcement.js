// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-13-semis-last-supper',
  title: 'Day 33/39 — The Raging Semis Erupt Tomorrow!',
  body: `Every player enters the Final Four with a live team. All 8 of you — in a pool this size, that wasn't very likely.\n\nSavor it. Because the two semifinals will eliminate between 2 and 6 of you before the Final is even played. Someone is getting up from this table no matter what.\n\nAnd for half of you, the math already has an answer — you have teams still in the competition, but you cannot win the Top Pool Prize.`,
  callout: { stat: '2 – 6', label: 'players eliminated before the Final' },
  winPaths: [
    { name: 'Tommy',   can: true,  bestFinish: 1,
      path:  'Argentina wins the Final — either opponent.',
      path2: 'Both routes are bulletproof. Even 1-0 wins all the way add 28pts and you win every scenario by 20+.' },
    { name: 'Jared',   can: true,  bestFinish: 1,
      path:  'Spain beats Argentina in the Final. A Spain vs England Final is a genuine toss-up with Jay.',
      path2: 'Spain vs Argentina is solid — Spain earns SF and Final points while Tommy only picks up Argentina\'s SF. The only danger: Argentina has a great SF AND Spain is flat.' },
    { name: 'Jason',   can: true,  bestFinish: 1,
      path:  'France wins the Final — either opponent.',
      path2: 'France vs England is bulletproof — Tommy and Jared earn nothing more. France vs Argentina is score-dependent: you lead Tommy by ~4.5pts at estimated scoring, but a flat France run flips it to Tommy.' },
    { name: 'Jay',     can: true,  bestFinish: 1,
      path:  'England beats France or Argentina in the Final. A Spain vs England Final is a toss-up with Jared.',
      path2: 'England vs France is solid and score-independent — your 4.5pt head start over Charley is permanent. Spain-England is the coin-flip: one England goal in the SF could flip 1st between you and Jared.' },
    { name: 'Charley', can: false, bestFinish: 2,
      path:  "Can't win 1st — but can finish 2nd if England wins the Final.",
      path2: '2nd place is locked regardless of scorelines — you and Jay earn identical England points, so your 4.5pt gap to him is permanent. You also stay 5.5pts clear of Gabe.' },
    { name: 'Gabe',    can: false, bestFinish: 3,
      path:  "Can't win 1st — but can finish 3rd if England wins the Final.",
      path2: 'England beats France: 3rd is secure. England beats Spain: you edge Jared for 3rd by an estimated 0.5pts — one extra Spain goal in the SF and Jared jumps you.' },
    { name: 'Dan',     can: false, bestFinish: 3,
      path:  "Can't win 1st — but can finish 3rd if Spain wins the Final.",
      path2: 'Spain vs Argentina: 3rd is comfortable, ~10pt lead over Jay. Spain vs England: tight — you lead Tommy by just ~2pts at estimated scoring. Flat Spain performances close that margin fast.' },
    { name: 'James',   can: false, bestFinish: 5,
      path:  'No prize path. Even a Spain title gets him to ~176pts — Tommy already sits at 193.' },
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
