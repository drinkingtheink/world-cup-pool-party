<template>
  <div class="view">
    <p class="view-title">Full Tournament Stats</p>

    <div class="tourney-stats card">
      <div class="stat-item">
        <span class="stat-value">{{ totalGoals }}</span>
        <span class="stat-label">Goals Scored</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ matchesPlayed }} <span class="stat-of">/ {{ totalMatches }}</span></span>
        <span class="stat-label">Matches Played</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ goalsPerGame }}</span>
        <span class="stat-label">Goals / Game</span>
      </div>
    </div>

    <button class="schedule-btn" @click="router.push('/matches')">
      <CalendarDays :size="15" class="schedule-btn-icon" />
      <span class="schedule-btn-label">See Match Schedule</span>
      <ChevronRight :size="14" class="schedule-btn-arrow" />
    </button>

    <p class="view-title"></p>

    <div class="leaderboard">
      <div
        v-for="(entry, i) in store.leaderboard"
        :key="entry.name"
        class="lb-row card"
        :class="{ 'lb-row--first': entry.rank === 1 }"
        :style="{ '--i': i }"
        @click="expanded = expanded === entry.name ? null : entry.name"
      >
        <div class="lb-main">
          <span class="lb-rank" :class="rankClass(entry.rank)">{{ entry.rank }}</span>
          <div class="lb-center">
            <div class="lb-name-row">
              <span class="lb-name">{{ entry.name }}</span>
              <span class="lb-today-tomorrow">
                <span class="lb-tt-label">Games:</span> {{ playerMatchDays[entry.name].today }} Today
                <span class="lb-tt-sep">/</span>
                {{ playerMatchDays[entry.name].tomorrow }} Tomorrow
              </span>
            </div>
            <div class="lb-flags">
              <span v-for="team in rankedTeams(entry.teams)" :key="team" class="lb-flag" :title="team">{{ FLAG_MAP[team] ?? '🏳' }}</span>
            </div>
            <span class="lb-goals"><span class="lb-goals-label">Total Group Goals:</span> {{ playerGoals[entry.name] }}</span>
          </div>
          <span class="lb-pts">{{ entry.total }} <span class="lb-pts-label">pts</span></span>
        </div>

        <!-- Expanded team breakdown -->
        <transition name="expand">
          <div v-if="expanded === entry.name" class="lb-breakdown">
            <div v-for="team in rankedTeams(entry.teams)" :key="team" class="lb-team-row">
              <span class="lb-team-flag">{{ FLAG_MAP[team] ?? '🏳' }}</span>
              <span class="lb-team-name">{{ team }}</span>
              <span class="lb-team-pts">{{ entry.breakdown[team] ?? 0 }} pts</span>
            </div>
          </div>
        </transition>
      </div>

      <p v-if="!store.leaderboard.length" class="empty-msg">No data yet</p>
    </div>

    <div class="quote-card">
      <span class="quote-mark">"</span>
      <p class="quote-text">{{ randomQuote.text }}</p>
      <p class="quote-author">— {{ randomQuote.author }}</p>
    </div>

    <!-- Paper Strength -->
    <p class="view-title" style="margin-top:28px">Strength on Paper</p>
    <p class="strength-sub">Ranked by total implied win probability (BetMGM odds)</p>
    <div class="strength-list">
      <div v-for="(entry, i) in store.paperStrength" :key="entry.name" class="strength-row">
        <span class="strength-rank">{{ i + 1 }}</span>
        <div class="strength-body">
          <div class="strength-meta">
            <span class="strength-name">{{ entry.name }}</span>
            <span class="strength-score">{{ (entry.score * 100).toFixed(1) }}%</span>
          </div>
          <div class="strength-track">
            <div class="strength-bar" :style="{ width: ready ? (entry.pct * 100).toFixed(1) + '%' : '0%' }"></div>
          </div>
          <div class="strength-teams">
            <span v-for="team in entry.teams" :key="team" class="strength-team">{{ team }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier Mix -->
    <p class="view-title" style="margin-top:28px">Tier Mix</p>
    <p class="strength-sub">Squad composition by tier — risk vs. pedigree</p>
    <div class="tiermix-list">
      <div v-for="p in tierMix" :key="p.name" class="tiermix-row">
        <span class="tiermix-name">{{ p.name }}</span>
        <div class="tiermix-bar">
          <div class="tiermix-seg seg-t1" :style="{ width: (p.t1/6*100)+'%' }" :title="`${p.t1} Tier 1`"></div>
          <div class="tiermix-seg seg-t2" :style="{ width: (p.t2/6*100)+'%' }" :title="`${p.t2} Tier 2`"></div>
          <div class="tiermix-seg seg-t3" :style="{ width: (p.t3/6*100)+'%' }" :title="`${p.t3} Tier 3`"></div>
          <div class="tiermix-seg seg-t4" :style="{ width: (p.t4/6*100)+'%' }" :title="`${p.t4} Tier 4`"></div>
        </div>
        <span class="tiermix-legend">{{ p.t1 }}<span class="tl-dot t1">●</span>{{ p.t2 }}<span class="tl-dot t2">●</span>{{ p.t3 }}<span class="tl-dot t3">●</span>{{ p.t4 }}<span class="tl-dot t4">●</span></span>
      </div>
    </div>
    <div class="tiermix-key">
      <span><span class="tl-dot t1">●</span> Tier 1</span>
      <span><span class="tl-dot t2">●</span> Tier 2</span>
      <span><span class="tl-dot t3">●</span> Tier 3</span>
      <span><span class="tl-dot t4">●</span> Tier 4</span>
    </div>

    <!-- Shared Picks -->
    <p class="view-title" style="margin-top:28px">Shared Picks</p>
    <p class="strength-sub">Teams selected by more than one player</p>
    <div class="shared-grid">
      <div
        v-for="item in sharedPicks" :key="item.team"
        class="shared-chip" :class="`shared-t${item.tier}`"
        :style="chipScale(item.count)"
      >
        <span class="shared-team">{{ item.team }}</span>
        <span class="shared-count">×{{ item.count }}</span>
      </div>
    </div>

    <!-- Wildcards -->
    <p class="view-title" style="margin-top:28px">Wildcards</p>
    <p class="strength-sub">Teams held exclusively by one player — their private upside</p>
    <div class="wildcard-list">
      <div v-for="item in wildcards" :key="item.team" class="wildcard-row">
        <span class="wildcard-team" :class="`wt-t${item.tier}`">{{ item.team }}</span>
        <span class="wildcard-player">{{ item.player }}</span>
      </div>
    </div>

    <!-- Same-Group Picks -->
    <p class="view-title" style="margin-top:28px">Same-Group Picks</p>
    <p class="strength-sub">Players with two or more teams competing in the same group</p>
    <div v-if="groupClashes.length" class="clash-list">
      <div v-for="entry in groupClashes" :key="entry.name" class="clash-row">
        <span class="clash-player">{{ entry.name }}</span>
        <div class="clash-groups">
          <div v-for="clash in entry.clashes" :key="clash.group" class="clash-group">
            <span class="clash-group-label">Group {{ clash.group }}</span>
            <div class="clash-teams">
              <span v-for="(team, ti) in clash.teams" :key="team" class="clash-team">
                <span class="clash-flag">{{ FLAG_MAP[team] ?? '🏳' }}</span>
                <span class="clash-team-name">{{ team }}</span>
                <span v-if="ti < clash.teams.length - 1" class="clash-vs">vs</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="strength-sub" style="font-style:italic">No same-group picks</p>

    <!-- Avg FIFA Rank -->
    <p class="view-title" style="margin-top:28px">Avg. FIFA Rank</p>
    <p class="strength-sub">Mean FIFA ranking across each player's 6 teams (lower = stronger)</p>
    <div class="strength-list">
      <div v-for="(entry, i) in avgFifaRank" :key="entry.name" class="strength-row">
        <span class="strength-rank">{{ i + 1 }}</span>
        <div class="strength-body">
          <div class="strength-meta">
            <span class="strength-name">{{ entry.name }}</span>
            <span class="fifa-score">Avg #{{ entry.avg }}</span>
          </div>
          <div class="strength-track">
            <div class="fifa-bar" :style="{ width: ready ? (entry.pct * 100).toFixed(1) + '%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarDays, ChevronRight } from 'lucide-vue-next'
import { usePoolStore } from '../stores/pool.js'
import { quotes, FLAG_MAP } from '../data/index.js'

const router = useRouter()

const store = usePoolStore()
const expanded = ref(null)
const ready = ref(false)

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

onMounted(() => nextTick(() => { ready.value = true }))

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
}
const today = todayStr()

