<template>
  <div class="view">
    <p class="view-title">Standings</p>
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
            <span class="lb-name">{{ entry.name }}</span>
            <div class="lb-flags">
              <span v-for="team in entry.teams" :key="team" class="lb-flag" :title="team">{{ FLAG_MAP[team] ?? '🏳' }}</span>
            </div>
          </div>
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
      <div v-for="item in sharedPicks" :key="item.team" class="shared-chip" :class="`shared-t${item.tier}`">
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
import { usePoolStore } from '../stores/pool.js'

const store = usePoolStore()
const expanded = ref(null)
const ready = ref(false)
onMounted(() => nextTick(() => { ready.value = true }))

function playerTeams(p) {
  return [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
}

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

const FLAG_MAP = {
  // Tier 1
  'Spain':                '🇪🇸',
  'France':               '🇫🇷',
  'England':              '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Portugal':             '🇵🇹',
  'Argentina':            '🇦🇷',
  'Brazil':               '🇧🇷',
  'Germany':              '🇩🇪',
  'Netherlands':          '🇳🇱',
  'Belgium':              '🇧🇪',
  'Norway':               '🇳🇴',
  'Colombia':             '🇨🇴',
  'Morocco':              '🇲🇦',
  // Tier 2
  'Japan':                '🇯🇵',
  'USA':                  '🇺🇸',
  'Mexico':               '🇲🇽',
  'Senegal':              '🇸🇳',
  'Switzerland':          '🇨🇭',
  'Turkey':               '🇹🇷',
  'Uruguay':              '🇺🇾',
  'Croatia':              '🇭🇷',
  'Ecuador':              '🇪🇨',
  'Sweden':               '🇸🇪',
  'Austria':              '🇦🇹',
  'Canada':               '🇨🇦',
  // Tier 3
  'Ivory Coast':          '🇨🇮',
  'Algeria':              '🇩🇿',
  'Bosnia & Herzegovina': '🇧🇦',
  'Czech Republic':       '🇨🇿',
  'Egypt':                '🇪🇬',
  'South Korea':          '🇰🇷',
  'Paraguay':             '🇵🇾',
  'Scotland':             '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Australia':            '🇦🇺',
  'Ghana':                '🇬🇭',
  'Iran':                 '🇮🇷',
  'Tunisia':              '🇹🇳',
  // Tier 4
  'DR Congo':             '🇨🇩',
  'Cape Verde':           '🇨🇻',
  'Iraq':                 '🇮🇶',
  'Jordan':               '🇯🇴',
  'New Zealand':          '🇳🇿',
  'Panama':               '🇵🇦',
  'Qatar':                '🇶🇦',
  'Saudi Arabia':         '🇸🇦',
  'South Africa':         '🇿🇦',
  'Uzbekistan':           '🇺🇿',
  'Curaçao':              '🇨🇼',
  'Haiti':                '🇭🇹',
}

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
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px;
}

