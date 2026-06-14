import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { players as rawPlayers, matches as rawMatches, tiers as rawTiers, GROUP_MAP } from '../data/index.js'
import { buildLeaderboard, enrichMatches } from '../services/points.js'

// CT = CDT (UTC-5) during tournament months
function parseMatchTime(date, timeStr) {
  const m = timeStr?.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return null
  let hour = Number(m[1])
  if (m[3].toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (m[3].toUpperCase() === 'AM' && hour === 12) hour = 0
  return new Date(`${date}T${String(hour).padStart(2, '0')}:${m[2]}:00-05:00`)
}

export const usePoolStore = defineStore('pool', () => {
  const now = ref(new Date())
  setInterval(() => { now.value = new Date() }, 60_000)
  // implied win probability = 100 / (americanOdds + 100)
  const oddsMap = computed(() => {
    const map = {}
    rawTiers.forEach(t => { if (t.odds) map[t.team] = 100 / (t.odds + 100) })
    return map
  })

  const leaderboard = computed(() => {
    const strengthMap = {}
    rawPlayers.forEach(p => {
      const teams = [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
      strengthMap[p.name] = teams.reduce((sum, t) => sum + (oddsMap.value[t] ?? 0), 0)
    })
    return buildLeaderboard(rawPlayers, rawMatches)
      .sort((a, b) => b.total - a.total || (strengthMap[b.name] ?? 0) - (strengthMap[a.name] ?? 0))
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
    enrichMatches(rawMatches).map(m => {
      const base = {
        ...m,
        homePlayers: teamPlayerMap.value[m.home] ?? [],
        awayPlayers: teamPlayerMap.value[m.away] ?? [],
      }
      if (base.played || base.snapshot_minute || !m.time) return base
      const start = parseMatchTime(m.date, m.time)
      if (!start) return base
      const end = new Date(start.getTime() + 115 * 60 * 1000)
      return { ...base, autoLive: now.value >= start && now.value < end }
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
