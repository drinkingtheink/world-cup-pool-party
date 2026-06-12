import { defineStore } from 'pinia'
import { computed } from 'vue'
import { players as rawPlayers, matches as rawMatches, tiers as rawTiers } from '../data/index.js'
import { buildLeaderboard, enrichMatches } from '../services/points.js'

export const usePoolStore = defineStore('pool', () => {
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
    enrichMatches(rawMatches).map(m => ({
      ...m,
      homePlayers: teamPlayerMap.value[m.home] ?? [],
      awayPlayers: teamPlayerMap.value[m.away] ?? [],
    }))
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

  const groupOf = computed(() => {
    const edges = {}
    rawMatches.filter(m => m.stage === 'Group Stage').forEach(m => {
      if (!edges[m.home]) edges[m.home] = new Set()
      if (!edges[m.away]) edges[m.away] = new Set()
      edges[m.home].add(m.away)
      edges[m.away].add(m.home)
    })
    const visited = new Set()
    const map = {}
    let gi = 0
    Object.keys(edges).sort().forEach(team => {
      if (visited.has(team)) return
      const letter = String.fromCharCode(65 + gi++)
      const queue = [team]
      while (queue.length) {
        const t = queue.shift()
        if (visited.has(t)) continue
        visited.add(t)
        map[t] = letter
        edges[t].forEach(n => { if (!visited.has(n)) queue.push(n) })
      }
    })
    return map
  })

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
