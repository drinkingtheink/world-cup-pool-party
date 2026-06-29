<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-backdrop" @click.self="dismiss">
      <div class="modal-card">
        <div class="modal-scroll">
          <img v-if="announcement.image" :src="announcement.image" class="modal-image" />
          <div class="modal-body">
            <p class="modal-title">{{ announcement.title }}</p>
            <p v-if="announcement.body" class="modal-text" style="white-space: pre-line">{{ announcement.body }}</p>
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
          <div v-if="todayMatches.length" class="modal-matches card">
            <MatchCard
              v-for="(m, i) in todayMatches"
              :key="m.home + m.away"
              :match="m"
              :show-divider="i > 0"
            />
          </div>
        </div>
        <button class="modal-btn" @click="dismiss">Please don't tickle me, Gianni.</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { announcement } from '../data/announcement.js'
import { usePoolStore } from '../stores/pool.js'
import MatchCard from './MatchCard.vue'

const store = usePoolStore()
const route = useRoute()
const STORAGE_KEY = `announcement_seen_${announcement.id}`
const visible = ref(false)

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

const todayMatches = computed(() =>
  store.enrichedMatches.filter(m => m.date === todayStr())
)

function maybeShow() {
  if (announcement.enabled && !localStorage.getItem(STORAGE_KEY)) visible.value = true
}

onMounted(maybeShow)
watch(() => route.path, maybeShow)

function dismiss() {
  localStorage.setItem(STORAGE_KEY, '1')
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
</style>
