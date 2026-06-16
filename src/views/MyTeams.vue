<template>
  <div class="view">
    <!-- Player selector -->
    <div class="player-scroll">
      <button
        v-for="p in sortedPlayers"
        :key="p.name"
        class="player-chip"
        :class="{ active: selected === p.name }"
        @click="selectPlayer(p.name)"
      >{{ p.name }}</button>
    </div>

    <template v-if="!selected">
      <p class="view-title">Leaderboard</p>
      <div class="card mini-lb">
        <button
          v-for="(entry, i) in store.leaderboard"
          :key="entry.name"
          class="mini-lb-row"
          :class="{ 'mini-lb-row--div': i > 0 }"
          @click="selectPlayer(entry.name)"
        >
          <div class="mini-lb-top">
            <span class="mini-lb-rank" :class="rankClass(entry.rank)">{{ entry.rank }}</span>
            <span class="mini-lb-name">{{ entry.name }}</span>
            <span class="mini-lb-pts">{{ entry.total }} <span class="mini-lb-pts-label">pts</span></span>
          </div>
          <div v-if="recentBreakdownByPlayer[entry.name]" class="mini-lb-recent">
            <span class="mini-lb-recent-label">Last pts earned:</span>
            <div class="mini-lb-recent-line">
              <span class="mini-lb-recent-flag">{{ FLAG_MAP[recentBreakdownByPlayer[entry.name].team] ?? '🏳' }}</span>
              <span class="mini-lb-recent-team">{{ recentBreakdownByPlayer[entry.name].team }}</span>
              <span class="mini-lb-recent-score">{{ recentBreakdownByPlayer[entry.name].bd.scoreStr }}</span>
              <span v-for="item in recentBreakdownByPlayer[entry.name].bd.items" :key="item.key"
                class="td-chip" :class="`td-chip--${item.key.replace(/\d/g,'n')}`"
              >{{ item.key }} +{{ item.pts }}</span>
              <span v-if="recentBreakdownByPlayer[entry.name].bd.mul > 1" class="td-mul">×{{ recentBreakdownByPlayer[entry.name].bd.mul }}</span>
            </div>
          </div>
        </button>
        <p v-if="!store.leaderboard.length" class="empty-msg">No data yet</p>
      </div>
    </template>

    <template v-else-if="player">
      <!-- Points summary -->
      <div class="pts-banner card">
        <span class="pts-name">{{ player.name }}</span>
        <div class="pts-right">
          <span class="pts-total">{{ playerEntry?.total ?? 0 }}</span>
          <span class="pts-label">pts</span>
          <span class="pts-rank" v-if="playerEntry">Rank #{{ playerEntry.rank }}</span>
        </div>
      </div>

      <!-- Team cards -->
      <p class="view-title" style="margin-top:16px">Teams</p>
      <div class="team-grid">
        <div
          v-for="team in teams"
          :key="team.name"
          class="team-card card"
          :class="{ 'team-card--conflict': team.groupConflict }"
        >
          <div class="team-card-top">
            <span class="team-card-flag">{{ FLAG_MAP[team.name] ?? '🏳' }}</span>
            <span class="team-card-name">{{ team.name }}</span>
            <button v-if="liveMatchByTeam[team.name]" class="team-live-btn" @click="goToLiveMatch(team.name)">● LIVE</button>
            <span class="pill" :class="`pill-t${team.tier}`">T{{ team.tier }}</span>
            <span v-if="store.fifaRankMap[team.name]" class="fifa-badge">FIFA #{{ store.fifaRankMap[team.name] }}</span>
            <span v-if="team.group" class="group-badge" :class="{ 'group-badge--conflict': team.groupConflict }">
              {{ team.groupConflict ? '⚠️ ' : '' }}Grp {{ team.group }}
            </span>
          </div>
          <div v-if="sharedWithMap[team.name]" class="team-shared">
            <span class="team-shared-label">Also picked by</span>
            <span v-for="name in sharedWithMap[team.name]" :key="name" class="team-shared-chip">{{ name }}</span>
          </div>
          <div class="team-card-stat-row">
            <span class="team-card-pts">{{ team.pts }} pts</span>
            <span class="team-card-goals">{{ teamGoals[team.name] ?? 0 }} {{ (teamGoals[team.name] ?? 0) === 1 ? 'goal' : 'goals' }} scored</span>
          </div>
          <div v-if="upcomingByTeam[team.name]?.length" class="sched-list">
            <div v-for="m in upcomingByTeam[team.name]" :key="m.date + m.opponent" class="sched-row">
              <span class="sched-date">{{ m.date }}</span>
              <span class="sched-opp">{{ m.oppFlag }} {{ m.opponent }}</span>
              <span class="sched-time">{{ m.time }}</span>
            </div>
          </div>
          <div v-if="teamBreakdowns[team.name]?.length" class="td-list">
            <div class="td-header">
              <span class="td-label">Points breakdown</span>
              <router-link to="/rules" class="td-rules-link">Scoring guide ↗</router-link>
            </div>
            <div v-for="bd in teamBreakdowns[team.name]" :key="bd.date" class="td-row">
              <span class="td-total">+{{ bd.total }} pts</span>
              <span class="td-wld" :class="`td-wld--${wld(bd)}`">{{ wld(bd) }}</span>
              <span class="td-date">{{ fmtDate(bd.date) }}</span>
              <span class="td-opp">vs {{ bd.opponent }}</span>
              <span class="td-score">{{ bd.scoreStr }}</span>
              <span class="td-chips">
                <span v-for="item in bd.items" :key="item.key"
                  class="td-chip" :class="`td-chip--${item.key.replace(/\d/g,'n')}`"
                >{{ item.key }} +{{ item.pts }}</span>
                <span v-if="bd.mul > 1" class="td-mul">×{{ bd.mul }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoolStore } from '../stores/pool.js'
