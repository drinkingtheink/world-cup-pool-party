export function matchSlug(m) {
  const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `match-${m.date}-${slug(m.home)}-vs-${slug(m.away)}`
}
