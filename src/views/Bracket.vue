<template>
  <!-- Portrait prompt — mobile only -->
  <div class="bracket-rotate">
    <span class="bracket-rotate-icon">⟳</span>
    <p class="bracket-rotate-text">Rotate your device to view the bracket</p>
  </div>

  <!-- Bracket view -->
  <div class="bracket-page">
    <div class="bracket-scroller">
      <div class="bracket">

        <!-- LEFT R32 -->
        <div class="b-col b-col--l b-col--r32">
          <span class="b-label">Round of 32</span>
          <div class="b-slots">
            <div v-for="idx in LEFT_R32" :key="idx" class="b-slot b-slot--r32">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time">{{ matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEFT R16 -->
        <div class="b-col b-col--l b-col--r16">
          <span class="b-label">Round of 16</span>
          <div class="b-slots">
            <div v-for="idx in LEFT_R16" :key="idx" class="b-slot b-slot--r16">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time">{{ matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEFT QF -->
        <div class="b-col b-col--l b-col--qf">
          <span class="b-label">Quarterfinal</span>
          <div class="b-slots">
            <div v-for="idx in LEFT_QF" :key="idx" class="b-slot b-slot--qf">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time">{{ matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEFT SF -->
        <div class="b-col b-col--l b-col--sf">
          <span class="b-label">Semifinal</span>
          <div class="b-slots">
            <div class="b-slot b-slot--sf">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(101) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(101,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(101)) }}</span>
                    <span class="b-name">{{ home(101) }}</span>
                    <span class="b-score">{{ score(101,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(101,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(101,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(101,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(101)) }}</span>
                    <span class="b-name">{{ away(101) }}</span>
                    <span class="b-score">{{ score(101,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(101,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(101,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(101)" class="b-time">{{ matchTime(101) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- FINAL -->
        <div class="b-col b-col--final">
          <span class="b-label">Final</span>
          <div class="b-slots">
            <div class="b-slot b-slot--sf">
              <div class="b-card b-card--final" :class="{ 'b-card--played': isPlayed(104) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(104,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(104)) }}</span>
                    <span class="b-name">{{ home(104) }}</span>
                    <span class="b-score">{{ score(104,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(104,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(104,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(104,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(104)) }}</span>
                    <span class="b-name">{{ away(104) }}</span>
                    <span class="b-score">{{ score(104,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(104,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(104,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(104)" class="b-time">{{ matchTime(104) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT SF -->
        <div class="b-col b-col--r b-col--sf">
          <span class="b-label">Semifinal</span>
          <div class="b-slots">
            <div class="b-slot b-slot--sf">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(102) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(102,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(102)) }}</span>
                    <span class="b-name">{{ home(102) }}</span>
                    <span class="b-score">{{ score(102,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(102,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(102,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(102,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(102)) }}</span>
                    <span class="b-name">{{ away(102) }}</span>
                    <span class="b-score">{{ score(102,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(102,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(102,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(102)" class="b-time">{{ matchTime(102) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT QF -->
        <div class="b-col b-col--r b-col--qf">
          <span class="b-label">Quarterfinal</span>
          <div class="b-slots">
            <div v-for="idx in RIGHT_QF" :key="idx" class="b-slot b-slot--qf">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time">{{ matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT R16 -->
        <div class="b-col b-col--r b-col--r16">
          <span class="b-label">Round of 16</span>
          <div class="b-slots">
            <div v-for="idx in RIGHT_R16" :key="idx" class="b-slot b-slot--r16">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time">{{ matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT R32 -->
        <div class="b-col b-col--r b-col--r32">
          <span class="b-label">Round of 32</span>
          <div class="b-slots">
            <div v-for="idx in RIGHT_R32" :key="idx" class="b-slot b-slot--r32">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time">{{ matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePoolStore } from '../stores/pool.js'
import { FLAG_MAP } from '../data/index.js'

const store = usePoolStore()

const matchByNum = computed(() => {
  const map = {}
  store.enrichedMatches.forEach((m, i) => { map[i + 1] = m })
  return map
})

const teamToPlayers = computed(() => {
  const map = {}
  store.leaderboard.forEach(e => {
    e.teams.forEach(t => {
      if (!map[t]) map[t] = []
      map[t].push(e.name)
    })
  })
  return map
})

function resolveTeam(code) {
  if (!code) return 'TBD'
  if (!code.startsWith('W') && !code.startsWith('L')) return code
  const num = parseInt(code.slice(1))
  const m = matchByNum.value[num]
  if (!m || !m.played) return 'TBD'
  if (code.startsWith('W')) {
    if (m.result === 'home') return m.home
    if (m.result === 'away') return m.away
  }
  if (code.startsWith('L')) {
    if (m.result === 'home') return m.away
    if (m.result === 'away') return m.home
  }
  return 'TBD'
}

function home(idx)  { const m = matchByNum.value[idx]; return m ? resolveTeam(m.home) : 'TBD' }
function away(idx)  { const m = matchByNum.value[idx]; return m ? resolveTeam(m.away) : 'TBD' }
function isPlayed(idx) { return matchByNum.value[idx]?.played ?? false }
function isWinner(idx, side) {
  const m = matchByNum.value[idx]
  return m?.played && m.result === side
}
function score(idx, side) {
  const m = matchByNum.value[idx]
  if (!m?.played) return ''
  return side === 'home' ? m.home_score : m.away_score
}
function matchTime(idx) { return matchByNum.value[idx]?.time ?? '' }
function flagOf(team) {
  if (!team || team === 'TBD') return '🏳️'
  return FLAG_MAP[team] ?? ''
}
function poolPlayers(idx, side) {
  const team = side === 'home' ? home(idx) : away(idx)
  if (!team || team === 'TBD') return []
  return teamToPlayers.value[team] ?? []
}

const LEFT_R32 = [73, 75, 74, 77, 83, 84, 81, 82]
const LEFT_R16 = [89, 90, 93, 94]
const LEFT_QF  = [97, 98]

const RIGHT_QF  = [99, 100]
const RIGHT_R16 = [91, 92, 95, 96]
const RIGHT_R32 = [76, 78, 79, 80, 86, 88, 85, 87]
</script>

<style scoped>
.bracket-rotate {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--text-dim);
  padding: 32px;
  text-align: center;
}
.bracket-rotate-icon {
  font-size: 56px;
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.bracket-rotate-text {
  font-size: 16px; font-weight: 700; letter-spacing: .04em;
  text-transform: uppercase; color: var(--text-dim);
}

@media (max-width: 767px) and (orientation: portrait) {
  .bracket-rotate { display: flex; }
  .bracket-page   { display: none; }
}
@media (max-width: 767px) and (orientation: landscape),
       (min-width: 768px) {
  .bracket-rotate { display: none; }
  .bracket-page   { display: block; }
}

.bracket-page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bracket-scroller {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding: 24px 20px 32px;
  scrollbar-width: thin;
  scrollbar-color: #2e2060 #100c20;
}

.bracket {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 20px;
  min-width: max-content;
}

.b-col {
  width: 148px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  flex-shrink: 0;
}

.b-label {
  font-size: 9px; font-weight: 800; letter-spacing: .1em;
  text-transform: uppercase; color: var(--text-dim);
  text-align: center;
  margin-bottom: 10px;
  white-space: nowrap;
}
.b-col--final .b-label { color: var(--accent); font-size: 10px; }

.b-slots { display: flex; flex-direction: column; flex: 1; }

.b-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.b-slot--r32 { height: 68px; }
.b-slot--r16 { height: 136px; }
.b-slot--qf  { height: 272px; }
.b-slot--sf  { height: 544px; }

/* Left side connectors → right */
.b-col--l .b-slot:nth-child(odd)::after {
  content: '';
  position: absolute;
  right: -20px; top: 50%;
  width: 20px; height: 50%;
  border-top: 1px solid var(--border);
  border-right: 1px solid var(--border);
  pointer-events: none;
}
.b-col--l .b-slot:nth-child(even)::after {
  content: '';
  position: absolute;
  right: -20px; top: 0;
  width: 20px; height: 50%;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  pointer-events: none;
}
.b-col--l.b-col--sf .b-slot::after {
  content: '';
  position: absolute;
  right: -20px; top: 50%;
  width: 20px; height: 0;
  border-top: 1px solid var(--border);
  border-right: none;
  pointer-events: none;
}

/* Right side connectors → left */
.b-col--r .b-slot:nth-child(odd)::after {
  content: '';
  position: absolute;
  left: -20px; top: 50%;
  width: 20px; height: 50%;
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  pointer-events: none;
}
.b-col--r .b-slot:nth-child(even)::after {
  content: '';
  position: absolute;
  left: -20px; top: 0;
  width: 20px; height: 50%;
  border-bottom: 1px solid var(--border);
  border-left: 1px solid var(--border);
  pointer-events: none;
}
.b-col--r.b-col--sf .b-slot::after {
  content: '';
  position: absolute;
  left: -20px; top: 50%;
  width: 20px; height: 0;
  border-top: 1px solid var(--border);
  border-left: none;
  pointer-events: none;
}

/* Match card */
.b-card {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  overflow: hidden;
}
.b-card--final {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(255,45,120,0.2), 0 4px 20px rgba(255,45,120,0.1);
}

/* Team row */
.b-team {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(46,32,96,0.4);
}
.b-team:last-of-type { border-bottom: none; }
.b-team--win { background: rgba(0,229,255,0.06); }
.b-card--final .b-team--win { background: rgba(255,45,120,0.08); }

.b-team-main {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-dim);
  line-height: 1;
}
.b-team--win .b-team-main { color: var(--text); font-weight: 800; }
.b-card--final .b-team--win .b-team-main { color: var(--accent); }

.b-flag { font-size: 13px; flex-shrink: 0; }
.b-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.b-score {
  font-size: 12px; font-weight: 800;
  color: var(--text-dim);
  min-width: 12px; text-align: right; flex-shrink: 0;
}
.b-team--win .b-score { color: inherit; }

/* Pool player chips */
.b-players {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 0 7px 5px;
}
.b-player {
  font-size: 9px; font-weight: 700; letter-spacing: .04em;
  color: var(--cyan);
  background: rgba(0,229,255,0.08);
  border: 1px solid rgba(0,229,255,0.2);
  border-radius: 3px;
  padding: 1px 4px;
  white-space: nowrap;
}
.b-team--win .b-player {
  background: rgba(0,229,255,0.14);
  border-color: rgba(0,229,255,0.35);
}
.b-card--final .b-player {
  color: var(--accent);
  background: rgba(255,45,120,0.08);
  border-color: rgba(255,45,120,0.25);
}

/* Time label */
.b-time {
  font-size: 9px; font-weight: 700; letter-spacing: .05em;
  color: var(--text-dim); opacity: .5;
  text-align: center;
  padding: 3px 4px 4px;
  border-top: 1px solid rgba(46,32,96,0.4);
}
</style>
