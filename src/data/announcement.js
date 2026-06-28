// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: true,
  id: '2026-06-28-knockout-rounds',
  title: 'Knockout Rounds Begin',
  body: `The group stage is over — now every match matters. A team that was quiet in groups can rocket your standings overnight.\n\nKeep an eye on your squads — the bracket is set.`,
  multipliers: [
    { stage: 'Round of 32',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Round of 16',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/knockout-banner.png',
}
