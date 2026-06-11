<template>
  <div class="view">
    <!-- Player selector -->
    <div class="player-scroll">
      <button
        v-for="p in store.players"
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
            <span class="team-card-name">{{ team.name }}</span>
            <span class="pill" :class="`pill-t${team.tier}`">T{{ team.tier }}</span>
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

const store = usePoolStore()
const selected = ref(null)

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
  }))
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
  color: var(--text-dim); font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all .15s;
}
.player-chip.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }

.pts-banner {
  display: flex; align-items: center; gap: 10px; padding: 14px 16px;
}
.pts-name { flex: 1; font-size: 16px; font-weight: 700; color: #ffffff; }
.pts-total { font-size: 22px; font-weight: 800; color: var(--accent); }
.pts-label { font-size: 12px; color: var(--text-dim); }
.pts-rank { font-size: 12px; color: var(--text-dim); }

.team-grid { display: flex; flex-direction: column; gap: 8px; }

.team-card { padding: 12px 14px; }

.team-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.team-card-name { flex: 1; font-size: 14px; font-weight: 600; color: #ffffff; }
.team-card-pts { font-size: 20px; font-weight: 800; color: var(--accent); }

.empty-msg { padding: 40px 24px; text-align: center; color: var(--text-dim); font-size: 14px; }
</style>
