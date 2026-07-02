// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: false,
  alwaysShow: false,
  id: '2026-06-30-haaland',
  title: 'A Message from Erling Haaland',
  body: `"In Texas they give me BBQ elephant. Slow smoked for 90+ mins. My teammates say: Erling, you cannot eat the whole elephant. I eat two."\n\n— Erling Haaland, AT&T Stadium, Dallas`,
  multipliers: [
    { stage: 'Round of 32',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Round of 16',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/haaland.png',
}
