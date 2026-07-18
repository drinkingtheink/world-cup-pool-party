// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-18-sour-grapes-derby',
  title: 'Day 38/39 — The Sour Grapes Derby',
  body: `Nobody wanted 3rd place. France wanted the Final. England wanted the Final. And yet — here we are.\n\nTeams usually rest their stars in the consolation match. But Mbappé is chasing the Golden Boot, and 3× multiplier goals hit different. Whether Deschamps deploys him could decide whether Jason has a pulse in this pool.\n\nFor 7 of you, this is background noise. For Jason — your Group Stage champion, now in the consolation bracket — it's the whole season.`,
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
