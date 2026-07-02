// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: true,
  id: '2026-07-02-spain',
  title: 'Spain. Again.',
  body: `Spain beat Austria 3-0 today and are through to the Round of 16. Again.\n\nLa Roja have now won all three group stage matches and haven't conceded a single goal. Jacuzzi Bros officially thrown into a tizzy!\n\nYou had one job, Austria.`,
  cta: 'Someone Please Disinfect This Jacuzzi',
  multipliers: [
    { stage: 'Round of 32',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Round of 16',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/hot-tub.png',
}
