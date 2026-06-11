<template>
  <div class="view">
    <p class="view-title">Standings</p>
    <div class="leaderboard">
      <div
        v-for="entry in store.leaderboard"
        :key="entry.name"
        class="lb-row card"
        :class="{ 'lb-row--first': entry.rank === 1 }"
        @click="expanded = expanded === entry.name ? null : entry.name"
      >
        <div class="lb-main">
          <span class="lb-rank" :class="rankClass(entry.rank)">{{ entry.rank }}</span>
          <span class="lb-name">{{ entry.name }}</span>
          <span class="lb-pts">{{ entry.total }} <span class="lb-pts-label">pts</span></span>
        </div>

        <!-- Expanded team breakdown -->
        <transition name="expand">
          <div v-if="expanded === entry.name" class="lb-breakdown">
            <div v-for="team in entry.teams" :key="team" class="lb-team-row">
              <span class="lb-team-name">{{ team }}</span>
              <span class="lb-team-pts">{{ entry.breakdown[team] ?? 0 }} pts</span>
            </div>
          </div>
        </transition>
      </div>

      <p v-if="!store.leaderboard.length" class="empty-msg">No data yet</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePoolStore } from '../stores/pool.js'

const store = usePoolStore()
const expanded = ref(null)

function rankClass(r) {
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return ''
}
</script>

<style scoped>
.leaderboard { display: flex; flex-direction: column; gap: 8px; }

.lb-row { cursor: pointer; transition: border-color .15s; }
.lb-row--first { border-color: var(--accent); }

.lb-main {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
}

.lb-rank {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; background: var(--surface2); color: var(--text-dim);
  flex-shrink: 0;
}
.rank-gold   { background: #4a3a1a; color: #f0c060; }
.rank-silver { background: #2a2e3a; color: #a0aabf; }
.rank-bronze { background: #2e2018; color: #c07040; }

.lb-name { flex: 1; font-size: 15px; font-weight: 600; }
.lb-pts { font-size: 17px; font-weight: 800; color: var(--accent); }
.lb-pts-label { font-size: 11px; font-weight: 500; color: var(--text-dim); }

.lb-breakdown {
  border-top: 1px solid var(--border);
  padding: 10px 16px 14px;
  display: flex; flex-direction: column; gap: 6px;
}
.lb-team-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px;
}
.lb-team-name { display: flex; align-items: center; gap: 6px; color: var(--text-dim); }
.lb-team-pts { font-weight: 600; color: var(--text); }

.expand-enter-active, .expand-leave-active { transition: opacity .15s; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 14px; }
</style>
