// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: false,
  alwaysShow: false,
  id: '2026-07-11-qtrs-messi-vikings',
  title: 'Day 31/39 — Can Messi Keep Up the Magic? Can the Vikings Fend Off the English Incursion?',
  body: `Charley is somehow cheering for both Norway and England today. Tommy has Argentina and Switzerland tonight. Neither can lose a game — but only one of them rakes in more points.`,
  cta: 'May the best hedge win',
  multipliers: [
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/messi-shocked.png',
}