const totalGoals    = computed(() => store.matches.reduce((sum, m) => sum + (m.goals?.length ?? 0), 0))

const playerGoals = computed(() => {
  const map = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    let g = 0
    store.matches.forEach(m => {
      ;(m.goals ?? []).forEach(goal => {
        if (teams.has(goal.team === 'home' ? m.home : m.away)) g++
      })
    })
    map[p.name] = g
  })
  return map
})
const matchesPlayed = computed(() => store.matches.filter(m => m.home_score !== '' && !m.snapshot_minute).length)
const totalMatches  = computed(() => store.matches.length)
const goalsPerGame  = computed(() => matchesPlayed.value ? (totalGoals.value / matchesPlayed.value).toFixed(2) : '—')

function playerTeams(p) {
  return [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
}

const playerMatchDays = computed(() => {
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)
  const result = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    let todayCount = 0, tomorrowCount = 0
    store.matches.forEach(m => {
      if (!teams.has(m.home) && !teams.has(m.away)) return
      if (m.date === today) todayCount++
      else if (m.date === tomorrowStr) tomorrowCount++
    })
    result[p.name] = { today: todayCount, tomorrow: tomorrowCount }
  })
  return result
})


// Tier mix per player
const tierMix = computed(() =>
  store.players
    .map(p => {
      const teams = playerTeams(p)
      const c = { t1: 0, t2: 0, t3: 0, t4: 0 }
      teams.forEach(t => { const n = store.tierMap[t] ?? 4; c[`t${n}`]++ })
      return { name: p.name, ...c, total: teams.length }
    })
    .filter(p => p.total > 0)
)

