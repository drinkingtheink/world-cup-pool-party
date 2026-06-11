import { defineStore } from 'pinia'
import { computed } from 'vue'
import { players as rawPlayers, matches as rawMatches, tiers as rawTiers } from '../data/index.js'
import { buildLeaderboard, enrichMatches } from '../services/points.js'

export const usePoolStore = defineStore('pool', () => {
  const leaderboard = computed(() => buildLeaderboard(rawPlayers, rawMatches))
  const enrichedMatches = computed(() => enrichMatches(rawMatches))

  const tierMap = computed(() => {
    const map = {}
    rawTiers.forEach(t => { map[t.team] = Number(t.tier) })
    return map
  })

  // implied win probability = 100 / (americanOdds + 100)
  const oddsMap = computed(() => {
    const map = {}
    rawTiers.forEach(t => { if (t.odds) map[t.team] = 100 / (t.odds + 100) })
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

  const tierGroups = computed(() => {
    const groups = { 1: [], 2: [], 3: [], 4: [] }
    rawTiers.forEach(t => {
      const n = Number(t.tier)
      if (groups[n]) groups[n].push(t.team)
    })
    Object.values(groups).forEach(g => g.sort())
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
    paperStrength,
  }
})
