<template>
  <div class="view">
    <!-- Search -->
    <div class="search-wrap">
      <input v-model="query" class="search-input" placeholder="Search teams…" />
    </div>

    <template v-if="query">
      <p class="view-title">Results</p>
      <div class="card team-list">
        <div v-for="(t, i) in searchResults" :key="t.team"
          class="team-list-row" :class="{ 'team-list-row--div': i > 0 }">
          <div class="tl-left">
            <span class="tl-name">{{ t.team }}</span>
            <span v-if="store.fifaRankMap[t.team]" class="tl-rank" :class="`tl-rank-t${t.tier}`">#{{ store.fifaRankMap[t.team] }}</span>
            <span v-if="GROUP_MAP[t.team]" class="tl-group">Grp {{ GROUP_MAP[t.team] }}</span>
          </div>
          <span class="pill" :class="`pill-t${t.tier}`">Tier {{ t.tier }}</span>
          <button v-if="liveMatchByTeam[t.team]" class="tl-live" @click="goToLiveMatch(t.team)">● LIVE</button>
          <span class="tl-owners">{{ ownersOf(t.team) }}</span>
        </div>
        <div v-if="!searchResults.length" class="tl-empty">No teams found</div>
      </div>
    </template>

    <template v-else>
      <div class="tiers-grid">
      <div v-for="tier in [1,2,3,4]" :key="tier" class="tier-section">
        <div class="tier-header">
          <span class="pill" :class="`pill-t${tier}`">Tier {{ tier }}</span>
          <span class="tier-sub">{{ tierLabel(tier) }}</span>
        </div>
        <div class="card team-list">
          <div v-for="(team, i) in store.tierGroups[tier]" :key="team"
            class="team-list-row" :class="{ 'team-list-row--div': i > 0 }">
            <div class="tl-left">
              <span class="tl-name">{{ team }}</span>
              <span v-if="store.fifaRankMap[team]" class="tl-rank" :class="`tl-rank-t${tier}`">#{{ store.fifaRankMap[team] }}</span>
              <span v-if="GROUP_MAP[team]" class="tl-group">Grp {{ GROUP_MAP[team] }}</span>
            </div>
            <button v-if="liveMatchByTeam[team]" class="tl-live" @click="goToLiveMatch(team)">● LIVE</button>
            <span class="tl-owners">{{ ownersOf(team) }}</span>
          </div>
          <div v-if="!store.tierGroups[tier]?.length" class="tl-empty">No teams in this tier</div>
        </div>
      </div>
      </div><!-- /tiers-grid -->
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePoolStore } from '../stores/pool.js'
import { GROUP_MAP } from '../data/index.js'
import { matchSlug } from '../utils.js'

const store = usePoolStore()
const router = useRouter()
const query = ref('')

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

const searchResults = computed(() => {
  const q = query.value.toLowerCase()
  return store.tiers.filter(t => t.team.toLowerCase().includes(q))
})

function ownersOf(team) {
  const owners = store.players
    .filter(p => [p.team1,p.team2,p.team3,p.team4,p.team5,p.team6].includes(team))
    .map(p => p.name)
  return owners.length ? owners.join(', ') : '—'
}

const TIER_LABELS = {
  1: 'Contenders (+450 to 20–1)',
  2: 'Dark Horses (50–1 to 150–1)',
  3: 'Solid (200–1 to 500–1)',
  4: 'Cinderellas (750–1+)',
}
function tierLabel(t) { return TIER_LABELS[t] }
</script>

<style scoped>
.search-wrap { margin-bottom: 16px; }
.search-input {
  width: 100%; padding: 10px 14px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius);
  color: var(--text); font-size: 17px;
}
.search-input::placeholder { color: var(--text-dim); }
.search-input:focus { outline: none; border-color: var(--accent); }

.tiers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 540px) {
  .tiers-grid { grid-template-columns: 1fr; }
}

.tier-section { margin-bottom: 0; }
.tier-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.tier-sub { font-size: 13px; color: var(--text-dim); }

.team-list {}
.team-list-row { display: flex; align-items: center; gap: 10px; padding: 11px 14px; }
.team-list-row--div { border-top: 1px solid var(--border); }
.tl-left { flex: 1; display: flex; align-items: baseline; gap: 6px; min-width: 0; }
.tl-name { font-size: 17px; font-weight: 500; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tl-rank { font-size: 12px; font-weight: 700; flex-shrink: 0; }
.tl-group { font-size: 11px; font-weight: 700; letter-spacing: .04em; color: var(--text-dim); background: rgba(255,255,255,0.06); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; white-space: nowrap; flex-shrink: 0; }
.tl-rank-t1 { color: #ff6fa0; }
.tl-rank-t2 { color: var(--cyan); }
.tl-rank-t3 { color: var(--green); }
.tl-rank-t4 { color: var(--purple); }
.tl-live {
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
.tl-owners { font-size: 12px; color: var(--text-dim); text-align: right; max-width: 110px; }
.tl-empty { padding: 16px; text-align: center; color: var(--text-dim); font-size: 16px; }
</style>
