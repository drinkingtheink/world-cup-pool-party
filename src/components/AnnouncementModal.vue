<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-backdrop" @click.self="closeTemporarily">
      <div class="modal-card">
        <div class="modal-scroll">
          <img v-if="announcement.image" :src="announcement.image" class="modal-image" />
          <div class="modal-body">
            <p class="modal-title">{{ announcement.title }}</p>
            <p v-if="announcement.body" class="modal-text" style="white-space: pre-line">{{ announcement.body }}</p>
            <div v-if="announcement.callout" class="modal-callout">
              <span class="modal-callout-stat">{{ announcement.callout.stat }}</span>
              <span class="modal-callout-label">{{ announcement.callout.label }}</span>
            </div>
            <div v-if="announcement.winPaths" class="modal-paths">
              <p class="modal-paths-title">Path To The Prize 💰</p>
              <p class="modal-paths-disclaimer">{{ announcement.pathsDisclaimer ?? 'Calculated before the Semifinals' }}</p>
              <div v-for="entry in announcement.winPaths" :key="entry.name" class="modal-path-row" :class="entry.can ? 'modal-path-row--alive' : entry.bestFinish <= 3 ? 'modal-path-row--out' : 'modal-path-row--dead'">
                <div class="modal-path-header">
                  <span class="modal-path-name">{{ entry.name }}</span>
                  <span class="modal-path-badge" :class="entry.can ? 'modal-path-badge--alive' : entry.bestFinish <= 3 ? 'modal-path-badge--podium' : 'modal-path-badge--out'">{{ entry.can ? '⚡ In It' : entry.bestFinish === 2 ? '🥈 2nd Max' : entry.bestFinish === 3 ? '🥉 3rd Max' : '🚫 No Path' }}</span>
                </div>
                <p class="modal-path-text">{{ entry.path }}</p>
                <template v-if="entry.path2">
                  <p class="modal-path-sensitivity-label">Score Sensitivity</p>
                  <p class="modal-path-text modal-path-text--2">{{ entry.path2 }}</p>
                </template>
              </div>
            </div>
            <button v-if="announcement.showPathLink && !announcement.winPaths" class="modal-bracket-btn modal-path-link-btn" @click="goToPathToPrize">
              <span class="modal-bracket-label">Path to the Prize</span>
              <ChevronRight :size="13" class="modal-bracket-arrow" />
            </button>
            <button class="modal-bracket-btn" @click="dismiss(); router.push('/bracket')">
              <GitBranch :size="14" class="modal-bracket-icon" />
              <span class="modal-bracket-label">Check out the BRACKET</span>
              <ChevronRight :size="13" class="modal-bracket-arrow" />
            </button>
            <table v-if="announcement.multipliers" class="modal-table">
              <thead>
                <tr><th>Round</th><th>Multiplier</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in announcement.multipliers" :key="row.stage">
                  <td>{{ row.stage }}</td>
                  <td class="modal-table-mul"><span class="pill" :class="row.pillClass">{{ row.multiplier }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="featuredMatches.length" class="modal-matches card">
            <MatchCard
              v-for="(m, i) in featuredMatches"
              :key="m.home + m.away"
              :match="m"
              :show-divider="i > 0"
              show-date
            />
          </div>
        </div>
        <button class="modal-btn" @click="dismiss">{{ announcement.cta ?? 'Got it' }}</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GitBranch, ChevronRight } from 'lucide-vue-next'
import { announcement } from '../data/announcement.js'
import { usePoolStore } from '../stores/pool.js'
import MatchCard from './MatchCard.vue'

const store = usePoolStore()
const route = useRoute()
const router = useRouter()
const STORAGE_KEY = `announcement_seen_${announcement.id}`
const visible = ref(false)

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

const todayMatches = computed(() =>
  store.enrichedMatches.filter(m => m.date === todayStr())
)

const featuredMatches = computed(() =>
  announcement.matchStage
    ? store.enrichedMatches.filter(m => m.stage === announcement.matchStage)
    : todayMatches.value
)

function maybeShow() {
  if (announcement.enabled && (announcement.alwaysShow || !localStorage.getItem(STORAGE_KEY))) visible.value = true
}

onMounted(maybeShow)
watch(() => route.path, maybeShow)

function closeTemporarily() {
  visible.value = false
}

async function goToPathToPrize() {
  dismiss()
  await router.push('/')
  await nextTick()
  setTimeout(() => document.getElementById('path-to-prize')?.scrollIntoView({ behavior: 'smooth' }), 80)
}

