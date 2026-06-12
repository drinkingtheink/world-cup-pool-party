<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-backdrop" @click.self="dismiss">
      <div class="modal-card">
        <img v-if="announcement.image" :src="announcement.image" class="modal-image" />
        <div class="modal-body">
          <p class="modal-title">{{ announcement.title }}</p>
          <p class="modal-text">{{ announcement.body }}</p>
        </div>
        <button class="modal-btn" @click="dismiss">Got it</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { announcement } from '../data/announcement.js'

const STORAGE_KEY = `announcement_seen_${announcement.id}`
const visible = ref(false)

onMounted(() => {
  if (announcement.enabled && !sessionStorage.getItem(STORAGE_KEY)) visible.value = true
})

function dismiss() {
  sessionStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
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
  width: 100%; max-width: 400px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255,45,120,0.2), 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,45,120,0.08);
}

.modal-image {
  width: 100%; display: block;
  max-height: 220px; object-fit: cover;
}

.modal-body {
  padding: 24px 22px 8px;
}

.modal-title {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 15px; font-weight: 800;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
}

.modal-text {
  font-size: 16px; line-height: 1.6;
  color: var(--text); margin: 0;
}

.modal-btn {
  display: block; width: calc(100% - 44px);
  margin: 20px 22px 22px;
  padding: 13px;
  background: var(--accent); color: var(--bg);
  border: none; border-radius: 10px;
  font-size: 15px; font-weight: 800;
  letter-spacing: .06em; text-transform: uppercase;
  cursor: pointer;
  transition: opacity .15s;
}
.modal-btn:active { opacity: 0.8; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
