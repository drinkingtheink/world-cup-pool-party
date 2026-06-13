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
      <div class="date-header" :ref="el => { if (isToday(group.date)) todayEl = el }" :class="{ 'date-header--first': i === 0, 'date-header--today': isToday(group.date), 'date-header--past': isPast(group.date) }">
        <span class="date-header__text">{{ formatDate(group.date) }}</span>
        <span class="date-header__count">{{ group.matches.length }} match{{ group.matches.length !== 1 ? 'es' : '' }}</span>
        <span v-if="isToday(group.date)" class="date-header__badge date-header__badge--today">Today</span>
        <span v-else-if="isPast(group.date)" class="date-header__badge date-header__badge--done">Done</span>
      </div>
      <div class="match-list card" :class="{ 'match-list--today': isToday(group.date) }" :style="{ '--i': i }">
        <div
          v-for="(m, i) in group.matches"
          :key="i"
          class="match-row"
          :class="{ 'match-row--divider': i > 0, 'match-row--orphan': isOrphan(m) }"
        >
          <div class="match-stage-pill">
            <span class="pill" :class="stagePillClass(m.stage)">{{ m.stage }}</span>
            <span v-if="m.snapshot_minute" class="match-time match-time--live">● LIVE</span>
            <span v-else-if="m.time && !m.played" class="match-time">{{ m.time }}</span>
            <span v-if="isOrphan(m)" class="orphan-tag">🍿 Popcorn game</span>
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
              <span v-if="m.snapshot_minute" class="score-minute">{{ m.snapshot_minute }}'</span>
            </div>
            <span class="team-name team-name--right" :class="{ winner: m.result === 'away' }">{{ m.away }}</span>
          </div>

          <div v-if="m.played && matchEvents(m).length" class="goal-list">
            <div v-for="(e, ei) in matchEvents(m)" :key="ei" class="goal-item">
              <span class="goal-item__home">
                <template v-if="e.team === 'home'">{{ e.scorer ? e.scorer + ' ' : '' }}{{ eventIcon(e) }} {{ e.minute }}'</template>
              </span>
              <span class="goal-item__gap"></span>
              <span class="goal-item__away">
                <template v-if="e.team === 'away'">{{ e.minute }}' {{ eventIcon(e) }}{{ e.scorer ? ' ' + e.scorer : '' }}</template>
              </span>
            </div>
          </div>

          <div v-if="m.homePlayers.length || m.awayPlayers.length" class="rivalry">
            <span class="rivalry-side">{{ m.homePlayers.join(', ') }}</span>
            <span class="rivalry-vs">vs</span>
            <span class="rivalry-side">{{ m.awayPlayers.join(', ') }}</span>
          </div>

          <div v-if="m.played && m.bonusFlags?.size" class="bonus-row">
            <div class="bonus-col bonus-col--home">
              <span v-for="b in homeBonuses(m)" :key="b.label" class="bonus-tag">{{ b.label }}</span>
            </div>
            <span class="bonus-col--gap"></span>
            <div class="bonus-col bonus-col--away">
              <span v-for="b in awayBonuses(m)" :key="b.label" class="bonus-tag">{{ b.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <p v-if="!grouped.length" class="empty-msg">No matches match the filter</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePoolStore } from '../stores/pool.js'

const store = usePoolStore()
const activeStage = ref(null)
const todayEl = ref(null)

onMounted(() => nextTick(() => todayEl.value?.scrollIntoView({ block: 'start' })))

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

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function isToday(d) { return d === todayStr() }
function isPast(d)  { return d < todayStr() }

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
    return { label: `${meta.icon} ${meta.label}`, side }
  }).filter(Boolean)
}

function homeBonuses(m) { return renderedBonuses(m).filter(b => b.side === 'home') }
function awayBonuses(m) { return renderedBonuses(m).filter(b => b.side === 'away') }

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

function isOrphan(m) {
  return m.homePlayers.length === 0 && m.awayPlayers.length === 0
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

.date-header {
  display: flex; align-items: center; gap: 8px;
  margin: 32px 0 6px;
  padding: 8px 12px;
  background: var(--surface); border-radius: 8px;
  border-left: 3px solid var(--border);
}
.date-header--first { margin-top: 0; }
.date-header--today { border-left-color: var(--accent); background: rgba(0,255,159,0.06); }
.date-header--past  { opacity: 0.7; }
.date-header__text {
  font-size: 14px; font-weight: 700; letter-spacing: .03em;
  color: var(--text); white-space: nowrap; flex: 1;
}
.date-header--today .date-header__text { color: #fff; }
.date-header__count {
  font-size: 12px; color: var(--text-dim); white-space: nowrap;
}
.date-header__badge {
  font-size: 11px; font-weight: 700; letter-spacing: .04em;
  padding: 2px 8px; border-radius: 99px; white-space: nowrap; flex-shrink: 0;
}
.date-header__badge--today { background: var(--accent); color: var(--bg); }
.date-header__badge--done  { color: var(--text-dim); border: 1px solid var(--border); }

.match-list { margin-bottom: 4px; }
.match-list--today { border-color: rgba(0,255,159,0.25); }
.match-row { padding: 12px 14px; }
.match-row--divider { border-top: 1px solid var(--border); }

.orphan-tag { font-size: 12px; color: var(--text-dim); margin-left: auto; }

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

.score-box { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.score { font-size: 19px; font-weight: 700; white-space: nowrap; color: var(--text); }
.score--upcoming { color: var(--text-dim); font-size: 16px; }
.score-winner { color: var(--green); }
.score-minute { font-size: 12px; font-weight: 700; color: var(--green); letter-spacing: .03em; }

.goal-list { margin-top: 6px; display: flex; flex-direction: column; gap: 2px; }
.goal-item { display: grid; grid-template-columns: 1fr 60px 1fr; font-size: 13px; color: var(--text-dim); }
.goal-item__home { text-align: right; padding-right: 6px; }
.goal-item__gap  { }
.goal-item__away { text-align: left; padding-left: 6px; }

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

.bonus-row { display: grid; grid-template-columns: 1fr 60px 1fr; margin-top: 8px; gap: 4px 0; }
.bonus-col { display: flex; flex-direction: column; gap: 4px; }
.bonus-col--home { align-items: flex-start; }
.bonus-col--away { align-items: flex-end; }
.bonus-col--gap  { }
.bonus-tag { font-size: 12px; color: var(--accent); background: #2a2010; border-radius: 4px; padding: 2px 6px; white-space: nowrap; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 17px; }
</style>