.lb-rank {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; background: var(--surface2); color: var(--text-dim);
  flex-shrink: 0; margin-top: 1px;
}
.rank-gold   { background: #4a3a1a; color: #f0c060; }
.rank-silver { background: #2a2e3a; color: #d0d8e8; }
.rank-bronze { background: #2e2018; color: #e89060; }

.lb-center { flex: 1; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.lb-name { font-size: 15px; font-weight: 600; color: #ffffff; }
.lb-flags { display: flex; gap: 4px; flex-wrap: wrap; }
.lb-flag { font-size: 24px; line-height: 1; cursor: default; }
.lb-pts { font-size: 17px; font-weight: 800; color: var(--accent); flex-shrink: 0; }
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
.lb-team-pts { font-weight: 600; color: #ffffff; }

.expand-enter-active, .expand-leave-active { transition: opacity .15s; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 14px; }

/* ── Paper Strength ───────────────────────────────────────────── */
.strength-sub {
  font-size: 11px; color: var(--text-dim); margin-bottom: 14px; margin-top: -8px;
}

.strength-list { display: flex; flex-direction: column; gap: 12px; }

.strength-row { display: flex; align-items: flex-start; gap: 10px; }

.strength-rank {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: var(--surface2); color: var(--text-dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; margin-top: 2px;
}

.strength-body { flex: 1; }

.strength-meta {
  display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;
}
.strength-name { font-size: 14px; font-weight: 700; color: #ffffff; }
.strength-score { font-size: 12px; font-weight: 700; color: var(--cyan); }

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
  font-size: 10px; font-weight: 600; color: var(--text-dim);
  background: var(--surface2); border: 1px solid var(--border);
  padding: 2px 7px; border-radius: 99px;
}

/* ── Tier Mix ─────────────────────────────────────────────────── */
.tiermix-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
.tiermix-row { display: flex; align-items: center; gap: 10px; }
.tiermix-name { font-size: 13px; font-weight: 700; color: #fff; width: 62px; flex-shrink: 0; }
.tiermix-bar {
  flex: 1; height: 10px; border-radius: 99px; overflow: hidden;
  background: var(--surface2); display: flex;
}
.tiermix-seg { height: 100%; transition: width .6s cubic-bezier(.4,0,.2,1); }
.seg-t1 { background: #ff2d78; }
.seg-t2 { background: #00e5ff; }
.seg-t3 { background: #00ff9f; }
.seg-t4 { background: #bd5fff; }
.tiermix-legend { font-size: 11px; font-weight: 700; color: var(--text-dim); white-space: nowrap; display: flex; align-items: center; gap: 3px; }
.tl-dot { font-size: 9px; }
.tl-dot.t1 { color: #ff2d78; }
.tl-dot.t2 { color: #00e5ff; }
.tl-dot.t3 { color: #00ff9f; }
.tl-dot.t4 { color: #bd5fff; }
.tiermix-key {
  display: flex; gap: 14px; font-size: 10px; color: var(--text-dim);
  margin-top: 4px; padding-left: 72px;
}
.tiermix-key span { display: flex; align-items: center; gap: 3px; }

/* ── Shared Picks ─────────────────────────────────────────────── */
.shared-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.shared-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 99px; border: 1px solid;
  font-size: 11px; font-weight: 700;
}
.shared-t1 { background: rgba(255,45,120,0.12); color: #ff6fa0; border-color: rgba(255,45,120,0.3); }
.shared-t2 { background: rgba(0,229,255,0.1); color: #00e5ff; border-color: rgba(0,229,255,0.3); }
.shared-t3 { background: rgba(0,255,159,0.08); color: #00ff9f; border-color: rgba(0,255,159,0.25); }
.shared-t4 { background: rgba(189,95,255,0.1); color: #bd5fff; border-color: rgba(189,95,255,0.25); }
.shared-count {
  background: rgba(255,255,255,0.12); border-radius: 99px;
  padding: 0 5px; font-size: 10px; font-weight: 800; color: #fff;
}

/* ── Wildcards ────────────────────────────────────────────────── */
.wildcard-list { display: flex; flex-direction: column; gap: 7px; }
.wildcard-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 10px; border-radius: 8px;
  background: var(--surface2); border: 1px solid var(--border);
}
.wildcard-team { font-size: 13px; font-weight: 700; }
.wt-t1 { color: #ff6fa0; }
.wt-t2 { color: #00e5ff; }
.wt-t3 { color: #00ff9f; }
.wt-t4 { color: #bd5fff; }
.wildcard-player { font-size: 11px; font-weight: 600; color: var(--text-dim); }

/* ── Avg FIFA Rank ────────────────────────────────────────────── */
.fifa-score { font-size: 12px; font-weight: 700; color: #ffd200; }
.fifa-bar {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #ffd200, #ff8c00);
  box-shadow: 0 0 8px rgba(255,210,0,0.3);
  transition: width .6s cubic-bezier(.4,0,.2,1);
}
</style>
