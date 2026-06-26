<template>
  <div class="match-row" :class="{ 'match-row--divider': showDivider, 'match-row--orphan': isOrphan, 'match-row--live': match.snapshot_minute || match.autoLive, 'match-row--played': match.played && !match.snapshot_minute }">
    <div class="match-stage-pill">
      <span v-if="match.snapshot_minute || match.autoLive" class="match-time match-time--live">● LIVE</span>
      <span v-else-if="match.time && !match.played" class="match-time">{{ match.time }}</span>
    </div>

    <div class="match-score-row">
      <span class="team-name" :class="{ winner: match.result === 'home' }"><span class="team-flag">{{ flagOf(match.home) }}</span>{{ match.home }}</span>
      <div class="score-box">
        <span v-if="isOrphan" class="orphan-tag">🍿 Popcorn Game</span>
        <span v-if="match.played && !match.snapshot_minute" class="score-check">✓</span>
        <span v-if="match.home_score !== '' || match.away_score !== '' || match.snapshot_minute || match.autoLive" class="score">
          <span :class="{ 'score-winner': match.result === 'home' }">{{ match.home_score !== '' ? match.home_score : 0 }}</span>
          –
          <span :class="{ 'score-winner': match.result === 'away' }">{{ match.away_score !== '' ? match.away_score : 0 }}</span>
        </span>
        <span v-else class="score score--upcoming">vs</span>
        <span v-if="match.snapshot_minute || match.autoLive" class="score-minute">{{ match.liveMinute || match.snapshot_minute || 1 }}'</span>
      </div>
      <span class="team-name team-name--right" :class="{ winner: match.result === 'away' }">{{ match.away }}<span class="team-flag">{{ flagOf(match.away) }}</span></span>
    </div>

    <div v-if="match.played && events.length" class="goal-list">
      <div v-for="(e, ei) in events" :key="ei" class="goal-item">
        <span class="goal-item__home">
          <template v-if="e.team === 'home'">{{ e.scorer ? e.scorer + ' ' : '' }}{{ eventIcon(e) }} {{ e.minute }}'</template>
        </span>
        <span class="goal-item__gap"></span>
        <span class="goal-item__away">
          <template v-if="e.team === 'away'">{{ e.minute }}' {{ eventIcon(e) }}{{ e.scorer ? ' ' + e.scorer : '' }}</template>
        </span>
      </div>
    </div>

    <div v-if="match.homePlayers?.length || match.awayPlayers?.length" class="rivalry">
      <span class="rivalry-side">
        <template v-for="(name, i) in match.homePlayers" :key="name">
          <span :class="match.awayPlayers?.includes(name) ? 'rivalry-both' : ''">{{ name }}</span><template v-if="i < match.homePlayers.length - 1">, </template>
        </template>
      </span>
      <span class="rivalry-vs">vs</span>
      <span class="rivalry-side">
        <template v-for="(name, i) in match.awayPlayers" :key="name">
          <span :class="match.homePlayers?.includes(name) ? 'rivalry-both' : ''">{{ name }}</span><template v-if="i < match.awayPlayers.length - 1">, </template>
        </template>
      </span>
    </div>

    <div v-if="match.played && match.bonusFlags?.size && !isOrphan" class="bonus-row">
      <div class="bonus-col bonus-col--home">
        <span v-for="b in homeBonuses" :key="b.label" class="bonus-tag">{{ b.label }}</span>
      </div>
      <span class="bonus-col--gap"></span>
      <div class="bonus-col bonus-col--away">
        <span v-for="b in awayBonuses" :key="b.label" class="bonus-tag">{{ b.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FLAG_MAP } from '../data/index.js'

const props = defineProps({
  match:       { type: Object,  required: true },
  showDivider: { type: Boolean, default: false },
})

const m = computed(() => props.match)

function flagOf(team) {
  return FLAG_MAP[team] ?? '🏳'
}

const isOrphan = computed(() =>
  FLAG_MAP[m.value.home] != null &&
  FLAG_MAP[m.value.away] != null &&
  !m.value.homePlayers?.length &&
  !m.value.awayPlayers?.length
)

const stagePillClass = computed(() => {
  const s = m.value.stage
  if (s === 'Final') return 'pill-t1'
  if (s?.includes('Semi')) return 'pill-t2'
  if (s?.includes('Quarter')) return 'pill-t3'
  if (s === 'Group Stage') return 'pill-gold'
  return 'pill-t4'
})

const events = computed(() => {
  const goals = (m.value.goals ?? []).map(g => ({ ...g, kind: 'goal' }))
  const cards = (m.value.cards ?? []).map(c => ({ ...c, kind: 'card' }))
  return [...goals, ...cards].sort((a, b) => a.minute - b.minute)
})

function eventIcon(e) {
  if (e.kind === 'goal') return '⚽'
  if (e.type === 'red') return '🟥'
  return '🟨'
}

const BONUS_META = {
  first_goal:  { icon: '⚡', label: 'First Goal' },
  comeback:    { icon: '🔥', label: 'Comeback Win' },
  penalties:   { icon: '🎯', label: 'Won Penalties' },
  clean_sheet: { icon: '🧤', label: 'Clean Sheet' },
}

const allBonuses = computed(() =>
  [...(m.value.bonusFlags ?? [])].map(flag => {
    const side = flag.startsWith('home_') ? 'home' : 'away'
    const type = flag.slice(side.length + 1)
    const meta = BONUS_META[type]
    if (!meta) return null
    return { label: `${meta.icon} ${meta.label}`, side }
  }).filter(Boolean)
)

const homeBonuses = computed(() => allBonuses.value.filter(b => b.side === 'home'))
const awayBonuses = computed(() => allBonuses.value.filter(b => b.side === 'away'))
</script>

<style scoped>
.match-row { padding: 14px; }
.match-row--divider { border-top: 1px solid var(--border); padding-top: 16px; }
.match-row--live {
  background: rgba(0,255,159,0.04);
  box-shadow: inset 3px 0 0 rgba(0,255,159,0.5);
}
.match-row--played {
  background: rgba(0,0,0,0.12);
  box-shadow: inset 3px 0 0 rgba(255,255,255,0.07);
}
.match-row--played .team-name,
.match-row--played .match-time { opacity: 0.6; }

.match-stage-pill { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.match-time { font-size: 13px; color: var(--text-dim); }
.match-time--live {
  color: var(--green); font-weight: 700;
  animation: live-pulse 1.5s ease-in-out infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}

.orphan-tag { font-size: 11px; color: var(--text-dim); text-align: center; white-space: nowrap; }

.match-score-row { display: flex; align-items: center; gap: 6px; }
.team-name {
  flex: 1; font-size: 16px; font-weight: 500; color: #ffffff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
}
.team-name--right { text-align: right; }
.team-name.winner { color: var(--green); font-weight: 700; }
.team-flag { display: inline-block; margin: 0 5px; }

.score-box { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.score { font-size: 19px; font-weight: 700; white-space: nowrap; color: var(--text); }
.score--upcoming { color: var(--text-dim); font-size: 16px; }
.score-winner { color: var(--green); }
.score-minute { font-size: 12px; font-weight: 700; color: var(--green); letter-spacing: .03em; }
.score-check { font-size: 18px; font-weight: 900; color: var(--green); line-height: 1; }

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
.rivalry-vs { font-size: 12px; font-weight: 800; letter-spacing: .06em; color: var(--green); flex-shrink: 0; opacity: 0.5; }
.rivalry-both { color: var(--purple); font-weight: 800; }

.bonus-row { display: grid; grid-template-columns: 1fr 60px 1fr; margin-top: 8px; gap: 4px 0; }
.bonus-col { display: flex; flex-direction: column; gap: 4px; }
.bonus-col--home { align-items: flex-start; }
.bonus-col--away { align-items: flex-end; }
.bonus-tag { font-size: 12px; color: var(--accent); background: #2a2010; border-radius: 4px; padding: 2px 6px; white-space: nowrap; }
</style>
