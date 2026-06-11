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
  }
})
