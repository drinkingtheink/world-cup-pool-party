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
        <MatchCard
          v-for="(m, j) in group.matches"
          :key="j"
          :match="m"
          :show-divider="j > 0"
        />
      </div>
    </template>

    <p v-if="!grouped.length" class="empty-msg">No matches match the filter</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePoolStore } from '../stores/pool.js'
import MatchCard from '../components/MatchCard.vue'

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
.date-header__count { font-size: 12px; color: var(--text-dim); white-space: nowrap; }
.date-header__badge {
  font-size: 11px; font-weight: 700; letter-spacing: .04em;
  padding: 2px 8px; border-radius: 99px; white-space: nowrap; flex-shrink: 0;
}
.date-header__badge--today { background: var(--accent); color: var(--bg); }
.date-header__badge--done  { color: var(--text-dim); border: 1px solid var(--border); }

.match-list { margin-bottom: 4px; }
.match-list--today { border-color: rgba(0,255,159,0.25); }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 17px; }
</style>
