// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-13-semis-last-supper',
  title: 'Day 33/39 — The Final Four. Seats Not Guaranteed.',
  body: `Every player enters the Final Four with a live team. All 8 of you — in a pool this size, that wasn't very likely.\n\nSavor it. Because the two semifinals will eliminate between 2 and 6 of you before the Final is even played. Someone is getting up from this table no matter what.`,
  callout: { stat: '2 – 6', label: 'players eliminated before the Final' },
  winPaths: [
    { name: 'Tommy',   can: true,  path: 'Argentina wins the Final — either opponent.' },
    { name: 'Jared',   can: true,  path: 'Spain beats Argentina in the Final. Spain vs England is too tight — Jay edges him out.' },
    { name: 'Jason',   can: true,  path: 'France wins the Final — either opponent.' },
    { name: 'Jay',     can: true,  path: 'Spain & England both reach the Final (wins either way), or England beats France.' },
    { name: 'Charley', can: false, path: 'Jay always beats him when England wins — same points from here, 4.5pt deficit.' },
    { name: 'Gabe',    can: false, path: '10pts behind Jay with the same England upside.' },
    { name: 'Dan',     can: false, path: 'Jared always beats him when Spain wins.' },
    { name: 'James',   can: false, path: 'A Spain title gets him to ~176pts. Tommy already sits at 193.' },
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
