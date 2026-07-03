// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: true,
  id: '2026-07-03-cr7',
  title: 'Day 23 of the World Cup 2026',
  body: `"DJT owed me a favor. I collected. Croatia is gone.\n\nYou're welcome, Tommy."\n\n— Cristiano Ronaldo`,
  cta: 'I Accept this Ronaldomaxxing',
  multipliers: [
    { stage: 'Round of 32',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Round of 16',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/cr7-bust.png',
}
