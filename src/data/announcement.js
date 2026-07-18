// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-18-sour-grapes-derby',
  title: 'Day 38/39 — The Sour Grapes Derby',
  body: `The players don't want to be here. The managers are rotating. Everyone's mentally on a beach somewhere.\n\nBut 3× points don't care about vibes — and if Mbappé or Bellingham shows up with something to prove, this "meaningless" match moves the leaderboard.`,
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