import { FLAG_MAP } from '../data/index.js'
import { matchBreakdownForTeam } from '../services/points.js'
import { matchSlug } from '../utils.js'

const route  = useRoute()
const router = useRouter()
const store  = usePoolStore()
const selected = ref(null)

function selectPlayer(name) {
  selected.value = name
  router.replace({ path: '/my-teams', query: name ? { player: name } : {} })
}

onMounted(() => {
  if (route.query.player) selected.value = route.query.player
})

const sortedPlayers = computed(() => [...store.players].sort((a, b) => a.name.localeCompare(b.name)))

const player = computed(() => store.players.find(p => p.name === selected.value))
const playerEntry = computed(() => store.leaderboard.find(e => e.name === selected.value))

const teams = computed(() => {
  if (!player.value || !playerEntry.value) return []
  const names = [
    player.value.team1, player.value.team2, player.value.team3,
    player.value.team4, player.value.team5, player.value.team6,
  ].filter(Boolean)
  const groupCount = {}
  names.forEach(n => {
    const g = store.groupOf[n]
    if (g) groupCount[g] = (groupCount[g] || 0) + 1
  })
  return names.map(name => {
    const group = store.groupOf[name]
    return {
      name,
      tier: store.tierMap[name] ?? '?',
      pts: playerEntry.value.breakdown[name] ?? 0,
      fifaRank: store.fifaRankMap[name] ?? 999,
      group,
      groupConflict: group ? groupCount[group] > 1 : false,
    }
  }).sort((a, b) => b.pts - a.pts || a.fifaRank - b.fifaRank)
})

const sharedWithMap = computed(() => {
  const map = {}
  store.players.forEach(p => {
    [p.team1,p.team2,p.team3,p.team4,p.team5,p.team6].filter(Boolean).forEach(t => {
      if (!map[t]) map[t] = []
      map[t].push(p.name)
    })
  })
  // For the selected player, return only the OTHER owners per team
  const out = {}
  teams.value.forEach(({ name }) => {
    const others = (map[name] ?? []).filter(n => n !== selected.value)
    if (others.length) out[name] = others
  })
  return out
})

const upcomingByTeam = computed(() => {
  const out = {}
  teams.value.forEach(({ name }) => {
    out[name] = store.matches
      .filter(m => (m.home === name || m.away === name) && m.home_score === '' && !m.snapshot_minute)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
      .map(m => ({
        date: fmtDate(m.date),
        time: m.time?.replace(' CT', '') ?? '',
        opponent: m.home === name ? m.away : m.home,
        oppFlag: FLAG_MAP[m.home === name ? m.away : m.home] ?? '🏳',
      }))
  })
  return out
})

const teamBreakdowns = computed(() => {
  if (!player.value) return {}
  const out = {}
  teams.value.forEach(({ name }) => {
    out[name] = store.matches
      .map(m => matchBreakdownForTeam(name, m))
      .filter(Boolean)
  })
  return out
})

const teamGoals = computed(() => {
  const map = {}
  store.matches.forEach(m => {
    ;(m.goals ?? []).forEach(g => {
      const team = g.team === 'home' ? m.home : m.away
      map[team] = (map[team] ?? 0) + 1
    })
  })
  return map
})

