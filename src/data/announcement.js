// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: false,
  alwaysShow: false,
  id: '2026-07-10-qtrs-spain-belgium',
  title: 'Hot Tub, Cold Truth',
  body: `Spain vs Belgium today — and multiple pool entries could cook in their own soup before dinner. La Roja run hot. Will Belgium survive the soak?`,
  cta: 'Press to turn on jets',
  multipliers: [
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/jacuzzi-bros.png',
}
