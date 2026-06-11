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
            <div class="strength-bar" :style="{ width: (entry.pct * 100).toFixed(1) + '%' }"></div>
          </div>
          <div class="strength-teams">
            <span v-for="team in entry.teams" :key="team" class="strength-team">{{ team }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePoolStore } from '../stores/pool.js'

const store = usePoolStore()
const expanded = ref(null)

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
</style>
