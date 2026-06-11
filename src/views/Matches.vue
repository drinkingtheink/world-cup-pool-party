<template>
  <div class="view">
    <!-- Stage filter -->
    <div class="filter-row">
      <button
        v-for="s in stages"
        :key="s"
        class="filter-btn"
        :class="{ active: activeStage === s }"
        @click="activeStage = activeStage === s ? null : s"
      >{{ s }}</button>
    </div>

    <template v-for="(group, i) in grouped" :key="group.date">
      <p class="view-title date-label">{{ formatDate(group.date) }}</p>
      <div class="match-list card" :style="{ '--i': i }">
        <div
          v-for="(m, i) in group.matches"
          :key="i"
          class="match-row"
          :class="{ 'match-row--divider': i > 0 }"
        >
          <div class="match-stage-pill">
            <span class="pill" :class="stagePillClass(m.stage)">{{ m.stage }}</span>
            <span v-if="m.time && !m.played" class="match-time">{{ m.time }}</span>
          </div>

          <div class="match-score-row">
            <span class="team-name" :class="{ winner: m.result === 'home' }">{{ m.home }}</span>
            <div class="score-box">
              <span v-if="m.played" class="score">
                <span :class="{ 'score-winner': m.result === 'home' }">{{ m.home_score }}</span>
                –
                <span :class="{ 'score-winner': m.result === 'away' }">{{ m.away_score }}</span>
              </span>
              <span v-else class="score score--upcoming">vs</span>
            </div>
            <span class="team-name team-name--right" :class="{ winner: m.result === 'away' }">{{ m.away }}</span>
          </div>

          <div v-if="m.homePlayers.length || m.awayPlayers.length" class="rivalry">
            <span class="rivalry-side">{{ m.homePlayers.join(', ') }}</span>
            <span class="rivalry-vs">vs</span>
            <span class="rivalry-side">{{ m.awayPlayers.join(', ') }}</span>
          </div>

          <div v-if="m.played && m.bonusFlags?.size" class="bonus-flags">
            <span v-for="b in renderedBonuses(m.bonusFlags)" :key="b" class="bonus-tag">{{ b }}</span>
          </div>
        </div>
      </div>
    </template>

    <p v-if="!grouped.length" class="empty-msg">No matches match the filter</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePoolStore } from '../stores/pool.js'

const store = usePoolStore()
const activeStage = ref(null)

const stages = computed(() => {
  const s = new Set(store.enrichedMatches.map(m => m.stage))
  return [...s]
})

const filtered = computed(() =>
  activeStage.value
    ? store.enrichedMatches.filter(m => m.stage === activeStage.value)
    : store.enrichedMatches
)

const grouped = computed(() => {
  const map = {}
  filtered.value.forEach(m => {
    if (!map[m.date]) map[m.date] = []
    map[m.date].push(m)
  })
  return Object.keys(map).sort().map(date => ({ date, matches: map[date] }))
})

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d + 'T12:00:00')
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const BONUS_LABELS = {
  home_first_goal: '⚡ Home First Goal',
  away_first_goal: '⚡ Away First Goal',
  home_comeback:   '🔥 Home Comeback',
  away_comeback:   '🔥 Away Comeback',
  home_penalties:  '🎯 Home Won Pens',
  away_penalties:  '🎯 Away Won Pens',
}

function renderedBonuses(flagSet) {
  return [...(flagSet ?? [])].map(b => BONUS_LABELS[b]).filter(Boolean)
}

function stagePillClass(s) {
  if (s === 'Final') return 'pill-t1'
  if (s?.includes('Semi')) return 'pill-t2'
  if (s?.includes('Quarter')) return 'pill-t3'
  if (s === 'Group Stage') return 'pill-gold'
  return 'pill-t4'
}
</script>

<style scoped>
.filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.filter-btn {
  padding: 5px 10px; border-radius: 99px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-dim); font-size: 11px; font-weight: 600; cursor: pointer;
}
.filter-btn.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }

.date-label { margin-top: 8px; }

.match-list { margin-bottom: 12px; }
.match-row { padding: 12px 14px; }
.match-row--divider { border-top: 1px solid var(--border); }

.match-stage-pill { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.match-time { font-size: 11px; color: var(--text-dim); }

.match-score-row { display: flex; align-items: center; gap: 6px; }

.team-name {
  flex: 1; font-size: 13px; font-weight: 500; color: #ffffff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  min-width: 0;
}
.team-name--right { text-align: right; }
.team-name.winner { color: var(--text); font-weight: 700; }

.score-box { flex-shrink: 0; }
.score { font-size: 16px; font-weight: 700; white-space: nowrap; }
.score--upcoming { color: var(--text-dim); font-size: 13px; }
.score-winner { color: var(--green); }

.rivalry {
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px; padding: 5px 8px;
  background: rgba(0,255,159,0.06); border: 1px solid rgba(0,255,159,0.2);
  border-radius: 6px;
}
.rivalry-side { font-size: 11px; font-weight: 700; color: var(--green); flex: 1; }
.rivalry-side:last-child { text-align: right; }
.rivalry-vs {
  font-size: 10px; font-weight: 800; letter-spacing: .06em;
  color: var(--green); flex-shrink: 0; opacity: 0.5;
}

.bonus-flags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.bonus-tag { font-size: 10px; color: var(--accent); background: #2a2010; border-radius: 4px; padding: 2px 6px; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 14px; }
</style>
