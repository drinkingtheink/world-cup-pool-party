// ─── Announcement Modal ───────────────────────────────────────────────────────
// Change `id` whenever you want the modal to re-appear for everyone.
// Set `alwaysShow: true` during testing so it fires on every page load.
// Set `image` to a path like '/knockout-banner.png' or null to omit.

export const announcement = {
  enabled: true,
  alwaysShow: false,
  id: '2026-07-14-england-argentina',
  title: 'Day 34/39 — The Grudge Match',
  body: `England and Argentina. The Hand of God. The Beckham red card. Forty years of World Cup folklore traded back and forth in the most loaded fixture in the game.\n\nTomorrow it lands in your pool — and the sides couldn't be more uneven. Jay, Charley, and Gabe are all riding England. Tommy stands alone with Argentina. One team goes to the Final against Spain. The other joins France in the Third Place match.\n\nSpeaking of which: the first semi is in the books. Les Bleus fell quietly, 0–2 to Spain. Jason — your Group Stage champion — has officially been relegated to the consolation bracket.`,
  callout: { stat: '3 vs 1', label: 'England holders vs Tommy' },
  matchStage: 'Semifinal',
  multipliers: [
    { stage: 'Semifinal',   multiplier: '3×', pillClass: 'pill-t2' },
    { stage: 'Third Place', multiplier: '3×', pillClass: 'pill-t2' },
    { stage: 'Final',       multiplier: '4×', pillClass: 'pill-t1' },
  ],
  cta: 'I Remember when Jason won the group stage',
  image: '/lfg-dog.png',
}
