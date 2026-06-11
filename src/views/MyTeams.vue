<template>
  <div class="view">
    <!-- Player selector -->
    <div class="player-scroll">
      <button
        v-for="p in sortedPlayers"
        :key="p.name"
        class="player-chip"
        :class="{ active: selected === p.name }"
        @click="selected = p.name"
      >{{ p.name }}</button>
    </div>

    <div v-if="!selected" class="empty-msg">Select a player above</div>

    <template v-else-if="player">
      <!-- Points summary -->
      <div class="pts-banner card">
        <span class="pts-name">{{ player.name }}</span>
        <span class="pts-total">{{ playerEntry?.total ?? 0 }} <span class="pts-label">pts</span></span>
        <span class="pts-rank" v-if="playerEntry">Rank #{{ playerEntry.rank }}</span>
      </div>

      <!-- Team cards -->
      <p class="view-title" style="margin-top:16px">Teams</p>
      <div class="team-grid">
        <div
          v-for="team in teams"
          :key="team.name"
          class="team-card card"
        >
          <div class="team-card-top">
            <span class="team-card-flag">{{ FLAG_MAP[team.name] ?? '🏳' }}</span>
            <span class="team-card-name">{{ team.name }}</span>
            <span class="pill" :class="`pill-t${team.tier}`">T{{ team.tier }}</span>
            <span v-if="store.fifaRankMap[team.name]" class="fifa-badge">FIFA #{{ store.fifaRankMap[team.name] }}</span>
          </div>
          <div class="team-card-pts">{{ team.pts }} pts</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePoolStore } from '../stores/pool.js'
import { FLAG_MAP } from '../data/index.js'

const store = usePoolStore()
const selected = ref(null)

const sortedPlayers = computed(() => [...store.players].sort((a, b) => a.name.localeCompare(b.name)))

const player = computed(() => store.players.find(p => p.name === selected.value))
const playerEntry = computed(() => store.leaderboard.find(e => e.name === selected.value))

const teams = computed(() => {
  if (!player.value || !playerEntry.value) return []
  return [
    player.value.team1, player.value.team2, player.value.team3,
    player.value.team4, player.value.team5, player.value.team6,
  ].filter(Boolean).map(name => ({
    name,
    tier: store.tierMap[name] ?? '?',
    pts: playerEntry.value.breakdown[name] ?? 0,
    fifaRank: store.fifaRankMap[name] ?? 999,
  })).sort((a, b) => a.fifaRank - b.fifaRank)
})
</script>

<style scoped>
.player-scroll {
  display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px;
  scrollbar-width: none;
}
.player-scroll::-webkit-scrollbar { display: none; }

.player-chip {
  flex-shrink: 0; padding: 7px 14px; border-radius: 99px;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text-dim); font-size: 16px; font-weight: 600; cursor: pointer;
  transition: all .15s;
}
.player-chip.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }

.pts-banner {
  display: flex; align-items: center; gap: 10px; padding: 14px 16px;
}
.pts-name { flex: 1; font-size: 19px; font-weight: 700; color: #ffffff; }
.pts-total { font-size: 26px; font-weight: 800; color: var(--accent); }
.pts-label { font-size: 14px; color: var(--text-dim); }
.pts-rank { font-size: 14px; color: var(--text-dim); }

.team-grid { display: flex; flex-direction: column; gap: 8px; }

.team-card { padding: 12px 14px; }

.team-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.team-card-flag { font-size: 22px; line-height: 1; flex-shrink: 0; }
.team-card-name { flex: 1; font-size: 17px; font-weight: 600; color: #ffffff; }
.team-card-pts { font-size: 24px; font-weight: 800; color: var(--accent); }

.fifa-badge {
  font-size: 12px; font-weight: 700; letter-spacing: .04em;
  color: var(--cyan); background: rgba(0,229,255,0.08);
  border: 1px solid rgba(0,229,255,0.25); border-radius: 4px;
  padding: 2px 6px; white-space: nowrap; flex-shrink: 0;
}

.empty-msg { padding: 40px 24px; text-align: center; color: var(--text-dim); font-size: 17px; }
</style>
