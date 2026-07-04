import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { players as rawPlayers, matches as staticMatches, tiers as rawTiers, GROUP_MAP } from '../data/index.js'
import { buildLeaderboard, enrichMatches } from '../services/points.js'

// Live minute is estimated client-side rather than read from matches.json — the server
// only commits on score/goal/card events now, so committed snapshot_minute can be stale.
// When we have a recent anchor (real ESPN minute from the last autoUpdateScores poll),
// extrapolate forward from it; otherwise fall back to a plain kickoff-time estimate
// (45-min half + 15-min halftime break, capped at 90).
function estimateMinute(start, now, anchor) {
  if (anchor) {
    const drift = (now.getTime() - anchor.capturedAt) / 60000
    return Math.max(1, Math.round(anchor.minute + drift))
  }
  const elapsed = (now.getTime() - start.getTime()) / 60000
  if (elapsed < 0) return null
  if (elapsed <= 45) return Math.max(1, Math.ceil(elapsed))
  if (elapsed <= 60) return 45
  return Math.min(90, Math.ceil(elapsed - 15))
}

// CT = CDT (UTC-5) during tournament months
function parseMatchTime(date, timeStr) {
  const m = timeStr?.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return null
  let hour = Number(m[1])
  if (m[3].toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (m[3].toUpperCase() === 'AM' && hour === 12) hour = 0
  return new Date(`${date}T${String(hour).padStart(2, '0')}:${m[2]}:00-05:00`)
}

const MATCHES_URL = import.meta.env.DEV
  ? '/matches.json'
  : 'https://raw.githubusercontent.com/drinkingtheink/world-cup-pool-party/main/src/data/matches.json'

// Module-scope refs so both HMR and the poll can update them
const rawMatches = ref(staticMatches)

// Real ESPN minute readings from the last autoUpdateScores call, keyed by "home__away".
// Used to resync the live-minute estimate without needing a git commit per tick.
const liveAnchors = ref({})

async function pollMatchData() {
  try {
    const res = await fetch(`${MATCHES_URL}?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return
    const fetched = await res.json()
    // Never let a stale CDN response erase scores we already have locally
    const current = rawMatches.value
    rawMatches.value = fetched.map((m, i) => {
      const cur = current[i]
      if (cur && cur.home === m.home && cur.away === m.away &&
          (cur.home_score !== '' || cur.snapshot_minute) &&
          m.home_score === '') {
        return cur
      }
      return m
    })
  } catch {}
}

// In dev, update instantly when matches.json is saved — no page reload needed
if (import.meta.hot) {
  import.meta.hot.accept('../data/index.js', (newModule) => {
    if (newModule?.matches) rawMatches.value = newModule.matches
  })
}

async function autoUpdateScores() {
  const secret = import.meta.env.VITE_UPDATE_SECRET
  if (!secret) return
  try {
    const res = await fetch(`/.netlify/functions/update-matches?secret=${encodeURIComponent(secret)}`, { cache: 'no-store' })
    if (!res.ok) return
    const { live } = await res.json()
    const capturedAt = Date.now()
    for (const m of live || []) {
      if (m.minute == null) continue
      liveAnchors.value[`${m.home}__${m.away}`] = { minute: m.minute, capturedAt }
    }
  } catch {}
}

export const usePoolStore = defineStore('pool', () => {
  const now = ref(new Date())
  let lastAutoUpdate = 0

  setInterval(async () => {
    now.value = new Date()
    const inMatchWindow = rawMatches.value.some(m => {
      if (m.home_score !== '' && !m.snapshot_minute) return false
      const start = parseMatchTime(m.date, m.time)
      if (!start) return false
      const end = new Date(start.getTime() + 130 * 60 * 1000)
      return now.value >= start && now.value < end
    })
    if (!inMatchWindow) return
    await pollMatchData()
    if (Date.now() - lastAutoUpdate > 3 * 60 * 1000) {
      lastAutoUpdate = Date.now()
      autoUpdateScores()
    }
  }, 60_000)

  // implied win probability = 100 / (americanOdds + 100)
  const oddsMap = computed(() => {
    const map = {}
    rawTiers.forEach(t => { if (t.odds) map[t.team] = 100 / (t.odds + 100) })
    return map
  })

  const leaderboard = computed(() => {
    const goalsMap = {}
    rawPlayers.forEach(p => {
      const teams = new Set([p.team1,p.team2,p.team3,p.team4,p.team5,p.team6].filter(Boolean))
      let g = 0
      rawMatches.value.forEach(m => {
        ;(m.goals ?? []).forEach(goal => {
          if (teams.has(goal.team === 'home' ? m.home : m.away)) g++
        })
      })
      goalsMap[p.name] = g
    })
    return buildLeaderboard(rawPlayers, rawMatches.value)
      .sort((a, b) => b.total - a.total || (goalsMap[b.name] ?? 0) - (goalsMap[a.name] ?? 0))
      .map((entry, i) => ({ ...entry, rank: i + 1 }))
  })

  const teamPlayerMap = computed(() => {
    const map = {}
    rawPlayers.forEach(p => {
      [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean).forEach(t => {
        if (!map[t]) map[t] = []
        map[t].push(p.name)
      })
    })
    return map
  })

  const enrichedMatches = computed(() =>
    enrichMatches(rawMatches.value).map(m => {
      const base = {
        ...m,
        homePlayers: teamPlayerMap.value[m.home] ?? [],
        awayPlayers: teamPlayerMap.value[m.away] ?? [],
      }
      if (base.played || !m.time) return base
      const start = parseMatchTime(m.date, m.time)
      if (!start) return base
      const anchor = liveAnchors.value[`${m.home}__${m.away}`]

      if (base.snapshot_minute) {
        return { ...base, liveMinute: estimateMinute(start, now.value, anchor) }
      }

      const end = new Date(start.getTime() + 115 * 60 * 1000)
      const autoLive = now.value >= start && now.value < end
      if (!autoLive) {
        const msUntil = start.getTime() - now.value.getTime()
        if (msUntil > 0 && msUntil <= 30 * 60 * 1000) return { ...base, startingSoon: true }
        return base
      }
      return { ...base, autoLive, liveMinute: estimateMinute(start, now.value, anchor) }
    })
  )

  const tierMap = computed(() => {
    const map = {}
    rawTiers.forEach(t => { map[t.team] = Number(t.tier) })
    return map
  })

  const fifaRankMap = computed(() => {
    const map = {}
    rawTiers.forEach(t => { if (t.fifaRank) map[t.team] = t.fifaRank })
    return map
  })

  const paperStrength = computed(() => {
    const ranked = rawPlayers
      .map(p => {
        const teams = [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
        const score = teams.reduce((sum, t) => sum + (oddsMap.value[t] ?? 0), 0)
        return { name: p.name, score, teams }
      })
      .filter(p => p.teams.length > 0)
      .sort((a, b) => b.score - a.score)
    const max = ranked[0]?.score ?? 1
    return ranked.map(p => ({ ...p, pct: p.score / max }))
  })

  const groupOf = computed(() => GROUP_MAP)

  const tierGroups = computed(() => {
    const groups = { 1: [], 2: [], 3: [], 4: [] }
    rawTiers.forEach(t => {
      const n = Number(t.tier)
      if (groups[n]) groups[n].push(t.team)
    })
    const rankOf = team => rawTiers.find(t => t.team === team)?.fifaRank ?? 999
    Object.values(groups).forEach(g => g.sort((a, b) => rankOf(a) - rankOf(b)))
    return groups
  })

  return {
    players: rawPlayers,
    matches: rawMatches,
    tiers: rawTiers,
    leaderboard,
    enrichedMatches,
    tierMap,
    tierGroups,
    fifaRankMap,
    paperStrength,
    groupOf,
  }
})