function dismiss() {
  if (!announcement.alwaysShow) localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
  fetch('/.netlify/functions/notify-dismiss', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      announcementId: announcement.id,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}×${screen.height}`,
      language: navigator.language,
    }),
  }).catch(() => {})
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8, 6, 18, 0.82);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}

.modal-card {
  width: 100%; max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  max-height: 85dvh;
  display: flex; flex-direction: column;
  box-shadow: 0 0 0 1px rgba(255,45,120,0.2), 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,45,120,0.08);
}

.modal-scroll { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #2e2060 #100c20; }

.modal-image { width: 100%; display: block; max-height: 220px; object-fit: cover; }

.modal-body { padding: 20px 18px 12px; }

.modal-title {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 14px; font-weight: 800;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 6px;
}

.modal-text { font-size: 15px; line-height: 1.6; color: var(--text); margin: 0 0 12px; }

.modal-callout {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 14px 12px; margin: 4px 0 14px;
  border-radius: 10px;
  background: rgba(255, 45, 120, 0.07);
  border: 1px solid rgba(255, 45, 120, 0.25);
}
.modal-callout-stat {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 28px; font-weight: 900;
  letter-spacing: .04em;
  background: linear-gradient(90deg, #ff2d78, #bd5fff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.modal-callout-label {
  font-size: 11px; font-weight: 600; letter-spacing: .08em;
  text-transform: uppercase; color: var(--text-dim);
}

.modal-paths { margin: 4px 0 14px; }
.modal-paths-title {
  font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: var(--text-dim); margin: 0 0 4px;
}
.modal-paths-disclaimer {
  font-size: 10px; font-weight: 600; letter-spacing: .03em;
  color: #ffd264; opacity: 0.7; margin: 0 0 8px;
}
.modal-path-row {
  padding: 8px 10px; border-radius: 8px; margin-bottom: 5px;
  border-left: 3px solid var(--border);
}
.modal-path-row--alive { border-left-color: var(--accent); }
.modal-path-row--out   { border-left-color: #00e5ff; }
.modal-path-row--dead  { border-left-color: var(--border); opacity: 0.65; }
.modal-path-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; }
.modal-path-name { font-size: 13px; font-weight: 700; color: var(--text); }
.modal-path-badge {
  font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  padding: 2px 6px; border-radius: 20px;
}
.modal-path-badge--alive  { background: rgba(255,45,120,0.15); color: var(--accent); }
.modal-path-badge--podium { background: rgba(255,210,100,0.12); color: #ffd264; }
.modal-path-badge--out    { background: rgba(255,255,255,0.06); color: var(--text-dim); }
.modal-path-text { font-size: 11px; line-height: 1.4; color: var(--text-dim); margin: 0; }
.modal-path-sensitivity-label {
  font-size: 8px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: #00e5ff; margin: 6px 0 2px; opacity: 0.8;
}
.modal-path-text--2 { font-size: 10.5px; line-height: 1.4; color: #00e5ff; margin: 0; opacity: 0.7; }

.modal-table {
  width: 100%; border-collapse: collapse;
  font-size: 13px; margin-top: 4px;
}
.modal-table th {
  text-align: left; padding: 5px 8px;
  font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--text-dim); border-bottom: 1px solid var(--border);
}
.modal-table td { padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text); }
.modal-table tr:last-child td { border-bottom: none; }
.modal-table-mul { text-align: right; }

.modal-matches { border-radius: 0; border-left: none; border-right: none; }

.modal-btn {
  display: block; width: calc(100% - 36px);
  margin: 16px 18px 18px;
  padding: 13px;
  background: var(--accent); color: var(--bg);
  border: none; border-radius: 10px;
  font-size: 15px; font-weight: 800;
  letter-spacing: .06em; text-transform: uppercase;
  cursor: pointer; flex-shrink: 0;
  transition: opacity .15s;
}
.modal-btn:active { opacity: 0.8; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-bracket-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  margin: 4px 0 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(189,95,255,0.15) 0%, rgba(13,10,30,0.9) 50%, rgba(255,45,120,0.15) 100%);
  box-shadow:
    0 0 0 1px rgba(189,95,255,0.5),
    0 0 14px rgba(189,95,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.06);
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1);
}
.modal-bracket-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.04) 50%, transparent 80%);
  background-size: 300% auto;
  animation: btn-shimmer 7s linear infinite;
  pointer-events: none;
}
@keyframes btn-shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -100% center; }
}
.modal-bracket-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255,45,120,0.55),
    0 0 14px rgba(255,45,120,0.14),
    inset 0 1px 0 rgba(255,255,255,0.08);
}
.modal-bracket-btn:active {
  transform: translateY(1px) scale(0.97);
  transition: transform 0.07s ease, box-shadow 0.07s ease;
}
.modal-bracket-label {
  background: linear-gradient(90deg, #bd5fff 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.modal-bracket-icon { color: #bd5fff; flex-shrink: 0; }
.modal-bracket-arrow { color: var(--accent); flex-shrink: 0; opacity: 0.7; }
.modal-path-link-btn {
  background: linear-gradient(135deg, rgba(255,45,120,0.15) 0%, rgba(13,10,30,0.9) 50%, rgba(189,95,255,0.15) 100%);
  box-shadow: 0 0 0 1px rgba(255,45,120,0.5), 0 0 14px rgba(255,45,120,0.1), inset 0 1px 0 rgba(255,255,255,0.06);
  margin-bottom: 8px;
}
</style>