// Teams picked by 2+ players
const sharedPicks = computed(() => {
  const counts = {}, players = {}
  store.players.forEach(p =>
    playerTeams(p).forEach(t => {
      counts[t] = (counts[t] || 0) + 1
      players[t] = [...(players[t] || []), p.name]
    })
  )
  return Object.entries(counts)
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([team, count]) => ({ team, count, tier: store.tierMap[team] ?? 4 }))
})

// Teams held by exactly one player
const wildcards = computed(() => {
  const counts = {}, owner = {}
  store.players.forEach(p =>
    playerTeams(p).forEach(t => {
      counts[t] = (counts[t] || 0) + 1
      owner[t] = p.name
    })
  )
  return Object.entries(counts)
    .filter(([, c]) => c === 1)
    .map(([team]) => ({ team, player: owner[team], tier: store.tierMap[team] ?? 4 }))
    .sort((a, b) => a.tier - b.tier || a.team.localeCompare(b.team))
})

// Players with 2+ teams in the same group
const groupClashes = computed(() =>
  store.players
    .map(p => {
      const teams = playerTeams(p)
      const byGroup = {}
      teams.forEach(t => {
        const g = store.groupOf[t]
        if (!g) return
        if (!byGroup[g]) byGroup[g] = []
        byGroup[g].push(t)
      })
      const clashes = Object.entries(byGroup)
        .filter(([, ts]) => ts.length >= 2)
        .map(([group, ts]) => ({ group, teams: ts }))
        .sort((a, b) => a.group.localeCompare(b.group))
      return { name: p.name, clashes }
    })
    .filter(p => p.clashes.length > 0)
)

