// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-05-eng-mex',
  title: 'Mexico vs England — Tonight at 7 PM CT',
  body: `The Imperialists threaten invasion! But this land was defended long before a ball was ever kicked on it.\n\nCharley and Jay are backing England. Dan and Jared are riding with El Tri.\n\nGabe picked both. He cannot lose.`,
  cta: 'Guide my blade, Tenochtitlan',
  multipliers: [
    { stage: 'Round of 16',  multiplier: '1.5×', pillClass: 'pill-t4' },
    { stage: 'Quarterfinal', multiplier: '2×',   pillClass: 'pill-t3' },
    { stage: 'Semifinal',    multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Third Place',  multiplier: '3×',   pillClass: 'pill-t2' },
    { stage: 'Final',        multiplier: '4×',   pillClass: 'pill-t1' },
  ],
  image: '/aztec-warriors.png',
}
