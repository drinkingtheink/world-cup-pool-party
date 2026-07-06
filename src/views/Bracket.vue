<template>
  <div class="bracket-page">
    <canvas ref="particleCanvas" class="bracket-particles" />
    <div ref="scrollerEl" class="bracket-scroller">
      <div class="bracket">

        <!-- LEFT R32 -->
        <div class="b-col b-col--l b-col--r32">
          <span class="b-label">Round of 32</span>
          <div class="b-slots">
            <div v-for="idx in LEFT_R32" :key="idx" class="b-slot b-slot--r32">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }" @click="goToMatch(idx)">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(idx) }">{{ isStartingSoon(idx) ? '◈ SOON · ' + matchTime(idx) : matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEFT R16 -->
        <div class="b-col b-col--l b-col--r16">
          <span class="b-label">Round of 16</span>
          <div class="b-slots">
            <div v-for="idx in LEFT_R16" :key="idx" class="b-slot b-slot--r16">
              <span v-if="matchDate(idx)" class="b-match-date">{{ matchDate(idx) }}</span>
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }" @click="goToMatch(idx)">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(idx) }">{{ isStartingSoon(idx) ? '◈ SOON · ' + matchTime(idx) : matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEFT QF -->
        <div class="b-col b-col--l b-col--qf">
          <span class="b-label">Quarterfinal</span>
          <div class="b-slots">
            <div v-for="idx in LEFT_QF" :key="idx" class="b-slot b-slot--qf">
              <span v-if="matchDate(idx)" class="b-match-date">{{ matchDate(idx) }}</span>
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }" @click="goToMatch(idx)">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(idx) }">{{ isStartingSoon(idx) ? '◈ SOON · ' + matchTime(idx) : matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEFT SF -->
        <div class="b-col b-col--l b-col--sf">
          <span class="b-label">Semifinal</span>
          <div class="b-slots">
            <div class="b-slot b-slot--sf">
              <span v-if="matchDate(101)" class="b-match-date">{{ matchDate(101) }}</span>
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
                <div v-if="!isPlayed(101)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(101) }">{{ isStartingSoon(101) ? '◈ SOON · ' + matchTime(101) : matchTime(101) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- FINAL -->
        <div class="b-col b-col--final">
          <span class="b-label">Final</span>
          <div class="b-slots">
            <div class="b-slot b-slot--sf">
              <img src="/trophy.svg" class="b-trophy" alt="" />
              <span v-if="matchDate(104)" class="b-match-date b-match-date--final">{{ matchDate(104) }}</span>
              <div ref="finalCardEl" class="b-card b-card--final" :class="{ 'b-card--played': isPlayed(104) }">
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
                <div v-if="!isPlayed(104)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(104) }">{{ isStartingSoon(104) ? '◈ SOON · ' + matchTime(104) : matchTime(104) }}</div>
              </div>
              <div v-if="daysUntilFinal" class="b-days-until">
                <span class="b-days-until__num">{{ daysUntilFinal }}</span>
                <span class="b-days-until__label">days until</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT SF -->
        <div class="b-col b-col--r b-col--sf">
          <span class="b-label">Semifinal</span>
          <div class="b-slots">
            <div class="b-slot b-slot--sf">
              <span v-if="matchDate(102)" class="b-match-date">{{ matchDate(102) }}</span>
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
                <div v-if="!isPlayed(102)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(102) }">{{ isStartingSoon(102) ? '◈ SOON · ' + matchTime(102) : matchTime(102) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT QF -->
        <div class="b-col b-col--r b-col--qf">
          <span class="b-label">Quarterfinal</span>
          <div class="b-slots">
            <div v-for="idx in RIGHT_QF" :key="idx" class="b-slot b-slot--qf">
              <span v-if="matchDate(idx)" class="b-match-date">{{ matchDate(idx) }}</span>
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }" @click="goToMatch(idx)">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(idx) }">{{ isStartingSoon(idx) ? '◈ SOON · ' + matchTime(idx) : matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT R16 -->
        <div class="b-col b-col--r b-col--r16">
          <span class="b-label">Round of 16</span>
          <div class="b-slots">
            <div v-for="idx in RIGHT_R16" :key="idx" class="b-slot b-slot--r16">
              <span v-if="matchDate(idx)" class="b-match-date">{{ matchDate(idx) }}</span>
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }" @click="goToMatch(idx)">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(idx) }">{{ isStartingSoon(idx) ? '◈ SOON · ' + matchTime(idx) : matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT R32 -->
        <div class="b-col b-col--r b-col--r32">
          <span class="b-label">Round of 32</span>
          <div class="b-slots">
            <div v-for="idx in RIGHT_R32" :key="idx" class="b-slot b-slot--r32">
              <div class="b-card" :class="{ 'b-card--played': isPlayed(idx) }" @click="goToMatch(idx)">
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'home') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(home(idx)) }}</span>
                    <span class="b-name">{{ home(idx) }}</span>
                    <span class="b-score">{{ score(idx,'home') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'home').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'home')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div class="b-team" :class="{ 'b-team--win': isWinner(idx,'away') }">
                  <div class="b-team-main">
                    <span class="b-flag">{{ flagOf(away(idx)) }}</span>
                    <span class="b-name">{{ away(idx) }}</span>
                    <span class="b-score">{{ score(idx,'away') }}</span>
                  </div>
                  <div v-if="poolPlayers(idx,'away').length" class="b-players">
                    <span v-for="p in poolPlayers(idx,'away')" :key="p" class="b-player" @click.stop="goToPlayer(p)">{{ p }}</span>
                  </div>
                </div>
                <div v-if="!isPlayed(idx)" class="b-time" :class="{ 'b-time--soon': isStartingSoon(idx) }">{{ isStartingSoon(idx) ? '◈ SOON · ' + matchTime(idx) : matchTime(idx) }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePoolStore } from '../stores/pool.js'
import { FLAG_MAP } from '../data/index.js'
import { matchSlug } from '../utils.js'

const router = useRouter()
const store = usePoolStore()

function goToPlayer(name) { router.push({ path: '/my-teams', query: { player: name } }) }

function goToMatch(idx) {
  const m = matchByNum.value[idx]
  if (!m) return
  router.push({ path: '/matches', hash: `#${matchSlug(m)}` })
}

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
function isStartingSoon(idx) { return matchByNum.value[idx]?.startingSoon ?? false }
const daysUntilFinal = computed(() => {
  const d = matchByNum.value[104]?.date
  if (!d) return null
  const finalMs = new Date(d + 'T12:00:00').getTime()
  const todayMs = new Date(new Date().toDateString()).getTime()
  const days = Math.round((finalMs - todayMs) / 86400000)
  return days > 0 ? days : null
})

function matchDate(idx) {
  const d = matchByNum.value[idx]?.date
  if (!d) return ''
  const [, m, day] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+m - 1]} ${+day}`
}
function flagOf(team) {
  if (!team || team === 'TBD') return '🏳️'
  return FLAG_MAP[team] ?? ''
}
function poolPlayers(idx, side) {
  const team = side === 'home' ? home(idx) : away(idx)
  if (!team || team === 'TBD') return []
  return teamToPlayers.value[team] ?? []
}

// ── Particle system ───────────────────────────────────────────────
const particleCanvas = ref(null)
const finalCardEl    = ref(null)
const scrollerEl     = ref(null)

// Weighted toward pink/magenta — cyan and white are rare accents
const SPARK_COLORS = [
  '#ff2d78','#ff2d78','#ff2d78',
  '#ff71ce','#ff71ce',
  '#bd5fff',
  '#00e5ff',
]

let _particles = []
let _animId    = null

function _spawn(cx, cy) {
  // Upper hemisphere with some sideways spread
  const angle = Math.PI * 0.75 + Math.random() * Math.PI * 1.5  // ~135°–315°, biased up
  const speed = 0.4 + Math.random() * 2.2
  _particles.push({
    x:     cx + (Math.random() - 0.5) * 70,
    y:     cy + (Math.random() - 0.5) * 40,
    vx:    Math.cos(angle) * speed,
    vy:    Math.sin(angle) * speed,
    life:  0,
    peak:  0.55 + Math.random() * 0.35,
    decay: 0.0018 + Math.random() * 0.0025,
    color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
    size:  0.8 + Math.random() * 1.8,
    phase: Math.random() * Math.PI * 2,
    freq:  0.02 + Math.random() * 0.025,
    rising: true,
  })
}

function _tick() {
  _animId = requestAnimationFrame(_tick)

  const canvas = particleCanvas.value
  const fc     = finalCardEl.value
  if (!canvas) return

  const page = canvas.parentElement
  if (canvas.width !== page.offsetWidth || canvas.height !== page.offsetHeight) {
    canvas.width  = page.offsetWidth
    canvas.height = page.offsetHeight
  }

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (fc && _particles.length < 160) {
    const pr = page.getBoundingClientRect()
    const cr = fc.getBoundingClientRect()
    const cx = cr.left - pr.left + cr.width  / 2
    const cy = cr.top  - pr.top  + cr.height / 2
    const count = Math.random() < 0.45 ? 2 : 1
    for (let i = 0; i < count; i++) _spawn(cx, cy)
  }

  for (let i = _particles.length - 1; i >= 0; i--) {
    const p = _particles[i]

    // Gentle sine drift
    p.phase += p.freq
    p.vx    += Math.sin(p.phase) * 0.012
    p.vy    += 0.006   // very light gravity
    p.x     += p.vx
    p.y     += p.vy

    // Fade in to peak, then decay
    if (p.rising) {
      p.life += 0.04
      if (p.life >= p.peak) p.rising = false
    } else {
      p.life -= p.decay
    }
    if (p.life <= 0) { _particles.splice(i, 1); continue }

    const alpha = p.life
    const size  = p.size * (0.5 + 0.5 * p.life)

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.shadowColor = p.color
    ctx.shadowBlur  = 10
    ctx.fillStyle   = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

onMounted(() => {
  _tick()
  // Wait for layout before measuring scroll dimensions
  nextTick(() => {
    if (scrollerEl.value) {
      const s = scrollerEl.value
      s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2
    }
  })
})
onUnmounted(() => { cancelAnimationFrame(_animId); _particles = [] })

// ─────────────────────────────────────────────────────────────────
const LEFT_R32 = [73, 76, 75, 78, 83, 84, 81, 82]
const LEFT_R16 = [89, 90, 93, 94]
const LEFT_QF  = [97, 98]

const RIGHT_QF  = [99, 100]
const RIGHT_R16 = [91, 92, 95, 96]
const RIGHT_R32 = [74, 77, 79, 80, 86, 87, 85, 88]
</script>

<style scoped>
.bracket-page {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bracket-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bracket-scroller {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding: 24px 20px 32px;
  scrollbar-width: thin;
  scrollbar-color: #2e2060 #100c20;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: flex-start;
  justify-content: safe center;
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
  z-index: 1;
}
.b-slot:hover { z-index: 20; }

.b-slot--r32 { height: 96px; }
.b-slot--r16 { height: 192px; }
.b-slot--qf  { height: 384px; }
.b-slot--sf  { height: 768px; }

/* Left side connectors → right */
.b-col--l .b-slot:nth-child(odd)::after {
  content: '';
  position: absolute;
  right: -20px; top: 50%;
  width: 20px; height: 50%;
  border-top: 1px solid rgba(0,229,255,0.25);
  border-right: 1px solid rgba(0,229,255,0.25);
  pointer-events: none;
}
.b-col--l .b-slot:nth-child(even)::after {
  content: '';
  position: absolute;
  right: -20px; top: 0;
  width: 20px; height: 50%;
  border-bottom: 1px solid rgba(0,229,255,0.25);
  border-right: 1px solid rgba(0,229,255,0.25);
  pointer-events: none;
}
.b-col--l.b-col--sf .b-slot::after {
  content: '';
  position: absolute;
  right: -20px; top: 50%;
  width: 20px; height: 0;
  border-top: 1px solid rgba(0,229,255,0.25);
  border-right: none;
  pointer-events: none;
}

/* Right side connectors → left */
.b-col--r .b-slot:nth-child(odd)::after {
  content: '';
  position: absolute;
  left: -20px; top: 50%;
  width: 20px; height: 50%;
  border-top: 1px solid rgba(0,229,255,0.25);
  border-left: 1px solid rgba(0,229,255,0.25);
  pointer-events: none;
}
.b-col--r .b-slot:nth-child(even)::after {
  content: '';
  position: absolute;
  left: -20px; top: 0;
  width: 20px; height: 50%;
  border-bottom: 1px solid rgba(0,229,255,0.25);
  border-left: 1px solid rgba(0,229,255,0.25);
  pointer-events: none;
}
.b-col--r.b-col--sf .b-slot::after {
  content: '';
  position: absolute;
  left: -20px; top: 50%;
  width: 20px; height: 0;
  border-top: 1px solid rgba(0,229,255,0.25);
  border-left: none;
  pointer-events: none;
}

.b-col--l .b-slot:nth-child(odd)::after,
.b-col--l .b-slot:nth-child(even)::after,
.b-col--l.b-col--sf .b-slot::after,
.b-col--r .b-slot:nth-child(odd)::after,
.b-col--r .b-slot:nth-child(even)::after,
.b-col--r.b-col--sf .b-slot::after {
  filter: drop-shadow(0 0 3px rgba(0,229,255,0.4));
}

/* Match card */
.b-card {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s;
}

/* Vaporwave heat gradient — cool outer → hot center */
.b-col--r32  .b-card { background: linear-gradient(160deg, #04091e 0%, #090f35 100%); border-color: #0e1e55; }
.b-col--r16  .b-card { background: linear-gradient(160deg, #0c0530 0%, #1e0858 100%); border-color: #2a0e6a; }
.b-col--qf   .b-card { background: linear-gradient(160deg, #1a0538 0%, #3c0870 100%); border-color: #500d88; }
.b-col--sf   .b-card { background: linear-gradient(160deg, #2d0440 0%, #680878 100%); border-color: #7a0ea0; }
.b-col--final .b-card { background: linear-gradient(160deg, #480548 0%, #a0086a 100%); }

.b-slot:hover .b-card {
  border-color: rgba(189,95,255,0.6);
  box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 0 12px rgba(189,95,255,0.2);
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
  cursor: pointer;
}
.b-player:hover { text-decoration: underline; }
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
.b-time--soon {
  color: #f5a300; opacity: 1;
  animation: live-pulse 1.5s ease-in-out infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}

/* Trophy */
.b-trophy {
  position: absolute;
  left: 50%;
  bottom: calc(50% + 58px);
  transform: translateX(-50%);
  width: 38px;
  pointer-events: none;
  z-index: 3;
  animation:
    trophy-float 3.2s ease-in-out infinite,
    trophy-shine 3.6s ease-in-out infinite;
}
@keyframes trophy-float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-10px); }
}
@keyframes trophy-shine {
  0%, 100% {
    filter:
      brightness(1.05)
      saturate(1.2)
      drop-shadow(0 0 4px rgba(247, 215, 88, 0.7))
      drop-shadow(0 0 14px rgba(250, 160, 40, 0.4));
  }
  50% {
    filter:
      brightness(1.3)
      saturate(1.5)
      drop-shadow(0 0 6px rgba(255, 248, 180, 0.9))
      drop-shadow(0 0 20px rgba(247, 215, 88, 0.8))
      drop-shadow(0 0 38px rgba(250, 183, 56, 0.45));
  }
}

/* Days-until-Final counter */
.b-days-until {
  position: absolute;
  top: calc(50% + 68px);
  left: 0; right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  pointer-events: none;
  z-index: 2;
}
.b-days-until__num {
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  background: linear-gradient(160deg, #fdfbd4 0%, #f7d75c 40%, #f39f2d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 6px rgba(247, 215, 88, 0.6));
}
.b-days-until__label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-dim);
  opacity: 0.6;
}

/* Match date label */
.b-match-date {
  position: absolute;
  top: 5px; left: 0; right: 0;
  text-align: center;
  font-size: 8px; font-weight: 700; letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--text-dim);
  opacity: 0.5;
  pointer-events: none;
  z-index: 2;
}
.b-match-date--final {
  color: var(--accent);
  opacity: 0.8;
}

/* Mobile compact */
@media (max-width: 767px) {
  .bracket-scroller { padding: 16px 12px 24px; }
  .bracket          { gap: 14px; }
  .b-col            { width: 108px; }
  .b-slot--r32      { height: 96px; }
  .b-slot--r16      { height: 192px; }
  .b-slot--qf       { height: 384px; }
  .b-slot--sf       { height: 768px; }
  .b-col--l .b-slot:nth-child(odd)::after,
  .b-col--l .b-slot:nth-child(even)::after { right: -14px; width: 14px; }
  .b-col--l.b-col--sf .b-slot::after       { right: -14px; width: 14px; }
  .b-col--r .b-slot:nth-child(odd)::after,
  .b-col--r .b-slot:nth-child(even)::after { left: -14px; width: 14px; }
  .b-col--r.b-col--sf .b-slot::after       { left: -14px; width: 14px; }
  .b-team-main { padding: 5px 5px; font-size: 10px; gap: 4px; }
  .b-flag      { font-size: 11px; }
  .b-score     { font-size: 11px; }
  .b-players   { padding: 0 5px 4px; gap: 2px; }
  .b-player    { font-size: 8px; padding: 1px 3px; }
  .b-label     { font-size: 8px; margin-bottom: 6px; }
}
</style>