// Average FIFA rank per player
const avgFifaRank = computed(() => {
  const ranked = store.players
    .map(p => {
      const teams = playerTeams(p)
      const ranks = teams.map(t => store.fifaRankMap[t]).filter(Boolean)
      const avg = ranks.length ? Math.round(ranks.reduce((s, r) => s + r, 0) / ranks.length) : 999
      return { name: p.name, avg }
    })
    .filter(p => p.avg < 999)
    .sort((a, b) => a.avg - b.avg)
  const min = ranked[0]?.avg ?? 1
  const max = ranked.at(-1)?.avg ?? 1
  const spread = max - min || 1
  return ranked.map(p => ({ ...p, pct: 0.15 + 0.85 * (1 - (p.avg - min) / spread) }))
})


function chipScale(count) {
  const maxCount = Math.max(...sharedPicks.value.map(s => s.count))
  const t = (count - 2) / Math.max(maxCount - 2, 1)
  const fontSize = (11 + t * 10).toFixed(1) + 'px'
  const padV    = (4  + t * 6).toFixed(1) + 'px'
  const padH    = (10 + t * 10).toFixed(1) + 'px'
  return { fontSize, padding: `${padV} ${padH}` }
}

function rankedTeams(teams) {
  return [...teams].sort((a, b) => (store.fifaRankMap[a] ?? 999) - (store.fifaRankMap[b] ?? 999))
}

function rankClass(r) {
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return ''
}
</script>

<style scoped>
.tourney-stats {
  display: flex; align-items: center; justify-content: space-around;
  padding: 16px; margin-bottom: 16px;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.stat-value { font-size: 26px; font-weight: 800; color: var(--green); }
.stat-of { font-size: 16px; color: var(--text-dim); font-weight: 600; }
.stat-label { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); }
.stat-divider { width: 1px; height: 40px; background: var(--border); }

.leaderboard { display: flex; flex-direction: column; gap: 8px; }

.lb-row { cursor: pointer; transition: border-color .15s; }
.lb-row--first { border-color: var(--accent); }

.lb-main {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px;
}

