// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-08-wc-cold-turkey',
  title: 'World Cup Cold Turkey Day',
  body: `We have just undergone 27 days of continual matches. Now they cut us off Cold Turkey with no games today. About to get real Lord of the Flies in here!`,
  cta: 'Hello Darkness',
  multipliers: [
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/wc-lonely.png',
}
