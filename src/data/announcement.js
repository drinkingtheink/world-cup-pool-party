// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-04-blue-sharks',
  title: 'Day 24 of World Cup 2026',
  body: `Nobody picked Cape Verde to be here. \n\nThey pushed Argentina to extra time yesterday and had a gorgeous equalizer in the 103rd minute. The Blue Sharks go home with their cephalofoils held high.\n\nHappy first day of Round of 16!`,
  cta: 'Would have been a lot cooler if you did',
  multipliers: [
    { stage: 'Round of 16',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/blue-sharks.png',
}