.lb-rank {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; background: var(--surface2); color: var(--text-dim);
  flex-shrink: 0; margin-top: 1px;
}
.rank-gold   { background: #4a3a1a; color: #f0c060; }
.rank-silver { background: #2a2e3a; color: #d0d8e8; }
.rank-bronze { background: #2e2018; color: #e89060; }

.lb-center { flex: 1; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.lb-name { font-size: 18px; font-weight: 600; color: #ffffff; }
.lb-flags { display: flex; gap: 3px; flex-wrap: nowrap; }
.lb-flag { font-size: 24px; line-height: 1; cursor: default; flex-shrink: 0; }
.lb-goals { font-size: 12px; font-weight: 600; color: var(--text-dim); letter-spacing: .02em; }
.lb-goals-label { text-transform: uppercase; letter-spacing: .06em; font-size: 11px; }
.lb-pts { font-size: 20px; font-weight: 800; color: var(--accent); flex-shrink: 0; }
.lb-pts-label { font-size: 13px; font-weight: 500; color: var(--text-dim); }

.lb-name-row {
  display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
}
.lb-today-tomorrow {
  font-size: 11px; font-weight: 600; color: var(--text-dim);
  letter-spacing: .02em; white-space: nowrap;
}
.lb-tt-label { text-transform: uppercase; letter-spacing: .06em; font-size: 10px; }
.lb-tt-sep { margin: 0 4px; opacity: 0.4; }

.lb-breakdown {
  border-top: 1px solid var(--border);
  padding: 10px 16px 14px;
  display: flex; flex-direction: column; gap: 6px;
}
.lb-team-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 16px;
}
.lb-team-flag { font-size: 18px; line-height: 1; flex-shrink: 0; }
.lb-team-name { display: flex; align-items: center; gap: 6px; color: var(--text-dim); flex: 1; }
.lb-team-pts { font-weight: 600; color: #ffffff; }

.expand-enter-active, .expand-leave-active { transition: opacity .15s; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 17px; }

/* ── Paper Strength ───────────────────────────────────────────── */
.strength-sub {
  font-size: 13px; color: var(--text-dim); margin-bottom: 14px; margin-top: -8px;
}

.strength-list { display: flex; flex-direction: column; gap: 12px; }

.strength-row { display: flex; align-items: flex-start; gap: 10px; }

.strength-rank {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: var(--surface2); color: var(--text-dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; margin-top: 2px;
}

.strength-body { flex: 1; }

.strength-meta {
  display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;
}
.strength-name { font-size: 17px; font-weight: 700; color: #ffffff; }
.strength-score { font-size: 14px; font-weight: 700; color: var(--cyan); }

.strength-track {
  height: 8px; background: var(--surface2); border-radius: 99px; overflow: hidden; margin-bottom: 7px;
}
.strength-bar {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, var(--cyan), var(--accent));
  box-shadow: 0 0 8px rgba(0,229,255,0.4);
  transition: width .6s cubic-bezier(.4,0,.2,1);
}

.strength-teams { display: flex; flex-wrap: wrap; gap: 4px; }
.strength-team {
  font-size: 12px; font-weight: 600; color: var(--text-dim);
  background: var(--surface2); border: 1px solid var(--border);
  padding: 2px 7px; border-radius: 99px;
}

/* ── Tier Mix ─────────────────────────────────────────────────── */
.tiermix-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
.tiermix-row { display: flex; align-items: center; gap: 10px; }
.tiermix-name { font-size: 16px; font-weight: 700; color: #fff; width: 62px; flex-shrink: 0; }
.tiermix-bar {
  flex: 1; height: 10px; border-radius: 99px; overflow: hidden;
  background: var(--surface2); display: flex;
}
.tiermix-seg { height: 100%; transition: width .6s cubic-bezier(.4,0,.2,1); }
.seg-t1 { background: #ff2d78; }
.seg-t2 { background: #00e5ff; }
.seg-t3 { background: #00ff9f; }
.seg-t4 { background: #bd5fff; }
.tiermix-legend { font-size: 13px; font-weight: 700; color: var(--text-dim); white-space: nowrap; display: flex; align-items: center; gap: 3px; }
.tl-dot { font-size: 11px; }
.tl-dot.t1 { color: #ff2d78; }
.tl-dot.t2 { color: #00e5ff; }
.tl-dot.t3 { color: #00ff9f; }
.tl-dot.t4 { color: #bd5fff; }
.tiermix-key {
  display: flex; gap: 14px; font-size: 12px; color: var(--text-dim);
  margin-top: 4px; padding-left: 72px;
}
.tiermix-key span { display: flex; align-items: center; gap: 3px; }

/* ── Shared Picks ─────────────────────────────────────────────── */
.shared-grid { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-end; }
.shared-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 99px; border: 1px solid;
  font-size: 13px; font-weight: 700;
}
.shared-t1 { background: rgba(255,45,120,0.12); color: #ff6fa0; border-color: rgba(255,45,120,0.3); }
.shared-t2 { background: rgba(0,229,255,0.1); color: #00e5ff; border-color: rgba(0,229,255,0.3); }
.shared-t3 { background: rgba(0,255,159,0.08); color: #00ff9f; border-color: rgba(0,255,159,0.25); }
.shared-t4 { background: rgba(189,95,255,0.1); color: #bd5fff; border-color: rgba(189,95,255,0.25); }
.shared-count {
  background: rgba(255,255,255,0.12); border-radius: 99px;
  padding: 0 5px; font-size: 12px; font-weight: 800; color: #fff;
}

/* ── Wildcards ────────────────────────────────────────────────── */
.wildcard-list { display: flex; flex-direction: column; gap: 7px; }
.wildcard-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 10px; border-radius: 8px;
  background: var(--surface2); border: 1px solid var(--border);
}
.wildcard-team { font-size: 16px; font-weight: 700; }
.wt-t1 { color: #ff6fa0; }
.wt-t2 { color: #00e5ff; }
.wt-t3 { color: #00ff9f; }
.wt-t4 { color: #bd5fff; }
.wildcard-player { font-size: 13px; font-weight: 600; color: var(--text-dim); }

/* ── Avg FIFA Rank ────────────────────────────────────────────── */
.fifa-score { font-size: 14px; font-weight: 700; color: #ffd200; }
.fifa-bar {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #ffd200, #ff8c00);
  box-shadow: 0 0 8px rgba(255,210,0,0.3);
  transition: width .6s cubic-bezier(.4,0,.2,1);
}

/* ── Match Schedule Button ────────────────────────────────────── */
@keyframes btn-shimmer {
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
}

.schedule-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 15px 20px;
  margin: 16px 0 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,45,120,0.12) 0%, rgba(13,10,30,0.9) 50%, rgba(0,229,255,0.12) 100%);
  box-shadow:
    0 0 0 1px rgba(255,45,120,0.45),
    0 0 18px rgba(255,45,120,0.12),
    inset 0 1px 0 rgba(255,255,255,0.06);
  color: #fff;
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1);
}

.schedule-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 20%,
    rgba(255,255,255,0.04) 50%,
    transparent 80%
  );
  background-size: 300% auto;
  animation: btn-shimmer 7s linear infinite;
  pointer-events: none;
}

.schedule-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(0,229,255,0.55),
    0 0 18px rgba(0,229,255,0.14),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.schedule-btn:active {
  transform: translateY(1px) scale(0.97);
  box-shadow:
    0 0 0 1px rgba(255,45,120,0.6),
    0 0 10px rgba(255,45,120,0.25),
    inset 0 2px 4px rgba(0,0,0,0.3);
  transition: transform 0.07s ease, box-shadow 0.07s ease;
}

.schedule-btn-label {
  background: linear-gradient(90deg, var(--accent) 0%, var(--cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.schedule-btn-icon { color: var(--accent); flex-shrink: 0; }
.schedule-btn-arrow { color: var(--cyan); flex-shrink: 0; opacity: 0.7; }

/* ── Header Quote Card ────────────────────────────────────────── */
.quote-card {
  position: relative;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 16px 18px 14px;
  border-radius: 12px;
  background: rgba(13,10,30,0.7);
  border: 1px solid rgba(0,229,255,0.18);
  box-shadow: 0 0 18px rgba(0,229,255,0.07), inset 0 1px 0 rgba(255,255,255,0.04);
  overflow: hidden;
}
.quote-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(189,95,255,0.04) 100%);
  pointer-events: none;
}
.quote-mark {
  display: block;
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 48px; line-height: 1;
  color: var(--cyan);
  opacity: 0.35;
  margin-bottom: -6px;
  text-shadow: 0 0 12px rgba(0,229,255,0.5);
}
.quote-text {
  font-style: italic;
  font-size: 17px;
  line-height: 1.55;
  color: rgba(255,255,255,0.85);
  margin: 0 0 8px;
}
.quote-author {
  font-size: 13px;
  font-weight: 600;
  color: var(--cyan);
  margin: 0;
  opacity: 0.75;
  letter-spacing: .04em;
}

/* ── Same-Group Picks ─────────────────────────────────────────── */
.clash-list { display: flex; flex-direction: column; gap: 10px; }

.clash-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: var(--surface); border: 1px solid var(--border);
}

.clash-player {
  font-size: 15px; font-weight: 700; color: #fff;
  width: 62px; flex-shrink: 0; padding-top: 1px;
}

.clash-groups { display: flex; flex-direction: column; gap: 6px; flex: 1; }

.clash-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.clash-group-label {
  font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
  color: #ffd200; background: rgba(255,210,0,0.1);
  border: 1px solid rgba(255,210,0,0.25);
  border-radius: 4px; padding: 2px 6px; flex-shrink: 0;
}

.clash-teams { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.clash-team { display: flex; align-items: center; gap: 4px; }
.clash-flag { font-size: 18px; line-height: 1; }
.clash-team-name { font-size: 13px; font-weight: 600; color: var(--text-dim); }
.clash-vs {
  font-size: 11px; font-weight: 800; letter-spacing: .06em;
  color: var(--text-dim); opacity: 0.4;
}
</style>
