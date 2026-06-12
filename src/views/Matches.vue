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
            <span v-if="m.snapshot_minute" class="match-time match-time--live">● {{ m.snapshot_minute }}'</span>
            <span v-else-if="m.time && !m.played" class="match-time">{{ m.time }}</span>
          </div>

          <div class="match-score-row">
            <span class="team-name" :class="{ winner: m.result === 'home' }">{{ m.home }}</span>
            <div class="score-box">
              <span v-if="m.home_score !== '' || m.away_score !== ''" class="score">
                <span :class="{ 'score-winner': m.result === 'home' }">{{ m.home_score !== '' ? m.home_score : 0 }}</span>
                –
                <span :class="{ 'score-winner': m.result === 'away' }">{{ m.away_score !== '' ? m.away_score : 0 }}</span>
              </span>
              <span v-else class="score score--upcoming">vs</span>
            </div>
            <span class="team-name team-name--right" :class="{ winner: m.result === 'away' }">{{ m.away }}</span>
          </div>

          <div v-if="m.played && matchEvents(m).length" class="goal-list">
            <div v-for="(e, ei) in matchEvents(m)" :key="ei" class="goal-item">
              <span class="goal-item__home">
                <template v-if="e.team === 'home'">{{ e.minute }}' {{ eventIcon(e) }}</template>
              </span>
              <span class="goal-item__away">
                <template v-if="e.team === 'away'">{{ eventIcon(e) }} {{ e.minute }}'</template>
              </span>
            </div>
          </div>

          <div v-if="m.homePlayers.length || m.awayPlayers.length" class="rivalry">
            <span class="rivalry-side">{{ m.homePlayers.join(', ') }}</span>
            <span class="rivalry-vs">vs</span>
            <span class="rivalry-side">{{ m.awayPlayers.join(', ') }}</span>
          </div>

          <div v-if="m.played && m.bonusFlags?.size" class="bonus-flags">
            <span v-for="b in renderedBonuses(m)" :key="b.label" class="bonus-tag">{{ b.label }}</span>
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

const BONUS_META = {
  first_goal:   { icon: '⚡', label: 'First Goal' },
  comeback:     { icon: '🔥', label: 'Comeback Win' },
  penalties:    { icon: '🎯', label: 'Won Penalties' },
  clean_sheet:  { icon: '🧤', label: 'Clean Sheet' },
}

function renderedBonuses(m) {
  return [...(m.bonusFlags ?? [])].map(flag => {
    const side = flag.startsWith('home_') ? 'home' : 'away'
    const type = flag.slice(side.length + 1)
    const meta = BONUS_META[type]
    if (!meta) return null
    const team = side === 'home' ? m.home : m.away
    return { label: `${meta.icon} ${team} ${meta.label}` }
  }).filter(Boolean)
}

function matchEvents(m) {
  const goals = (m.goals ?? []).map(g => ({ ...g, kind: 'goal' }))
  const cards = (m.cards ?? []).map(c => ({ ...c, kind: 'card' }))
  return [...goals, ...cards].sort((a, b) => a.minute - b.minute)
}

function eventIcon(e) {
  if (e.kind === 'goal') return '⚽'
  if (e.type === 'red') return '🟥'
  return '🟨'
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
  background: var(--surface); color: var(--text-dim); font-size: 13px; font-weight: 600; cursor: pointer;
}
.filter-btn.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }

.date-label { margin-top: 8px; }

.match-list { margin-bottom: 12px; }
.match-row { padding: 12px 14px; }
.match-row--divider { border-top: 1px solid var(--border); }

.match-stage-pill { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.match-time { font-size: 13px; color: var(--text-dim); }
.match-time--live { color: var(--green); font-weight: 700; }

.match-score-row { display: flex; align-items: center; gap: 6px; }

.team-name {
  flex: 1; font-size: 16px; font-weight: 500; color: #ffffff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  min-width: 0;
}
.team-name--right { text-align: right; }
.team-name.winner { color: var(--text); font-weight: 700; }

.score-box { flex-shrink: 0; }
.score { font-size: 19px; font-weight: 700; white-space: nowrap; color: var(--text); }
.score--upcoming { color: var(--text-dim); font-size: 16px; }
.score-winner { color: var(--green); }

.goal-list { margin-top: 6px; display: flex; flex-direction: column; gap: 2px; }
.goal-item { display: flex; font-size: 13px; color: var(--text-dim); }
.goal-item__home { flex: 1; }
.goal-item__away { flex: 1; text-align: right; }

.rivalry {
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px; padding: 5px 8px;
  background: rgba(0,255,159,0.06); border: 1px solid rgba(0,255,159,0.2);
  border-radius: 6px;
}
.rivalry-side { font-size: 13px; font-weight: 700; color: var(--green); flex: 1; }
.rivalry-side:last-child { text-align: right; }
.rivalry-vs {
  font-size: 12px; font-weight: 800; letter-spacing: .06em;
  color: var(--green); flex-shrink: 0; opacity: 0.5;
}

.bonus-flags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.bonus-tag { font-size: 12px; color: var(--accent); background: #2a2010; border-radius: 4px; padding: 2px 6px; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 17px; }
</style>
