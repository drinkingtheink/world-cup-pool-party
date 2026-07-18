// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-18-sour-grapes-derby',
  title: 'Day 38/39 — The Sour Grapes Derby',
  body: `Nobody wants to be here. France wanted the Final. England wanted the Final. The 3rd place game is football's most polite participation trophy — and both squads know it.\n\nExpect rotations. Expect rust. Expect players mentally already on vacation.\n\nUnless Mbappé needs goals. Unless Bellingham has a point to prove. If those two show up hungry, this game forgets it's supposed to be meaningless.`,
  callout: { stat: '3×', label: 'Third Place still counts' },
  showPathLink: true,
  matchStage: 'Third Place',
  multipliers: [
    { stage: 'Third Place', multiplier: '3×', pillClass: 'pill-t2' },
    { stage: 'Final',       multiplier: '4×', pillClass: 'pill-t1' },
  ],
  cta: 'Fine. Let\'s Watch.',
  image: '/sour-grapes.png',
}
