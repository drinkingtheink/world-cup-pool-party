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
          <span class="tl-name">{{ t.team }}</span>
          <span v-if="store.fifaRankMap[t.team]" class="fifa-badge">FIFA #{{ store.fifaRankMap[t.team] }}</span>
          <span class="pill" :class="`pill-t${t.tier}`">Tier {{ t.tier }}</span>
          <span class="tl-owners">{{ ownersOf(t.team) }}</span>
        </div>
        <div v-if="!searchResults.length" class="tl-empty">No teams found</div>
      </div>
    </template>

    <template v-else>
      <div v-for="tier in [1,2,3,4]" :key="tier" class="tier-section">
        <div class="tier-header">
          <span class="pill" :class="`pill-t${tier}`">Tier {{ tier }}</span>
          <span class="tier-sub">{{ tierLabel(tier) }}</span>
        </div>
        <div class="card team-list">
          <div v-for="(team, i) in store.tierGroups[tier]" :key="team"
            class="team-list-row" :class="{ 'team-list-row--div': i > 0 }">
            <span class="tl-name">{{ team }}</span>
            <span v-if="store.fifaRankMap[team]" class="fifa-badge">FIFA #{{ store.fifaRankMap[team] }}</span>
            <span class="tl-owners">{{ ownersOf(team) }}</span>
          </div>
          <div v-if="!store.tierGroups[tier]?.length" class="tl-empty">No teams in this tier</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePoolStore } from '../stores/pool.js'

const store = usePoolStore()
const query = ref('')

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

.tier-section { margin-bottom: 16px; }
.tier-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.tier-sub { font-size: 13px; color: var(--text-dim); }

.team-list {}
.team-list-row { display: flex; align-items: center; gap: 10px; padding: 11px 14px; }
.team-list-row--div { border-top: 1px solid var(--border); }
.tl-name { flex: 1; font-size: 17px; font-weight: 500; color: #ffffff; }
.tl-owners { font-size: 13px; color: var(--text-dim); text-align: right; max-width: 140px; }

.fifa-badge {
  font-size: 12px; font-weight: 700; letter-spacing: .04em;
  color: var(--cyan); background: rgba(0,229,255,0.08);
  border: 1px solid rgba(0,229,255,0.25); border-radius: 4px;
  padding: 2px 6px; white-space: nowrap; flex-shrink: 0;
}
.tl-empty { padding: 16px; text-align: center; color: var(--text-dim); font-size: 16px; }
</style>