const liveMatchByTeam = computed(() => {
  const map = {}
  store.enrichedMatches.forEach(m => {
    if (m.snapshot_minute || m.autoLive) {
      map[m.home] = m
      map[m.away] = m
    }
  })
  return map
})

function goToLiveMatch(team) {
  const m = liveMatchByTeam.value[team]
  if (!m) return
  router.push({ path: '/matches', hash: '#' + matchSlug(m) })
}

const recentBreakdownByPlayer = computed(() => {
  const map = {}
  store.players.forEach(p => {
    const teams = [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
    let best = null
    store.matches.forEach(m => {
      if (m.home_score === '' || m.away_score === '' || m.snapshot_minute) return
      const team = teams.includes(m.home) ? m.home : teams.includes(m.away) ? m.away : null
      if (!team) return
      const bd = matchBreakdownForTeam(team, m)
      if (!bd) return
      best = { team, bd }
    })
    map[p.name] = best
  })
  return map
})

function rankClass(r) {
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return ''
}

function wld(bd) {
  if (bd.items.some(i => i.key === 'W')) return 'W'
  if (bd.items.some(i => i.key === 'D')) return 'D'
  return 'L'
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(d) {
  const [, m, day] = d.split('-')
  return `${MONTHS[+m - 1]} ${+day}`
}
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
.pts-right { display: flex; align-items: baseline; gap: 5px; }
.pts-total { font-size: 26px; font-weight: 800; color: var(--accent); line-height: 1; }
.pts-label { font-size: 13px; color: var(--text-dim); }
.pts-rank { font-size: 13px; color: var(--text-dim); padding-left: 4px; border-left: 1px solid var(--border); }

.team-grid { display: flex; flex-direction: column; gap: 8px; }

.team-card { padding: 12px 14px; }

.team-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.team-card-flag { font-size: 22px; line-height: 1; flex-shrink: 0; }
.team-card-name { flex: 1; font-size: 17px; font-weight: 600; color: #ffffff; }
.team-shared {
  display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
  margin-top: 5px; margin-bottom: 2px;
}
.team-shared-label {
  font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--text-dim); opacity: 0.6; white-space: nowrap;
}
.team-shared-chip {
  font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 99px;
  background: rgba(189,95,255,0.12); color: var(--purple);
  border: 1px solid rgba(189,95,255,0.25); white-space: nowrap;
}

.team-live-btn {
  flex-shrink: 0; font-size: 11px; font-weight: 800; letter-spacing: .04em;
  color: var(--green); background: rgba(0,255,159,0.1);
  border: 1px solid rgba(0,255,159,0.3); border-radius: 99px;
  padding: 2px 8px; cursor: pointer; white-space: nowrap;
  animation: live-pulse 1.5s ease-in-out infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}

.team-card-stat-row { display: flex; align-items: baseline; gap: 10px; }
.team-card-pts { font-size: 24px; font-weight: 800; color: var(--accent); }
.team-card-goals { font-size: 13px; font-weight: 600; color: var(--cyan); }

.group-badge {
  font-size: 12px; font-weight: 700; letter-spacing: .04em;
  color: var(--text-dim); background: rgba(255,255,255,0.06);
  border: 1px solid var(--border); border-radius: 4px;
  padding: 2px 6px; white-space: nowrap; flex-shrink: 0;
}
.group-badge--conflict {
  color: #ffb020; background: rgba(255,176,32,0.1);
  border-color: rgba(255,176,32,0.4);
}
.team-card--conflict { border-color: rgba(255,176,32,0.35); }

.fifa-badge {
  font-size: 12px; font-weight: 700; letter-spacing: .04em;
  color: var(--cyan); background: rgba(0,229,255,0.08);
  border: 1px solid rgba(0,229,255,0.25); border-radius: 4px;
  padding: 2px 6px; white-space: nowrap; flex-shrink: 0;
}

.empty-msg { padding: 40px 24px; text-align: center; color: var(--text-dim); font-size: 17px; }

/* ── Mini leaderboard (blank state) ───────────────────────────── */
.mini-lb { display: flex; flex-direction: column; padding: 4px 0; }
.mini-lb-row {
  display: flex; flex-direction: column; gap: 6px;
  width: 100%; padding: 12px 14px; border: none; background: none;
  font: inherit; text-align: left; cursor: pointer; color: inherit;
}
.mini-lb-row--div { border-top: 1px solid var(--border); }
.mini-lb-top { display: flex; align-items: center; gap: 12px; }
.mini-lb-rank {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; background: var(--surface2); color: var(--text-dim);
}
.rank-gold   { background: #4a3a1a; color: #f0c060; }
.rank-silver { background: #2a2e3a; color: #d0d8e8; }
.rank-bronze { background: #2e2018; color: #e89060; }
.mini-lb-name { flex: 1; font-size: 16px; font-weight: 600; color: #ffffff; }
.mini-lb-pts { font-size: 17px; font-weight: 800; color: var(--accent); flex-shrink: 0; }
.mini-lb-pts-label { font-size: 12px; font-weight: 500; color: var(--text-dim); }

.mini-lb-recent {
  display: flex; flex-direction: column; gap: 3px;
  padding-left: 36px; font-size: 12px; min-width: 0;
}
.mini-lb-recent-label {
  font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
  color: var(--text-dim); opacity: 0.6; white-space: nowrap;
}
.mini-lb-recent-line { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
.mini-lb-recent-flag { font-size: 14px; line-height: 1; flex-shrink: 0; }
.mini-lb-recent-team { color: var(--text-dim); font-weight: 600; white-space: nowrap; }
.mini-lb-recent-score { color: #fff; font-weight: 700; white-space: nowrap; }

@media (max-width: 400px) {
  .mini-lb-recent { padding-left: 0; gap: 2px; }
  .mini-lb-recent-team { font-size: 11px; }
  .mini-lb-recent-line .td-chip,
  .mini-lb-recent-line .td-mul { font-size: 10px; padding: 1px 4px; }
}

/* ── Upcoming schedule ──────────────────────────────────────── */
.sched-list {
  margin-top: 8px; padding: 7px 10px;
  background: rgba(0,229,255,0.04);
  border: 1px solid rgba(0,229,255,0.12);
  border-radius: 6px;
  display: flex; flex-direction: column; gap: 4px;
}
.sched-row {
  display: flex; align-items: center; gap: 8px; font-size: 11px;
}
.sched-date {
  color: var(--cyan); font-weight: 700; white-space: nowrap; min-width: 40px;
  letter-spacing: .02em;
}
.sched-opp {
  flex: 1; color: var(--text-dim); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.sched-time {
  color: var(--accent); font-weight: 600; white-space: nowrap;
  font-size: 10px; opacity: 0.75;
}

/* ── Per-match point breakdown ──────────────────────────────── */
.td-list {
  margin-top: 10px; border-top: 1px solid var(--border);
  padding-top: 8px; display: flex; flex-direction: column; gap: 5px;
}
.td-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px; }
.td-label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); }
.td-rules-link { font-size: 11px; font-weight: 700; color: var(--cyan); opacity: 0.7; text-decoration: none; }
.td-rules-link:hover { opacity: 1; }
.td-row {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  font-size: 12px;
}
.td-wld {
  font-size: 10px; font-weight: 900; padding: 1px 5px;
  border-radius: 4px; white-space: nowrap; flex-shrink: 0; letter-spacing: .04em;
}
.td-wld--W { background: rgba(0,255,159,0.15); color: var(--green); }
.td-wld--D { background: rgba(0,229,255,0.12); color: var(--cyan); }
.td-wld--L { background: rgba(255,255,255,0.06); color: var(--text-dim); }

.td-date { color: var(--text-dim); font-weight: 600; white-space: nowrap; }
.td-opp  { color: var(--text-dim); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.td-score { font-weight: 700; color: #fff; white-space: nowrap; }
.td-chips { display: flex; gap: 4px; flex-wrap: wrap; }
.td-chip {
  font-size: 11px; font-weight: 800; padding: 1px 5px;
  border-radius: 4px; white-space: nowrap;
}
.td-chip--W   { background: rgba(0,255,159,0.15); color: var(--green); }
.td-chip--D   { background: rgba(0,229,255,0.12); color: var(--cyan); }
.td-chip--nG  { background: rgba(255,255,255,0.08); color: #fff; }
.td-chip--CS  { background: rgba(0,229,255,0.10); color: var(--cyan); }
.td-chip--FG  { background: rgba(255,210,0,0.12); color: #ffd200; }
.td-chip--CB  { background: rgba(255,140,0,0.14); color: #ff9d3a; }
.td-chip--PEN { background: rgba(189,95,255,0.14); color: var(--purple); }
.td-mul   { font-size: 11px; font-weight: 800; color: var(--accent); }
.td-total { font-size: 12px; font-weight: 800; color: #fff; white-space: nowrap; }
</style>
