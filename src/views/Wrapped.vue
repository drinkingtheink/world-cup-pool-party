<template>
  <div class="wr-root">

    <!-- ── GATE ─────────────────────────────────────────────── -->
    <div v-if="!tournamentComplete" class="wr-gate">
      <span class="gate-lock">🔒</span>
      <p class="gate-title">Coming Soon</p>
      <p class="gate-sub">Wrapped unlocks when the Final whistle blows.</p>
    </div>

    <!-- ── PLAYER PICKER ─────────────────────────────────────── -->
    <div v-else-if="!activePlayer" class="wr-picker">
      <div class="picker-header">
        <p class="picker-year">2026</p>
        <p class="picker-word">Wrapped</p>
        <p class="picker-sub">Your World Cup Pool Story</p>
      </div>
      <div class="picker-grid">
        <button
          v-for="(entry, i) in store.leaderboard"
          :key="entry.name"
          class="picker-btn"
          :style="{ '--c': playerColor[entry.name], '--i': i }"
          @click="selectPlayer(entry.name)"
        >
          <span class="pb-rank" :class="rankClass(entry.rank)">{{ entry.rank }}</span>
          <span class="pb-name">{{ entry.name }}</span>
          <span class="pb-pts">{{ fmt(entry.total) }} pts</span>
          <span class="pb-arrow">→</span>
        </button>
      </div>
    </div>

    <!-- ── SLIDESHOW ─────────────────────────────────────────── -->
    <div v-else class="wr-show" :style="{ '--c': playerColor[activePlayer] }" @touchstart="onTouchStart" @touchend="onTouchEnd">

      <!-- Vaporwave scene -->
      <div class="vw-scene">
        <div class="vw-sky">
          <div class="vw-stars"></div>
          <div class="vw-shoot"></div>
        </div>
        <div class="vw-mountains"></div>
        <div class="vw-sun-wrap">
          <svg class="vw-sun" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vwsg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#ff9de2"/>
                <stop offset="42%"  stop-color="#ff2d78"/>
                <stop offset="100%" stop-color="#ffb800"/>
              </linearGradient>
              <clipPath id="vwsc"><rect x="0" y="0" width="200" height="100"/></clipPath>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#vwsg)" clip-path="url(#vwsc)"/>
            <rect x="0" y="46" width="200" height="3.5" fill="#080612"/>
            <rect x="0" y="55" width="200" height="4.5" fill="#080612"/>
            <rect x="0" y="65" width="200" height="6"   fill="#080612"/>
            <rect x="0" y="76" width="200" height="7.5" fill="#080612"/>
            <rect x="0" y="88" width="200" height="9.5" fill="#080612"/>
          </svg>
        </div>
        <div class="vw-horizon-line"></div>
        <div class="vw-grid-wrap">
          <div class="vw-grid"></div>
        </div>
        <div class="vw-float vw-f1"></div>
        <div class="vw-float vw-f2"></div>
        <div class="vw-float vw-f3"></div>
        <div class="vw-float vw-f4"></div>
        <div class="vw-float vw-f5"></div>
        <div class="vw-float vw-f6"></div>
        <div class="vw-sweep"></div>
        <div class="vw-scanlines"></div>
        <div class="vw-crt"></div>
      </div>

      <!-- Progress pips -->
      <div class="wr-progress">
        <div
          v-for="i in SLIDE_COUNT"
          :key="i"
          class="wr-pip"
          :class="{ 'wr-pip--done': i - 1 < currentSlide, 'wr-pip--active': i - 1 === currentSlide }"
        ></div>
      </div>

      <!-- Persistent player name -->
      <div class="wr-player-name">{{ activePlayer }}</div>

      <!-- Exit -->
      <button class="wr-exit-btn" @click="exitPlayer">✕</button>

      <!-- Slides -->
      <transition :name="slideDir > 0 ? 'wr-fwd' : 'wr-back'" mode="out-in">
        <div :key="currentSlide" class="wr-slide" :class="{ 'wr-slide--scroll': currentSlide === 1 }" :style="{ '--c': playerColor[activePlayer] }">

          <!-- 0 · Cover -->
          <div v-if="currentSlide === 0" class="slide slide-cover">
            <p class="sc-year">2026</p>
            <p class="sc-word">Wrapped</p>
            <p class="sc-tagline">Your World Cup Pool Story</p>
            <div class="sc-flags">
              <span v-for="t in pd.teams" :key="t" class="sc-flag">{{ FLAG_MAP[t] ?? '🏳' }}</span>
            </div>
          </div>

          <!-- 1 · Teams -->
          <div v-else-if="currentSlide === 1" class="slide slide-squad">
            <p class="sl-label">Your Teams</p>
            <div class="squad-list">
              <div v-for="t in pd.teamsByPoints" :key="t" class="squad-team">
                <div class="squad-team-header">
                  <span class="squad-flag">{{ FLAG_MAP[t] ?? '🏳' }}</span>
                  <span class="squad-name">{{ t }}</span>
                  <span class="squad-total">{{ fmt(pd.breakdown[t] ?? 0) }} pts</span>
                </div>
                <div class="squad-matches">
                  <div v-for="bd in pd.teamBreakdowns[t]" :key="bd.date+bd.opponent" class="squad-match-row">
                    <span class="squad-wld" :class="`squad-wld--${wld(bd.items)}`">{{ wld(bd.items) }}</span>
                    <span class="squad-bd-date">{{ fmtDate(bd.date) }}</span>
                    <span class="squad-opp">vs {{ bd.opponent }}</span>
                    <span class="squad-score">{{ bd.scoreStr }}</span>
                    <span class="squad-chips">
                      <span v-for="chip in bd.items" :key="chip.key" class="squad-chip" :class="`squad-chip--${chip.key.replace(/\d/g,'n')}`">{{ chip.key }} +{{ chip.pts }}</span>
                      <span v-if="bd.mul > 1" class="squad-mul">×{{ bd.mul }}</span>
                    </span>
                    <span class="squad-match-pts">+{{ fmt(bd.total) }}</span>
                  </div>
                  <div v-if="!pd.teamBreakdowns[t]?.length" class="squad-no-matches">No matches played</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2 · Star Team -->
          <div v-else-if="currentSlide === 2" class="slide slide-star">
            <p class="sl-label">Your Star</p>
            <p class="sl-context">Highest-scoring team</p>
            <div class="star-flag">{{ FLAG_MAP[pd.bestTeam.team] ?? '🏳' }}</div>
            <p class="star-name">{{ pd.bestTeam.team }}</p>
            <p class="star-pts">{{ fmt(pd.bestTeam.pts) }}<span class="star-pts-u"> pts</span></p>
            <span class="pill" :class="`pill-t${store.tierMap[pd.bestTeam.team] ?? 4}`">Tier {{ store.tierMap[pd.bestTeam.team] ?? '?' }}</span>
            <p class="slide-pool-rank">{{ ordinal(pd.bestTeamRank) }} of {{ pd.totalPoolTeams }} teams in the pool</p>
          </div>

          <!-- 3 · Best Day -->
          <div v-else-if="currentSlide === 3" class="slide slide-bestday">
            <p class="sl-label">Best Day</p>
            <p class="sl-context">Your biggest single match day</p>
            <p class="bd-num">+{{ fmt(pd.bestDay.pts) }}</p>
            <p class="bd-date">{{ fmtDate(pd.bestDay.date) }}</p>
            <p class="slide-pool-rank">{{ ordinal(pd.bestDayRank) }} best single day in the pool</p>
            <div v-if="pd.topDays.length > 1" class="bd-top3">
              <span v-for="(d, i) in pd.topDays" :key="d.date" class="bd-day-chip" :class="`bd-chip--${i}`">
                <span class="bd-chip-date">{{ fmtDate(d.date) }}</span>
                <span class="bd-chip-pts">+{{ fmt(d.pts) }}</span>
              </span>
            </div>
          </div>

          <!-- 4 · Goals -->
          <div v-else-if="currentSlide === 4" class="slide slide-goals">
            <p class="sl-label">Goals</p>
            <p class="goals-num">{{ pd.totalGoals }}</p>
            <p class="goals-sub">goals by your teams</p>
            <p class="slide-pool-rank">{{ ordinal(pd.goalsRank) }} in the pool by goals scored</p>
            <div class="goals-row">
              <div class="gr-item">
                <span class="gr-val">{{ pd.gamesPlayed }}</span>
                <span class="gr-label">Matches</span>
              </div>
              <div class="gr-item">
                <span class="gr-val">{{ pd.gpg }}</span>
                <span class="gr-label">Per Game</span>
              </div>
              <div class="gr-item">
                <span class="gr-val">{{ pd.lateGoals }}</span>
                <span class="gr-label">After 80'</span>
              </div>
            </div>
          </div>

          <!-- 5 · Achievements -->
          <div v-else-if="currentSlide === 5" class="slide slide-badges">
            <p class="sl-label">Achievements</p>
            <p class="sl-context">{{ pd.badges.length }} badge{{ pd.badges.length !== 1 ? 's' : '' }} earned</p>
            <div v-if="pd.badges.length" class="badges-scroll">
              <div class="badges-grid">
                <div v-for="b in pd.badges" :key="b.key" class="badge-chip">
                  <span class="badge-icon">{{ b.icon }}</span>
                  <span class="badge-name">{{ b.name }}</span>
                </div>
              </div>
            </div>
            <p v-else class="badge-none">No badges yet</p>
          </div>

          <!-- 6 · Pool Record -->
          <div v-else-if="currentSlide === 6" class="slide slide-record">
            <p class="sl-label">Pool Battles</p>
            <p class="sl-context">Head-to-head matchups vs other players</p>
            <div class="record-row">
              <div class="rr-item">
                <span class="rr-num rr-w">{{ pd.poolW }}</span>
                <span class="rr-label">Wins</span>
              </div>
              <span class="rr-sep">—</span>
              <div class="rr-item">
                <span class="rr-num rr-l">{{ pd.poolL }}</span>
                <span class="rr-label">Losses</span>
              </div>
            </div>
            <p class="record-blurb">{{ poolBlurb(pd) }}</p>
          </div>

          <!-- 7 · Points Over Time -->
          <div v-else-if="currentSlide === 7" class="slide slide-pot">
            <p class="sl-label">Points Over Time</p>
            <p class="sl-context">Your journey vs the pool</p>
            <div class="pot-chart-wrap" v-if="wrChartGeom">
              <svg :viewBox="`0 0 ${wrChartGeom.W} ${wrChartGeom.H}`" class="pot-svg" preserveAspectRatio="none">
                <line v-for="frac in [0.25, 0.5, 0.75, 1]" :key="frac"
                  x1="0" :x2="wrChartGeom.W"
                  :y1="wrChartGeom.H - 8 - frac * (wrChartGeom.H - 16)"
                  :y2="wrChartGeom.H - 8 - frac * (wrChartGeom.H - 16)"
                  stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
                <polyline
                  v-for="p in store.players.filter(p => p.name !== activePlayer)"
                  :key="p.name"
                  :points="wrChartGeom.lines[p.name]"
                  fill="none" :stroke="playerColor[p.name]"
                  stroke-width="1.2" opacity="0.2"/>
                <polyline
                  :points="wrChartGeom.lines[activePlayer]"
                  fill="none" :stroke="playerColor[activePlayer]"
                  stroke-width="3" opacity="1"
                  style="filter: drop-shadow(0 0 4px var(--c))"/>
                <circle
                  v-if="wrChartGeom.endPts.find(x => x.name === activePlayer)"
                  :cx="wrChartGeom.endPts.find(x => x.name === activePlayer).x"
                  :cy="wrChartGeom.endPts.find(x => x.name === activePlayer).y"
                  r="5" :fill="playerColor[activePlayer]"
                  style="filter: drop-shadow(0 0 6px var(--c))"/>
              </svg>
              <div class="pot-axis-row">
                <span class="pot-axis-label">Start</span>
                <span class="pot-axis-label">End · {{ fmt(pd.total) }} pts</span>
              </div>
            </div>
            <div class="pot-mini-legend">
              <div
                v-for="e in store.leaderboard" :key="e.name"
                class="pml-item" :class="{ 'pml-active': e.name === activePlayer }"
              >
                <span class="pml-dot" :style="{ background: playerColor[e.name] }"></span>
                <span class="pml-name">{{ e.name }}</span>
                <span class="pml-pts">{{ fmt(e.total) }}</span>
              </div>
            </div>
          </div>

          <!-- 8 · Leaderboard Journey -->
          <div v-else-if="currentSlide === 8" class="slide slide-journey">
            <p class="sl-label">Your Journey</p>
            <p class="sl-context">Leaderboard rank through the tournament</p>
            <div v-if="rankChartGeom" class="journey-chart-wrap">
              <svg :viewBox="`0 0 ${rankChartGeom.W} ${rankChartGeom.H}`" class="journey-svg" preserveAspectRatio="none">
                <line v-for="g in rankChartGeom.gridLines" :key="g.rank"
                  :x1="rankChartGeom.LEFT" :x2="rankChartGeom.W" :y1="g.y" :y2="g.y"
                  :stroke="g.rank === 1 ? 'rgba(255,210,0,0.25)' : 'rgba(255,255,255,0.06)'" stroke-width="1"/>
                <text v-for="g in rankChartGeom.gridLines" :key="`l${g.rank}`"
                  x="2" :y="g.y" font-size="8" font-family="monospace" dominant-baseline="middle"
                  :fill="g.rank === 1 ? '#ffd200' : 'rgba(255,255,255,0.3)'">#{{ g.rank }}</text>
                <polyline :points="rankChartGeom.pts" fill="none" :stroke="playerColor[activePlayer]"
                  stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"
                  style="filter: drop-shadow(0 0 4px var(--c))"/>
                <circle :cx="rankChartGeom.startPt.x" :cy="rankChartGeom.startPt.y"
                  r="3.5" fill="#080612" :stroke="playerColor[activePlayer]" stroke-width="1.5"/>
                <circle :cx="rankChartGeom.endPt.x" :cy="rankChartGeom.endPt.y"
                  r="5" :fill="playerColor[activePlayer]" style="filter: drop-shadow(0 0 6px var(--c))"/>
              </svg>
            </div>
            <div v-if="rankTimeline" class="journey-stats">
              <div class="js-item">
                <span class="js-num">{{ ordinal(Math.min(...rankTimeline.map(p => p.rank))) }}</span>
                <span class="js-lbl">Peak Rank</span>
              </div>
              <div class="js-item">
                <span class="js-num">{{ rankTimeline.filter(p => p.rank === 1).length || '—' }}</span>
                <span class="js-lbl">Days Led</span>
              </div>
              <div class="js-item" :class="rankTimeline[0].rank > rankTimeline.at(-1).rank ? 'js-up' : rankTimeline[0].rank < rankTimeline.at(-1).rank ? 'js-down' : ''">
                <span class="js-num">{{ rankTimeline[0].rank === rankTimeline.at(-1).rank ? '—' : (rankTimeline[0].rank > rankTimeline.at(-1).rank ? '↑' : '↓') + Math.abs(rankTimeline[0].rank - rankTimeline.at(-1).rank) }}</span>
                <span class="js-lbl">Net Positions</span>
              </div>
            </div>
            <p v-if="rankTimeline" class="slide-pool-rank">Started {{ ordinal(rankTimeline[0].rank) }} · Finished {{ ordinal(rankTimeline.at(-1).rank) }}</p>
          </div>

          <!-- 9 · Final -->
          <div v-else-if="currentSlide === 9" class="slide slide-final">
            <p class="sl-label">Final Standing</p>
            <div class="final-circle" :class="rankClass(pd.rank)">{{ pd.rank }}</div>
            <p class="final-name">{{ activePlayer }}</p>
            <p class="final-pts">{{ fmt(pd.total) }}<span class="final-pts-u"> pts</span></p>
            <p class="final-blurb">{{ finalBlurb(pd) }}</p>
            <p class="final-bye">⚽ See you at the next one</p>
          </div>

        </div>
      </transition>

      <!-- Prev / Next -->
      <button v-if="currentSlide > 0" class="wr-prev" @click="prev">‹</button>
      <button class="wr-next" @click="next">
        {{ currentSlide === SLIDE_COUNT - 1 ? '✓ Done' : '›' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoolStore } from '../stores/pool.js'
import { FLAG_MAP, ELIMINATED_TEAMS } from '../data/index.js'
import { matchPointsForTeam, matchBreakdownForTeam } from '../services/points.js'

const store      = usePoolStore()
const route      = useRoute()
const router     = useRouter()
const SLIDE_COUNT = 10

const KNOCKOUT_STAGES = new Set(['Round of 32','Round of 16','Quarterfinal','Semifinal','Third Place','Final'])
const EURO_TEAMS = new Set(['England','Germany','Norway','Scotland','France','Netherlands','Croatia',
  'Switzerland','Spain','Sweden','Czechia','Bosnia & Herzegovina','Portugal','Belgium','Austria','Türkiye'])

// ── Gate ─────────────────────────────────────────────────────────────
const tournamentComplete = computed(() =>
  store.enrichedMatches.some(m => m.stage === 'Final' && m.played && !m.snapshot_minute)
)

// ── Player colors ─────────────────────────────────────────────────────
const CHART_COLORS = ['#ff2d78','#00e5ff','#00ff9f','#bd5fff','#ffd200','#ff8c00','#5b8def','#ff5d8f']
const playerColor = computed(() => {
  const map = {}
  store.players.forEach((p, i) => { map[p.name] = CHART_COLORS[i % CHART_COLORS.length] })
  return map
})

// ── Navigation ────────────────────────────────────────────────────────
const activePlayer = ref(null)
const currentSlide = ref(0)
const slideDir     = ref(1)
let   touchStartX  = 0

function selectPlayer(name) {
  activePlayer.value = name
  currentSlide.value = 0
  router.replace({ query: { player: name } })
}
function exitPlayer() {
  activePlayer.value = null
  currentSlide.value = 0
  router.replace({ query: {} })
}

onMounted(() => {
  const qp = route.query.player
  if (qp && store.players.some(p => p.name === qp)) selectPlayer(qp)
})

function prev() {
  if (currentSlide.value === 0) return
  slideDir.value = -1; currentSlide.value--
}
function next() {
  if (currentSlide.value === SLIDE_COUNT - 1) { exitPlayer(); return }
  slideDir.value = 1; currentSlide.value++
}
function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 50) return
  if (dx < 0) next(); else prev()
}

// ── Points by day for ALL players ────────────────────────────────────
const allPlayerDays = computed(() => {
  const result = {}
  store.players.forEach(p => {
    const ts = new Set([p.team1,p.team2,p.team3,p.team4,p.team5,p.team6].filter(Boolean))
    const byDate = {}
    store.enrichedMatches.forEach(m => {
      if (!m.played || m.snapshot_minute) return
      if (!ts.has(m.home) && !ts.has(m.away)) return
      byDate[m.date] = byDate[m.date] ?? 0
      if (ts.has(m.home)) byDate[m.date] += matchPointsForTeam(m.home, m)
      if (ts.has(m.away)) byDate[m.date] += matchPointsForTeam(m.away, m)
    })
    result[p.name] = Object.entries(byDate)
      .map(([date, pts]) => ({ date, pts: Math.round(pts * 10) / 10 }))
      .sort((a, b) => a.date.localeCompare(b.date))
  })
  return result
})

// ── Pool-wide rankings ────────────────────────────────────────────────
const allTeamRankings = computed(() => {
  const seen = new Set()
  return store.leaderboard
    .flatMap(e => Object.entries(e.breakdown).map(([team, pts]) => ({ team, pts })))
    .filter(x => { if (seen.has(x.team)) return false; seen.add(x.team); return true })
    .sort((a, b) => b.pts - a.pts)
})

const allBestDayRankings = computed(() =>
  store.players
    .map(p => ({ name: p.name, pts: Math.max(0, ...(allPlayerDays.value[p.name] ?? []).map(d => d.pts)) }))
    .sort((a, b) => b.pts - a.pts)
)

const allGoalsRankings = computed(() =>
  store.players.map(p => {
    const ts = new Set([p.team1,p.team2,p.team3,p.team4,p.team5,p.team6].filter(Boolean))
    let g = 0
    store.enrichedMatches.forEach(m => {
      if (!m.played || m.snapshot_minute) return
      ;(m.goals ?? []).forEach(goal => {
        if (ts.has(goal.team === 'home' ? m.home : m.away)) g++
      })
    })
    return { name: p.name, goals: g }
  }).sort((a, b) => b.goals - a.goals)
)

// ── Points over time chart ────────────────────────────────────────────
const pointsOverTime = computed(() => {
  const dates = [...new Set(
    store.enrichedMatches.filter(m => m.played && !m.snapshot_minute).map(m => m.date)
  )].sort()
  if (dates.length < 2) return null
  const series = {}
  store.players.forEach(p => {
    series[p.name] = [0]
    let cum = 0
    dates.forEach(d => {
      const day = (allPlayerDays.value[p.name] ?? []).find(x => x.date === d)?.pts ?? 0
      cum = Math.round((cum + day) * 10) / 10
      series[p.name].push(cum)
    })
  })
  return { dates: [null, ...dates], series }
})

const wrChartGeom = computed(() => {
  if (!activePlayer.value || !pointsOverTime.value) return null
  const { series } = pointsOverTime.value
  const W = 600, H = 150
  const n   = Object.values(series)[0]?.length ?? 0
  if (n < 2) return null
  const max = Math.max(1, ...Object.values(series).flat())
  const xFor = i => (i / (n - 1)) * W
  const yFor = v => H - 8 - (v / max) * (H - 16)
  const lines = {}, endPts = []
  Object.entries(series).forEach(([name, vals]) => {
    lines[name] = vals.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`).join(' ')
    endPts.push({ name, x: xFor(n - 1), y: yFor(vals.at(-1) ?? 0) })
  })
  return { W, H, lines, endPts }
})

// ── Rank over time ────────────────────────────────────────────────────
const rankTimeline = computed(() => {
  if (!activePlayer.value) return null
  const name = activePlayer.value
  const dates = [...new Set(
    store.enrichedMatches.filter(m => m.played && !m.snapshot_minute).map(m => m.date)
  )].sort()
  if (dates.length < 2) return null
  const cum = {}
  store.players.forEach(p => { cum[p.name] = 0 })
  return dates.map(date => {
    store.players.forEach(p => {
      cum[p.name] = Math.round((cum[p.name] + ((allPlayerDays.value[p.name] ?? []).find(d => d.date === date)?.pts ?? 0)) * 10) / 10
    })
    const sorted = [...store.players].sort((a, b) => cum[b.name] - cum[a.name])
    return { date, rank: sorted.findIndex(p => p.name === name) + 1 }
  })
})

const rankChartGeom = computed(() => {
  const tl = rankTimeline.value
  if (!tl || tl.length < 2) return null
  const W = 300, H = 120, LEFT = 22, n = tl.length, P = store.players.length
  const xFor = i => LEFT + (i / (n - 1)) * (W - LEFT - 4)
  const yFor = r => 8 + ((r - 1) / (P - 1)) * (H - 16)
  const pts = tl.map((p, i) => `${xFor(i).toFixed(1)},${yFor(p.rank).toFixed(1)}`).join(' ')
  const gridLines = Array.from({ length: P }, (_, i) => ({ rank: i + 1, y: yFor(i + 1) }))
  return { W, H, LEFT, pts, gridLines, startPt: { x: xFor(0), y: yFor(tl[0].rank) }, endPt: { x: xFor(n - 1), y: yFor(tl.at(-1).rank) } }
})

// ── Per-player data ───────────────────────────────────────────────────
const pd = computed(() => {
  if (!activePlayer.value) return {}
  const name  = activePlayer.value
  const p     = store.players.find(x => x.name === name)
  const entry = store.leaderboard.find(e => e.name === name)
  if (!p || !entry) return {}

  const teams      = [p.team1,p.team2,p.team3,p.team4,p.team5,p.team6].filter(Boolean)
  const teamsSet   = new Set(teams)
  const teamsAlive  = teams.filter(t => !ELIMINATED_TEAMS.has(t))
  const teamsRanked = [...teams].sort((a,b) => (store.fifaRankMap[a] ?? 999) - (store.fifaRankMap[b] ?? 999))
  const { breakdown } = entry

  const teamsByPoints = [...teams].sort((a, b) => (breakdown[b] ?? 0) - (breakdown[a] ?? 0))
  const teamBreakdowns = {}
  teams.forEach(t => {
    teamBreakdowns[t] = store.enrichedMatches
      .filter(m => m.played && !m.snapshot_minute)
      .map(m => matchBreakdownForTeam(t, m))
      .filter(Boolean)
  })

  // Best team + rank
  const teamPts  = teams.map(t => ({ team: t, pts: breakdown[t] ?? 0 })).sort((a,b) => b.pts - a.pts)
  const bestTeam = teamPts[0] ?? { team: teams[0], pts: 0 }
  const bestTeamRank   = allTeamRankings.value.findIndex(x => x.team === bestTeam.team) + 1
  const totalPoolTeams = allTeamRankings.value.length

  // Days (sorted by pts desc for best-day)
  const days    = [...(allPlayerDays.value[name] ?? [])].sort((a,b) => b.pts - a.pts)
  const bestDay = days[0] ?? { date: '—', pts: 0 }
  const topDays = days.slice(0, 3)
  const bestDayRank = allBestDayRankings.value.findIndex(x => x.name === name) + 1

  // Goals + rank
  let totalGoals = 0, lateGoals = 0, gamesPlayed = 0
  store.enrichedMatches.forEach(m => {
    if (!m.played || m.snapshot_minute) return
    if (!teamsSet.has(m.home) && !teamsSet.has(m.away)) return
    gamesPlayed++
    ;(m.goals ?? []).forEach(g => {
      const t = g.team === 'home' ? m.home : m.away
      if (teamsSet.has(t)) { totalGoals++; if (g.minute > 80) lateGoals++ }
    })
  })
  const gpg       = gamesPlayed ? (totalGoals / gamesPlayed).toFixed(2) : '—'
  const goalsRank = allGoalsRankings.value.findIndex(x => x.name === name) + 1

  // Pool W/L
  let poolW = 0, poolL = 0
  store.enrichedMatches.forEach(m => {
    if (m.home_score === '' || m.snapshot_minute) return
    if (!m.homePlayers?.length || !m.awayPlayers?.length) return
    const iAmHome = m.homePlayers.includes(name)
    const iAmAway = m.awayPlayers.includes(name)
    if (!iAmHome && !iAmAway) return
    const hs = Number(m.home_score), as = Number(m.away_score)
    if (hs === as && !m.penalties_winner) return
    const homeWon   = hs > as || m.penalties_winner === 'home'
    const myWon     = (iAmHome && homeWon) || (iAmAway && !homeWon)
    const opponents = iAmHome ? m.awayPlayers : m.homePlayers
    opponents.filter(n => n !== name).forEach(() => { myWon ? poolW++ : poolL++ })
  })

  const badges = computeBadges(name, entry, teams, teamsSet)

  return {
    name, rank: entry.rank, total: entry.total,
    teams, teamsAlive, teamsRanked, teamsByPoints, teamBreakdowns, breakdown,
    bestTeam, bestTeamRank, totalPoolTeams,
    bestDay, topDays, bestDayRank,
    totalGoals, lateGoals, gamesPlayed, gpg, goalsRank,
    poolW, poolL, badges,
  }
})

// ── Badge computation (comprehensive) ────────────────────────────────
function computeBadges(name, entry, teams, teamsSet) {
  const badges = []
  const lb      = store.leaderboard
  const played  = store.enrichedMatches.filter(m => m.played && !m.snapshot_minute)
  const gsPlayed = played.filter(m => m.stage === 'Group Stage')
  const koPlayed = played.filter(m => KNOCKOUT_STAGES.has(m.stage))

  // helpers
  const teamGoalsFor     = (ts, matches) => matches.reduce((s,m) => s + (ts.has(m.home) ? Number(m.home_score) : 0) + (ts.has(m.away) ? Number(m.away_score) : 0), 0)
  const teamGoalsAgainst = (ts, matches) => matches.reduce((s,m) => s + (ts.has(m.home) ? Number(m.away_score) : 0) + (ts.has(m.away) ? Number(m.home_score) : 0), 0)
  const myTs = teamsSet

  // ── Podium ────────────────────────────────────────────────────────
  if (entry.rank === 1) badges.push({ key: 'champ',   icon: '🏆', name: 'Pool Champion' })
  if (entry.rank === 2) badges.push({ key: 'runner',  icon: '🥈', name: 'Runner-Up' })
  if (entry.rank === 3) badges.push({ key: 'third',   icon: '🥉', name: 'Third Place' })

  // ── Picked the Winner / Crossbones ───────────────────────────────
  const _pickers = {}
  lb.forEach(e => e.teams.forEach(t => { _pickers[t] = (_pickers[t] ?? []).concat(e.name) }))
  const _maxPicked = Math.max(...Object.values(_pickers).map(p => p.length))
  const _champTeam = Object.entries(_pickers).find(([,p]) => p.length === _maxPicked)?.[0]
  if (_champTeam && teams.includes(_champTeam))
    badges.push({ key: 'winner', icon: '🏆', name: `Picked the Winner (${_champTeam})` })
  else
    badges.push({ key: 'crossbones', icon: '☠️', name: "Didn't Pick the Winner" })

  // ── Golden Boot — overall ─────────────────────────────────────────
  const bootAll = lb.map(e => ({ name: e.name, g: teamGoalsFor(new Set(e.teams), played) }))
  const maxBoot = Math.max(...bootAll.map(c => c.g))
  if (bootAll.find(c => c.name === name)?.g === maxBoot && maxBoot > 0)
    badges.push({ key: 'boot', icon: '⚡', name: `Gold Boot (${maxBoot} goals)` })

  // ── Golden Boot — Group Stage ─────────────────────────────────────
  const bootGS = lb.map(e => ({ name: e.name, g: teamGoalsFor(new Set(e.teams), gsPlayed) }))
  const maxGSBoot = Math.max(...bootGS.map(c => c.g))
  if (bootGS.find(c => c.name === name)?.g === maxGSBoot && maxGSBoot > 0)
    badges.push({ key: 'boot-gs', icon: '⚡', name: `Gold Boot GS (${maxGSBoot}g)` })

  // ── Golden Boot — Knockout ────────────────────────────────────────
  const bootKO = lb.map(e => ({ name: e.name, g: teamGoalsFor(new Set(e.teams), koPlayed) }))
  const maxKOBoot = Math.max(...bootKO.map(c => c.g))
  if (bootKO.find(c => c.name === name)?.g === maxKOBoot && maxKOBoot > 0)
    badges.push({ key: 'boot-ko', icon: '⚡', name: `Gold Boot KO (${maxKOBoot}g)` })

  // ── Golden Glove — fewest conceded in GS ─────────────────────────
  const glove = lb.map(e => ({ name: e.name, c: teamGoalsAgainst(new Set(e.teams), gsPlayed) }))
  const minGlove = Math.min(...glove.map(c => c.c))
  if (glove.find(c => c.name === name)?.c === minGlove)
    badges.push({ key: 'glove', icon: '🧤', name: `Gold Glove (${minGlove} vs in GS)` })

  // ── Group Stage medal ─────────────────────────────────────────────
  const gsPtsRanked = lb.map(e => {
    const ts = new Set(e.teams)
    return { name: e.name, pts: gsPlayed.reduce((s,m) => {
      if (ts.has(m.home)) s += matchPointsForTeam(m.home, m)
      if (ts.has(m.away)) s += matchPointsForTeam(m.away, m)
      return s
    }, 0) }
  }).sort((a,b) => b.pts - a.pts)
  const gsRank = gsPtsRanked.findIndex(c => c.name === name) + 1
  const gsMyPts = Math.round((gsPtsRanked.find(c => c.name === name)?.pts ?? 0) * 10) / 10
  if (gsRank === 1) badges.push({ key: 'gs1', icon: '🌊', name: `GS Champion (${gsMyPts} pts)` })
  if (gsRank === 2) badges.push({ key: 'gs2', icon: '🥈', name: 'GS Runner-Up' })
  if (gsRank === 3) badges.push({ key: 'gs3', icon: '🥉', name: 'GS Third Place' })

  // ── Community Shield — Jason only ────────────────────────────────
  if (name === 'Jason' && gsRank === 1)
    badges.push({ key: 'shield', icon: '🏆', name: `Community Shield (${gsMyPts} GS pts)` })

  // ── Comeback Kid ──────────────────────────────────────────────────
  const cb = lb.map(e => {
    const ts = new Set(e.teams)
    return { name: e.name, n: played.filter(m => (m.goals ?? []).length > 0 && (() => {
      const hs = Number(m.home_score), as = Number(m.away_score)
      if (hs === as) return false
      const winner  = hs > as ? 'home' : 'away'
      const winTeam = winner === 'home' ? m.home : m.away
      return ts.has(winTeam) && m.goals[0].team !== winner
    })()).length }
  })
  const maxCB = Math.max(...cb.map(c => c.n))
  if (maxCB > 0 && cb.find(c => c.name === name)?.n === maxCB)
    badges.push({ key: 'comeback', icon: '🪃', name: `Comeback Kid (${maxCB})` })

  // ── Wash Wizard — most draws ──────────────────────────────────────
  const draws = lb.map(e => {
    const ts = new Set(e.teams)
    return { name: e.name, n: played.filter(m => Number(m.home_score) === Number(m.away_score) && (ts.has(m.home) || ts.has(m.away))).length }
  })
  const maxDraws = Math.max(...draws.map(c => c.n))
  if (maxDraws > 0 && draws.find(c => c.name === name)?.n === maxDraws)
    badges.push({ key: 'wizard', icon: '🪄', name: `Wash Wizard (${maxDraws} draws)` })

  // ── Late Show — most goals after 80' ─────────────────────────────
  const late = lb.map(e => {
    const ts = new Set(e.teams)
    return { name: e.name, n: played.reduce((s,m) => s + (m.goals ?? []).filter(g => g.minute > 80 && ts.has(g.team === 'home' ? m.home : m.away)).length, 0) }
  })
  const maxLate = Math.max(...late.map(c => c.n))
  if (maxLate > 0 && late.find(c => c.name === name)?.n === maxLate)
    badges.push({ key: 'late', icon: '🌙', name: `Late Show (${maxLate} late goals)` })

  // ── Early Finisher — majority of goals in first half ─────────────
  let h1 = 0, h2 = 0
  played.forEach(m => (m.goals ?? []).forEach(g => {
    const t = g.team === 'home' ? m.home : m.away
    if (!myTs.has(t)) return
    g.minute <= 45 ? h1++ : h2++
  }))
  if (h1 + h2 > 0 && h1 > h2)
    badges.push({ key: 'early', icon: '💦', name: 'Early Finisher' })

  // ── Shrinkage — fewest goals scored in GS ────────────────────────
  const gsScored = lb.map(e => ({ name: e.name, g: teamGoalsFor(new Set(e.teams), gsPlayed) }))
  const minGS = Math.min(...gsScored.map(c => c.g))
  if (gsScored.find(c => c.name === name)?.g === minGS)
    badges.push({ key: 'shrink', icon: '🧊', name: `Shrinkage (${minGS} GS goals)` })

  // ── Clinical — most goals per game ───────────────────────────────
  const gpgRanks = lb.map(e => {
    const ts = new Set(e.teams); let g = 0, gms = 0
    played.forEach(m => {
      if (ts.has(m.home)) { g += Number(m.home_score); gms++ }
      if (ts.has(m.away)) { g += Number(m.away_score); gms++ }
    })
    return { name: e.name, gpg: gms ? g / gms : 0 }
  })
  const maxGpg = Math.max(...gpgRanks.map(c => c.gpg))
  if (maxGpg > 0 && gpgRanks.find(c => c.name === name)?.gpg === maxGpg)
    badges.push({ key: 'clinical', icon: '🎯', name: `Clinical (${maxGpg.toFixed(2)} g/g)` })

  // ── Spotless — fewest cards, zero reds ───────────────────────────
  const cardTotals = lb.map(e => {
    const ts = new Set(e.teams); let total = 0, reds = 0
    played.filter(m => m.cards?.length).forEach(m =>
      m.cards.forEach(c => {
        const t = c.team === 'home' ? m.home : m.away
        if (!ts.has(t)) return
        total++; if (c.type === 'red') reds++
      })
    )
    return { name: e.name, total, reds }
  })
  const minCards = Math.min(...cardTotals.map(c => c.total))
  const myCards  = cardTotals.find(c => c.name === name)
  if (myCards && myCards.total === minCards && myCards.reds === 0)
    badges.push({ key: 'spotless', icon: '🧽', name: `Spotless (${minCards} cards)` })

  // ── Dirty Pool — most yellow cards ───────────────────────────────
  const yellowTotals = lb.map(e => {
    const ts = new Set(e.teams)
    return { name: e.name, n: played.filter(m => m.cards?.length).reduce((s,m) =>
      s + m.cards.filter(c => c.type === 'yellow' && ts.has(c.team === 'home' ? m.home : m.away)).length, 0) }
  })
  const maxYellow = Math.max(...yellowTotals.map(c => c.n))
  const myYellow  = yellowTotals.find(c => c.name === name)?.n ?? 0
  if (myYellow > 0) {
    if (myYellow === maxYellow)
      badges.push({ key: 'dirty',  icon: '👑🟨', name: `Dirty Pool (${myYellow} yellows)` })
    else
      badges.push({ key: 'yellow', icon: '🟨',   name: `${myYellow} yellow card${myYellow !== 1 ? 's' : ''}` })
  }

  // ── Early Shower — most red cards ────────────────────────────────
  const redTotals = lb.map(e => {
    const ts = new Set(e.teams)
    return { name: e.name, n: played.filter(m => m.cards?.length).reduce((s,m) =>
      s + m.cards.filter(c => c.type === 'red' && ts.has(c.team === 'home' ? m.home : m.away)).length, 0) }
  })
  const maxRed = Math.max(...redTotals.map(c => c.n))
  const myRed  = redTotals.find(c => c.name === name)?.n ?? 0
  if (myRed > 0) {
    if (myRed === maxRed)
      badges.push({ key: 'shower', icon: '👑🟥', name: `Dirty Pool+ (${myRed} reds)` })
    else
      badges.push({ key: 'red',    icon: '🟥',   name: `${myRed} red card${myRed !== 1 ? 's' : ''}` })
  }

  // ── Ballsy — below-average Euro team count ────────────────────────
  const euroCounts = lb.map(e => ({ name: e.name, n: e.teams.filter(t => EURO_TEAMS.has(t)).length }))
  const avgEuro    = euroCounts.reduce((s,c) => s + c.n, 0) / euroCounts.length
  const myEuro     = euroCounts.find(c => c.name === name)?.n ?? 0
  if (myEuro < avgEuro)
    badges.push({ key: 'ballsy', icon: '💪', name: `Ballsy (${myEuro} Euro teams vs avg ${avgEuro.toFixed(1)})` })

  // ── Puhleez — highest avg FIFA rank (safest picks) ────────────────
  const fifaAvgs = lb.map(e => ({
    name: e.name,
    avg: e.teams.reduce((s,t) => s + (store.fifaRankMap[t] ?? 99), 0) / e.teams.length
  })).sort((a,b) => a.avg - b.avg)
  const myFifa = fifaAvgs.find(c => c.name === name)?.avg ?? 99
  const topThreshold = fifaAvgs[Math.floor(fifaAvgs.length / 3)]?.avg ?? 0
  if (myFifa <= topThreshold)
    badges.push({ key: 'puhleez', icon: '🙄', name: `Puhleez (avg FIFA #${Math.round(myFifa)})` })

  // ── Swim Test — worst avg FIFA rank ──────────────────────────────
  const maxFifa = Math.max(...fifaAvgs.map(c => c.avg))
  if (myFifa === maxFifa)
    badges.push({ key: 'swim', icon: '🫃', name: `Swim Test (avg FIFA #${Math.round(myFifa)})` })

  // ── Mad Genius — least likely pool to win ────────────────────────
  const minEuro = Math.min(...euroCounts.map(c => c.n))
  if (myEuro === minEuro)
    badges.push({ key: 'genius', icon: '💡', name: 'Mad Genius?' })

  // ── Pro-Poly / Herd Mentality ─────────────────────────────────────
  const overlaps = lb.map(e => ({
    name: e.name,
    n: e.teams.reduce((s,t) => s + lb.filter(o => o.name !== e.name && o.teams.includes(t)).length, 0)
  })).sort((a,b) => b.n - a.n)
  const overlapThresh = overlaps[Math.floor(overlaps.length / 4)]?.n ?? 0
  if ((overlaps.find(c => c.name === name)?.n ?? 0) >= overlapThresh && overlapThresh > 0)
    badges.push({ key: 'poly', icon: '🍍', name: 'Pro-Poly' })

  // ── Diff Beat — most unique teams ────────────────────────────────
  const teamCount = {}
  lb.forEach(e => e.teams.forEach(t => { teamCount[t] = (teamCount[t] ?? 0) + 1 }))
  const uniqueCounts = lb.map(e => ({ name: e.name, u: e.teams.filter(t => teamCount[t] === 1).length }))
  const maxUnique    = Math.max(...uniqueCounts.map(c => c.u))
  const myUnique     = uniqueCounts.find(c => c.name === name)?.u ?? 0
  if (myUnique === maxUnique && maxUnique > 0)
    badges.push({ key: 'unique', icon: '🥁', name: `Diff Beat (${myUnique} solo picks)` })

  // ── 'Cuzzi Bros — most-shared team ───────────────────────────────
  const pickers = {}
  lb.forEach(e => e.teams.forEach(t => { pickers[t] = (pickers[t] ?? []).concat(e.name) }))
  const maxShared  = Math.max(...Object.values(pickers).map(p => p.length))
  const sharedTeam = Object.entries(pickers).find(([,p]) => p.length === maxShared)?.[0]
  if (sharedTeam && teams.includes(sharedTeam) && maxShared > 1)
    badges.push({ key: 'cuzzi', icon: '🛁', name: `'Cuzzi Bros (${sharedTeam} ×${maxShared})` })

  // ── Back to Back 20+ ─────────────────────────────────────────────
  let streak = 0, b2b = false
  for (const { pts } of (allPlayerDays.value[name] ?? [])) {
    if (pts >= 20) { streak++; if (streak >= 2) { b2b = true; break } } else streak = 0
  }
  if (b2b) badges.push({ key: 'b2b', icon: '🥇', name: 'Back to Back 20+' })

  // ── Best / 2nd best single day in pool ───────────────────────────
  const allBestDays = lb.map(e => ({ name: e.name, pts: Math.max(0, ...(allPlayerDays.value[e.name] ?? []).map(d => d.pts)) })).sort((a,b) => b.pts - a.pts)
  const myBest       = allBestDays.find(c => c.name === name)?.pts ?? 0
  const poolTopDay   = allBestDays[0]?.pts ?? 0
  const poolSecDay   = allBestDays.slice(1).find(c => c.pts < poolTopDay)?.pts ?? 0
  if (myBest === poolTopDay && poolTopDay > 0)
    badges.push({ key: 'bestday', icon: '🥇', name: `Best Day in Pool (+${fmt(myBest)})` })
  else if (myBest === poolSecDay && poolSecDay > 0)
    badges.push({ key: 'secday',  icon: '🥈', name: `2nd Best Day (+${fmt(myBest)})` })

  // ── Pool Bully — most wins vs other players ───────────────────────
  const bully = {}
  lb.forEach(e => { bully[e.name] = 0 })
  store.enrichedMatches.forEach(m => {
    if (m.home_score === '' || m.snapshot_minute) return
    if (!m.homePlayers?.length || !m.awayPlayers?.length) return
    const hs = Number(m.home_score), as = Number(m.away_score)
    let winners, losers
    if (hs > as || m.penalties_winner === 'home')      { winners = m.homePlayers; losers = m.awayPlayers }
    else if (as > hs || m.penalties_winner === 'away') { winners = m.awayPlayers; losers = m.homePlayers }
    else return
    winners.forEach(w => losers.forEach(l => { if (w !== l && bully[w] !== undefined) bully[w]++ }))
  })
  const maxBully = Math.max(...Object.values(bully))
  if (maxBully > 0 && bully[name] === maxBully)
    badges.push({ key: 'bully', icon: '😤', name: `Pool Bully (${maxBully}W)` })

  // ── LG Duty — most teams eliminated ──────────────────────────────
  const elimCounts = lb.map(e => ({ name: e.name, n: e.teams.filter(t => ELIMINATED_TEAMS.has(t)).length }))
  const maxElim    = Math.max(...elimCounts.map(c => c.n))
  if (maxElim > 0 && elimCounts.find(c => c.name === name)?.n === maxElim)
    badges.push({ key: 'lg', icon: '🛟', name: `LG Duty (${maxElim} eliminated)` })

  // ── Alive-count badges ────────────────────────────────────────────
  const alive = teams.filter(t => !ELIMINATED_TEAMS.has(t)).length
  if (alive === 0) {
    const lastDate = {}
    played.forEach(m => { for (const t of [m.home, m.away]) if (ELIMINATED_TEAMS.has(t) && (!lastDate[t] || m.date > lastDate[t])) lastDate[t] = m.date })
    const myEnd  = teams.reduce((mx,t) => { const d = lastDate[t] ?? '9999'; return d > mx ? d : mx }, '0000')
    const allEnd = lb.filter(e => e.teams.every(t => ELIMINATED_TEAMS.has(t))).map(e => ({
      name: e.name, d: e.teams.reduce((mx,t) => { const d = lastDate[t] ?? '9999'; return d > mx ? d : mx }, '0000')
    }))
    const earliest = allEnd.reduce((a,b) => a.d <= b.d ? a : b, allEnd[0])?.d
    if (earliest && myEnd === earliest) badges.push({ key: 'washed', icon: '🧼', name: 'Washed Up' })
    else                                badges.push({ key: 'out',    icon: '🚿', name: 'Out of the Pool' })
  } else if (alive === 1) {
    badges.push({ key: 'lastleg', icon: '🦵', name: 'Last Leg' })
  } else if (alive === 2) {
    badges.push({ key: 'undertow', icon: '🏊', name: 'Undertow (2 left)' })
  } else if (alive >= 4) {
    badges.push({ key: 'floaties', icon: '🤽', name: `Floaties (${alive} alive)` })
  }
  const elimCount = teams.filter(t => ELIMINATED_TEAMS.has(t)).length
  if (alive > 0 && elimCount === Math.floor(teams.length / 2))
    badges.push({ key: 'halfdead', icon: '🐟', name: '½ Sunk' })

  // ── Pacer — final leader ──────────────────────────────────────────
  if (lb[0]?.name === name)
    badges.push({ key: 'pacer', icon: '🏊', name: 'Pacer (points leader)' })

  // ── Made Waves — days led the pool ───────────────────────────────
  const allDates = [...new Set(played.map(m => m.date))].sort()
  const running  = Object.fromEntries(lb.map(e => [e.name, 0]))
  let leadDays   = 0
  for (const date of allDates) {
    lb.forEach(e => { running[e.name] += (allPlayerDays.value[e.name] ?? []).find(d => d.date === date)?.pts ?? 0 })
    const mx = Math.max(...Object.values(running))
    if (mx > 0 && running[name] === mx) leadDays++
  }
  if (leadDays > 0)
    badges.push({ key: 'waves', icon: '🌊', name: `Made Waves (led ${leadDays} day${leadDays !== 1 ? 's' : ''})` })

  // ── Humor / Always-on ────────────────────────────────────────────
  if (teams.includes('USA'))     badges.push({ key: 'usa',    icon: '🦅',    name: 'Real American' })
  if (!teams.includes('USA'))    badges.push({ key: 'sus',    icon: '👀',    name: 'Sus (no USA pick)' })
  if (teams.includes('England')) badges.push({ key: 'empire', icon: '👌🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'Ok with Imperialism' })

  return badges
}

// ── Blurb helpers ─────────────────────────────────────────────────────
function poolBlurb(data) {
  if (!data.poolW && !data.poolL) return 'No head-to-head pool battles this tournament.'
  if (data.poolW === 0) return `Tough run — went 0–${data.poolL} against other pool players.`
  if (data.poolL === 0) return `Dominant — went ${data.poolW}–0. Untouchable.`
  const pct = Math.round(data.poolW / (data.poolW + data.poolL) * 100)
  if (pct >= 60) return `Strong at ${data.poolW}–${data.poolL} vs the pool. ${pct}% win rate.`
  return `Went ${data.poolW}–${data.poolL} in head-to-head matchups.`
}

function finalBlurb(data) {
  if (data.rank === 1) return 'Took the pool from wire to wire. Champion.'
  if (data.rank === 2) return 'So close. The pool was yours to lose — and it almost was.'
  if (data.rank === 3) return 'Podium finish. No shame in that at all.'
  if (data.rank === store.leaderboard.length) return 'Last place, but you were here. That counts.'
  return `Finished ${ordinal(data.rank)} — not the winner, but never boring.`
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(d) {
  if (!d || d === '—') return '—'
  const [, m, day] = d.split('-')
  return `${MONTHS[+m - 1]} ${+day}`
}
function wld(items) {
  if (items.some(i => i.key === 'W')) return 'W'
  if (items.some(i => i.key === 'D')) return 'D'
  return 'L'
}
function fmt(n) { return Number.isInteger(n) ? n : Number(n).toFixed(1) }
function rankClass(r) {
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return ''
}
</script>

<style scoped>
/* ── Root & Gate ──────────────────────────────────────────────────── */
.wr-root {
  height: calc(100dvh - var(--header-h) - var(--tab-h));
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--bg);
}

@media (min-width: 768px) {
  .wr-root { max-width: 800px; margin: 0 auto; }
}

.wr-gate {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; padding: 32px; text-align: center;
}
.gate-lock  { font-size: 48px; }
.gate-title { font-family: 'Orbitron', system-ui, sans-serif; font-size: 22px; font-weight: 800; color: var(--text); }
.gate-sub   { font-size: 14px; color: var(--text-dim); max-width: 260px; line-height: 1.5; }

/* ── Picker ───────────────────────────────────────────────────────── */
.wr-picker { flex: 1; overflow-y: auto; padding: 24px 16px; }

.picker-header { text-align: center; margin-bottom: 28px; }
.picker-year {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 13px; font-weight: 800; letter-spacing: .18em;
  color: var(--text-dim); text-transform: uppercase;
}
.picker-word {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 42px; font-weight: 900; letter-spacing: .04em;
  background: linear-gradient(90deg, var(--accent) 0%, var(--cyan) 45%, rgba(255,255,255,0.7) 50%, var(--cyan) 55%, var(--accent) 100%);
  background-size: 250% auto;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: shimmer 5s ease-in-out infinite;
}
.picker-sub { font-size: 13px; color: var(--text-dim); margin-top: 4px; }

.picker-grid { display: flex; flex-direction: column; gap: 10px; }
.picker-btn {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: var(--radius);
  background: var(--surface); border: 1px solid var(--border);
  cursor: pointer; text-align: left; color: var(--text);
  transition: border-color .15s, box-shadow .15s;
  animation: card-enter .35s ease both;
  animation-delay: calc(var(--i) * 60ms);
  position: relative; overflow: hidden;
}
.picker-btn::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--c); border-radius: 3px 0 0 3px;
}
.picker-btn:hover { border-color: var(--c); box-shadow: 0 0 12px rgba(0,0,0,0.3); }
.pb-rank {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800;
  background: var(--surface2); color: var(--text-dim); flex-shrink: 0;
}
.pb-name  { flex: 1; font-size: 17px; font-weight: 700; }
.pb-pts   { font-size: 13px; color: var(--text-dim); font-weight: 600; white-space: nowrap; }
.pb-arrow { font-size: 16px; color: var(--c); margin-left: 4px; }

/* ── Slideshow shell ──────────────────────────────────────────────── */
.wr-show {
  flex: 1; position: relative; overflow: hidden;
  display: flex; flex-direction: column;
}

.wr-progress {
  display: flex; gap: 4px; padding: 10px 12px 0;
  flex-shrink: 0; z-index: 10; position: relative;
}
.wr-pip {
  flex: 1; height: 3px; border-radius: 99px;
  background: rgba(255,255,255,0.18); transition: background .3s;
}
.wr-pip--done   { background: rgba(255,255,255,0.55); }
.wr-pip--active { background: var(--c, var(--accent)); }

.wr-exit-btn {
  position: absolute; top: 8px; right: 12px; z-index: 20;
  background: rgba(255,255,255,0.1); border: none; border-radius: 50%;
  color: var(--text); width: 30px; height: 30px; font-size: 14px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.wr-exit-btn:hover { background: rgba(255,255,255,0.2); }

.wr-player-name {
  position: absolute;
  top: calc(5% + 96px);
  left: 0; right: 0;
  text-align: center;
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 18px; font-weight: 900;
  letter-spacing: .12em; text-transform: uppercase;
  color: #fff;
  text-shadow:
    0 0 10px var(--c, var(--accent)),
    0 0 28px var(--c, var(--accent)),
    0 0 55px var(--c, var(--accent));
  z-index: 12; pointer-events: none;
}

.wr-prev, .wr-next {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: var(--text); border-radius: 50%; cursor: pointer;
  width: 40px; height: 40px; font-size: 22px;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.wr-prev { left: 8px; }
.wr-next { right: 8px; }
.wr-prev:hover, .wr-next:hover { background: rgba(255,255,255,0.16); }

/* ── Slide base ───────────────────────────────────────────────────── */
.wr-slide {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 16px 56px 24px;
  position: relative; z-index: 5;
}
.wr-slide::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 75% 75% at 50% 52%, rgba(8,6,18,.58) 0%, transparent 100%);
  pointer-events: none; z-index: 0;
}
.slide {
  width: 100%; display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 10px;
  position: relative; z-index: 1;
}

.sl-label {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 10px; font-weight: 800; letter-spacing: .22em;
  text-transform: uppercase; color: var(--c, var(--text-dim));
  margin-bottom: 2px;
  text-shadow: 0 0 10px var(--c);
}
.sl-big {
  font-size: 48px; font-weight: 900; color: var(--text); line-height: 1;
  text-shadow: 0 0 16px var(--c);
}
.sl-big-sub { font-size: 20px; font-weight: 600; color: var(--text-dim); }
.sl-context { font-size: 13px; color: var(--text-dim); }

.slide-pool-rank {
  font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--c); opacity: 0.85;
  background: rgba(0,0,0,0.3); border: 1px solid var(--c);
  border-radius: 99px; padding: 4px 12px;
  text-shadow: 0 0 8px var(--c);
}

/* Slide 0 — Cover */
.slide-cover { gap: 8px; }
.sc-year {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: .2em;
  color: var(--text-dim); text-transform: uppercase;
}
.sc-word {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 44px; font-weight: 900;
  background: linear-gradient(135deg, var(--c, var(--accent)), var(--cyan));
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  line-height: 1.05;
}
.sc-name {
  font-size: 30px; font-weight: 800; color: var(--text); margin-top: 4px;
  text-shadow: 0 0 18px var(--c), 0 0 40px var(--c);
  animation: vw-name-pulse 2.5s ease-in-out infinite;
}
.sc-tagline { font-size: 13px; color: var(--text-dim); text-shadow: 0 0 8px rgba(189,95,255,.6); }
.sc-flags   { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 12px; }
.sc-flag    { font-size: 28px; }
@media (min-width: 768px) {
  .sc-flag  { font-size: 48px; }
}

/* Slide 1 — Teams (wr-slide becomes the scroll container) */
.wr-slide--scroll {
  overflow-y: auto; -webkit-overflow-scrolling: touch;
  align-items: flex-start; padding-top: 16px;
  scrollbar-width: thin; scrollbar-color: var(--c) transparent;
}
.wr-slide--scroll::-webkit-scrollbar { width: 3px; }
.wr-slide--scroll::-webkit-scrollbar-thumb { background: var(--c); border-radius: 99px; }

.slide-squad { gap: 6px; align-items: stretch; padding: 0 4px; }
.squad-list  { display: flex; flex-direction: column; gap: 6px; width: 100%; }

.squad-team {
  background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
}
.squad-team-header {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}
.squad-flag  { font-size: 20px; flex-shrink: 0; }
.squad-name  { flex: 1; font-size: 14px; font-weight: 700; text-align: left; color: var(--text); }
.squad-total { font-size: 14px; font-weight: 800; color: var(--c); white-space: nowrap; }

.squad-matches { display: flex; flex-direction: column; }
.squad-match-row {
  display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
  padding: 5px 10px; font-size: 11px;
}
.squad-match-row + .squad-match-row { border-top: 1px solid rgba(255,255,255,0.04); }
.squad-wld { font-size: 10px; font-weight: 900; padding: 1px 5px; border-radius: 3px; flex-shrink: 0; letter-spacing: .04em; }
.squad-wld--W { background: rgba(0,255,159,0.15); color: var(--green); }
.squad-wld--D { background: rgba(0,229,255,0.12); color: var(--cyan); }
.squad-wld--L { background: rgba(255,255,255,0.06); color: var(--text-dim); }
.squad-bd-date { color: var(--text-dim); font-weight: 600; flex-shrink: 0; white-space: nowrap; }
.squad-opp   { color: var(--text-dim); flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
.squad-score { font-weight: 700; color: #fff; flex-shrink: 0; white-space: nowrap; }
.squad-chips { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; }
.squad-chip  { font-size: 10px; font-weight: 800; padding: 1px 5px; border-radius: 3px; white-space: nowrap; }
.squad-chip--W   { background: rgba(0,255,159,0.15); color: var(--green); }
.squad-chip--D   { background: rgba(0,229,255,0.12); color: var(--cyan); }
.squad-chip--nG  { background: rgba(255,255,255,0.08); color: #fff; }
.squad-chip--CS  { background: rgba(0,229,255,0.10); color: var(--cyan); }
.squad-chip--FG  { background: rgba(255,210,0,0.12); color: #ffd200; }
.squad-chip--CB  { background: rgba(255,140,0,0.14); color: #ff9d3a; }
.squad-chip--PEN { background: rgba(189,95,255,0.14); color: var(--purple); }
.squad-mul   { font-size: 10px; font-weight: 800; color: var(--accent); flex-shrink: 0; }
.squad-match-pts { font-size: 11px; font-weight: 800; color: var(--text); white-space: nowrap; flex-shrink: 0; margin-left: auto; }
.squad-no-matches { padding: 8px 10px; font-size: 11px; color: var(--text-dim); text-align: left; }

/* Slide 2 — Star */
.slide-star { gap: 8px; }
.star-flag  { font-size: 72px; line-height: 1; }
.star-name  { font-size: 26px; font-weight: 800; color: var(--text); }
.star-pts   { font-size: 52px; font-weight: 900; color: var(--c, var(--cyan)); line-height: 1;
              text-shadow: 0 0 22px var(--c), 0 0 50px var(--c); }
.star-pts-u { font-size: 18px; color: var(--text-dim); }

/* Slide 3 — Best Day */
.slide-bestday { gap: 8px; }
.bd-num   { font-size: 72px; font-weight: 900; color: var(--c, var(--green)); line-height: 1;
            text-shadow: 0 0 22px var(--c), 0 0 50px var(--c); }
.bd-date  { font-size: 20px; font-weight: 700; color: var(--text-dim); }
.bd-top3  { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
.bd-day-chip {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 14px; border-radius: 10px; border: 1px solid var(--border);
  background: var(--surface);
}
.bd-chip--0 { border-color: #ffd200; }
.bd-chip--1 { border-color: #00e5ff; }
.bd-chip--2 { border-color: #bd5fff; }
.bd-chip-date { font-size: 10px; color: var(--text-dim); font-weight: 700; letter-spacing: .06em; }
.bd-chip-pts  { font-size: 17px; font-weight: 800; color: var(--text); }
.bd-chip--0 .bd-chip-pts { color: #ffd200; }
.bd-chip--1 .bd-chip-pts { color: #00e5ff; }
.bd-chip--2 .bd-chip-pts { color: #bd5fff; }

/* Slide 4 — Goals */
.slide-goals { gap: 6px; }
.goals-num   { font-size: 80px; font-weight: 900; color: var(--c, var(--accent)); line-height: 1;
               text-shadow: 0 0 22px var(--c), 0 0 50px var(--c); }
.goals-sub   { font-size: 15px; color: var(--text-dim); }
.goals-row   { display: flex; gap: 24px; margin-top: 4px; }
.gr-item     { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.gr-val      { font-size: 28px; font-weight: 800; color: var(--text); }
.gr-label    { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); }

/* Slide 5 — Badges */
.slide-badges { gap: 8px; align-items: stretch; overflow: hidden; }
.badges-scroll {
  flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 2px 0 4px;
  /* hide scrollbar on webkit */
  scrollbar-width: thin; scrollbar-color: var(--c) transparent;
}
.badges-scroll::-webkit-scrollbar { width: 3px; }
.badges-scroll::-webkit-scrollbar-thumb { background: var(--c); border-radius: 99px; }
.badges-grid { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; }
.badge-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 11px; border-radius: 99px;
  background: var(--surface); border: 1px solid var(--border);
  font-size: 12px; font-weight: 700; color: var(--text);
}
.badge-icon { font-size: 15px; }
.badge-none { font-size: 14px; color: var(--text-dim); font-style: italic; }

/* Slide 6 — Pool Record */
.slide-record { gap: 10px; }
.record-row   { display: flex; align-items: center; gap: 20px; margin: 8px 0; }
.rr-item      { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.rr-num       { font-size: 60px; font-weight: 900; line-height: 1; }
.rr-w         { color: var(--green); text-shadow: 0 0 20px var(--green), 0 0 45px rgba(0,255,159,.5); }
.rr-l         { color: var(--accent); text-shadow: 0 0 20px var(--accent), 0 0 45px rgba(255,45,120,.5); }
.rr-sep       { font-size: 32px; color: var(--text-dim); }
.rr-label     { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); }
.record-blurb { font-size: 14px; color: var(--text-dim); max-width: 280px; line-height: 1.5; }

/* Slide 7 — Points Over Time */
.slide-pot { gap: 8px; align-items: stretch; }
.pot-chart-wrap { width: 100%; }
.pot-svg { width: 100%; display: block; overflow: visible; }
.pot-axis-row {
  display: flex; justify-content: space-between;
  font-size: 10px; font-weight: 700; letter-spacing: .05em;
  text-transform: uppercase; color: var(--text-dim);
  padding: 3px 2px 0;
}
.pot-mini-legend {
  display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
  margin-top: 4px;
}
.pml-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: var(--text-dim);
  opacity: 0.5; transition: opacity .15s;
}
.pml-active { opacity: 1; color: var(--text); }
.pml-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pml-name { font-size: 11px; }
.pml-pts  { font-size: 11px; color: var(--text-dim); }

/* Slide 8 — Leaderboard Journey */
.slide-journey { gap: 10px; }
.journey-chart-wrap { width: 100%; margin: 4px 0; }
.journey-svg { width: 100%; display: block; overflow: visible; }
.journey-stats {
  display: flex; gap: 20px; justify-content: center; margin-top: 4px;
}
.js-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.js-num  { font-size: 28px; font-weight: 900; color: var(--text); line-height: 1;
           text-shadow: 0 0 12px var(--c); }
.js-lbl  { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
           color: var(--text-dim); }
.js-up   .js-num { color: var(--green); text-shadow: 0 0 12px var(--green); }
.js-down .js-num { color: var(--accent); text-shadow: 0 0 12px var(--accent); }

/* Slide 9 — Final */
.slide-final { gap: 10px; }
.final-circle {
  width: 80px; height: 80px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; font-weight: 900;
  background: var(--surface2);
  border: 3px solid var(--c, var(--border));
  color: var(--text);
}
.final-name  { font-size: 28px; font-weight: 800; color: var(--text); }
.final-pts   { font-size: 52px; font-weight: 900; color: var(--c, var(--cyan)); line-height: 1;
               text-shadow: 0 0 22px var(--c), 0 0 50px var(--c); }
.final-pts-u { font-size: 18px; color: var(--text-dim); }
.final-blurb { font-size: 14px; color: var(--text-dim); max-width: 280px; line-height: 1.6; margin-top: 4px; }
.final-bye   { font-size: 18px; margin-top: 8px; color: var(--text-dim); }

/* Rank badges */
.rank-gold   { background: #4a3a1a !important; color: #f0c060 !important; border-color: #f0c060 !important; }
.rank-silver { background: #2a2e3a !important; color: #d0d8e8 !important; border-color: #d0d8e8 !important; }
.rank-bronze { background: #2e2018 !important; color: #e89060 !important; border-color: #e89060 !important; }

/* ── Slide transitions ────────────────────────────────────────────── */
.wr-fwd-enter-active, .wr-fwd-leave-active,
.wr-back-enter-active, .wr-back-leave-active {
  transition: opacity .22s ease, transform .22s ease;
}
.wr-fwd-enter-from  { opacity: 0; transform: translateX(40px); }
.wr-fwd-leave-to    { opacity: 0; transform: translateX(-40px); }
.wr-back-enter-from { opacity: 0; transform: translateX(-40px); }
.wr-back-leave-to   { opacity: 0; transform: translateX(40px); }

/* ── Keyframes ────────────────────────────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes card-enter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; }
}
@keyframes vw-name-pulse {
  0%,100% { text-shadow: 0 0 18px var(--c), 0 0 40px var(--c); }
  50%      { text-shadow: 0 0 30px var(--c), 0 0 70px var(--c); }
}

/* ═══════════════════════════════════════════════════════════════════
   VAPORWAVE SCENE  (POLISHED)
   ═══════════════════════════════════════════════════════════════════ */
.vw-scene {
  position: absolute; inset: 0; z-index: 0;
  pointer-events: none; overflow: hidden;
  animation: vw-glitch-flash 28s 9s linear infinite;
}
@keyframes vw-glitch-flash {
  0%, 95%, 100% { filter: none; }
  95.5% { filter: brightness(1.6) saturate(2.2) hue-rotate(20deg); }
  96%   { filter: hue-rotate(-40deg) brightness(0.5) contrast(2); }
  96.4% { filter: brightness(1.3) saturate(1.6); }
  96.8% { filter: none; }
}

/* ── Sky ──────────────────────────────────────────────────────────── */
.vw-sky {
  position: absolute; inset: 0 0 44% 0; overflow: hidden;
  background: linear-gradient(to bottom, #020109 0%, #0d0220 38%, #1e0645 72%, #38098a 100%);
}
/* Colored nebula cloud blobs */
.vw-sky::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 5px; height: 5px; border-radius: 50%; background: transparent;
  box-shadow:
    48px 18px 6px 3px rgba(189,95,255,.25),  195px 12px 8px 4px rgba(255,45,120,.22),
    368px 28px 5px 3px rgba(0,229,255,.28),   530px 16px 7px 3px rgba(189,95,255,.22),
    688px 22px 6px 2px rgba(255,45,120,.30),  128px 52px 4px 2px rgba(255,45,120,.18),
    290px 46px 5px 3px rgba(189,95,255,.24),  460px 58px 4px 2px rgba(0,229,255,.20),
    620px 42px 5px 3px rgba(255,45,120,.22),  750px 55px 4px 2px rgba(189,95,255,.20),
    740px 10px 8px 4px rgba(0,229,255,.22);
  animation: vw-nebula-breathe 7s ease-in-out infinite;
}
@keyframes vw-nebula-breathe { 0%,100% { opacity:.6; } 50% { opacity:1; } }

/* ── Stars layer 1 — medium bright ───────────────────────────────── */
.vw-stars { position: absolute; inset: 0; }
.vw-stars::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 2px; height: 2px; border-radius: 50%; background: transparent;
  box-shadow:
    14px 12px 0 rgba(255,255,255,.85),  38px 6px 0 rgba(255,255,255,.55),
    62px 28px 0 rgba(255,255,255,.75),   88px 18px 0 rgba(189,95,255,.80),
    112px 8px 0 rgba(255,255,255,.95),  135px 40px 0 rgba(0,229,255,.70),
    158px 22px 0 rgba(255,255,255,.55), 182px 55px 0 rgba(255,255,255,.75),
    207px 11px 0 rgba(255,45,120,.70),  228px 35px 0 rgba(255,255,255,.85),
    252px 7px 0 rgba(255,255,255,.55),  276px 48px 0 rgba(255,255,255,.95),
    300px 20px 0 rgba(189,95,255,.60),  322px 60px 0 rgba(255,255,255,.65),
    346px 14px 0 rgba(0,229,255,.80),   368px 38px 0 rgba(255,255,255,.75),
    390px 5px 0 rgba(255,255,255,.85),  412px 30px 0 rgba(189,95,255,.70),
    434px 16px 0 rgba(255,255,255,.75), 458px 44px 0 rgba(255,45,120,.60),
    480px 10px 0 rgba(255,255,255,.95), 502px 55px 0 rgba(0,229,255,.65),
    524px 28px 0 rgba(255,255,255,.55), 546px 8px 0 rgba(255,255,255,.85),
    568px 42px 0 rgba(189,95,255,.70),  590px 20px 0 rgba(255,255,255,.75),
    614px 50px 0 rgba(255,45,120,.60),  636px 14px 0 rgba(255,255,255,.65),
    660px 35px 0 rgba(0,229,255,.80),   682px 6px 0 rgba(255,255,255,.95),
    706px 48px 0 rgba(255,255,255,.55), 728px 24px 0 rgba(189,95,255,.60),
    752px 38px 0 rgba(255,255,255,.85), 776px 12px 0 rgba(255,45,120,.50),
     20px 72px 0 rgba(255,255,255,.45),  55px 80px 0 rgba(255,255,255,.55),
     92px 88px 0 rgba(189,95,255,.45),  132px 76px 0 rgba(255,255,255,.65),
    168px 92px 0 rgba(255,45,120,.45),  205px 84px 0 rgba(255,255,255,.55),
    244px 78px 0 rgba(0,229,255,.45),   280px 95px 0 rgba(255,255,255,.65),
    316px 82px 0 rgba(255,255,255,.55), 352px 90px 0 rgba(255,255,255,.45),
    384px 74px 0 rgba(189,95,255,.55),  420px 86px 0 rgba(255,255,255,.65),
    455px 70px 0 rgba(255,45,120,.45),  490px 92px 0 rgba(255,255,255,.55),
    525px 78px 0 rgba(0,229,255,.45),   560px 88px 0 rgba(255,255,255,.75),
    595px 72px 0 rgba(189,95,255,.45),  630px 95px 0 rgba(255,255,255,.55),
    665px 80px 0 rgba(255,45,120,.35),  700px 68px 0 rgba(255,255,255,.65),
    735px 85px 0 rgba(0,229,255,.45),   770px 76px 0 rgba(255,255,255,.55);
  animation: vw-twinkle-a 4.2s ease-in-out infinite;
}
/* ── Stars layer 2 — tiny dots ───────────────────────────────────── */
.vw-stars::after {
  content: ''; position: absolute; top: 0; left: 0;
  width: 1px; height: 1px; border-radius: 50%; background: transparent;
  box-shadow:
    26px 24px 0 rgba(255,255,255,.65),  50px 44px 0 rgba(255,255,255,.85),
    76px 16px 0 rgba(255,255,255,.45),   98px 62px 0 rgba(255,255,255,.75),
    122px 33px 0 rgba(255,255,255,.55), 145px 70px 0 rgba(255,255,255,.95),
    168px 45px 0 rgba(255,255,255,.45), 194px 8px 0 rgba(255,255,255,.65),
    218px 56px 0 rgba(255,255,255,.75), 240px 28px 0 rgba(255,255,255,.55),
    265px 68px 0 rgba(255,255,255,.65), 288px 40px 0 rgba(255,255,255,.85),
    312px 22px 0 rgba(255,255,255,.45), 334px 58px 0 rgba(255,255,255,.65),
    358px 35px 0 rgba(255,255,255,.75), 378px 50px 0 rgba(255,255,255,.55),
    400px 18px 0 rgba(255,255,255,.75), 422px 66px 0 rgba(255,255,255,.45),
    445px 38px 0 rgba(255,255,255,.85), 468px 10px 0 rgba(255,255,255,.55),
    490px 52px 0 rgba(255,255,255,.75), 512px 74px 0 rgba(255,255,255,.45),
    535px 30px 0 rgba(255,255,255,.65), 558px 60px 0 rgba(255,255,255,.55),
    580px 14px 0 rgba(255,255,255,.85), 602px 48px 0 rgba(255,255,255,.45),
    626px 76px 0 rgba(255,255,255,.65), 648px 25px 0 rgba(255,255,255,.75),
    670px 54px 0 rgba(255,255,255,.55), 694px 36px 0 rgba(255,255,255,.45),
    718px 65px 0 rgba(255,255,255,.75), 742px 20px 0 rgba(255,255,255,.65),
    766px 44px 0 rgba(255,255,255,.55), 790px 72px 0 rgba(255,255,255,.35);
  animation: vw-twinkle-b 6.5s 0.8s ease-in-out infinite;
}
@keyframes vw-twinkle-a { 0%,100% { opacity:.9;  } 50% { opacity:.15; } }
@keyframes vw-twinkle-b { 0%,100% { opacity:.55; } 50% { opacity:1;   } }

/* ── Shooting stars ───────────────────────────────────────────────── */
.vw-shoot { position: absolute; inset: 0; overflow: hidden; }
.vw-shoot::before {
  content: '';
  position: absolute; top: 15%; left: -150px;
  width: 130px; height: 1.5px; border-radius: 999px;
  background: linear-gradient(to right, transparent 0%, rgba(255,255,255,.95) 55%, rgba(189,95,255,.45) 100%);
  box-shadow: 0 0 5px rgba(255,255,255,.35), 0 0 12px rgba(189,95,255,.2);
  animation: vw-shoot-a 15s 2.2s linear infinite;
}
.vw-shoot::after {
  content: '';
  position: absolute; top: 31%; left: -100px;
  width: 88px; height: 1px; border-radius: 999px;
  background: linear-gradient(to right, transparent 0%, rgba(0,229,255,.9) 60%, rgba(0,229,255,.15) 100%);
  box-shadow: 0 0 4px rgba(0,229,255,.3);
  animation: vw-shoot-b 23s 11s linear infinite;
}
@keyframes vw-shoot-a {
  0%, 84%  { top: 15%; left: -150px; opacity: 0; }
  85%      { opacity: 1; }
  98%      { top: 30%; left: calc(100% + 50px); opacity: 1; }
  99%, 100%{ opacity: 0; top: 30%; left: calc(100% + 50px); }
}
@keyframes vw-shoot-b {
  0%, 80%  { top: 31%; left: -100px; opacity: 0; }
  81%      { opacity: 0.85; }
  98%      { top: 42%; left: calc(100% + 40px); opacity: 0.85; }
  99%, 100%{ opacity: 0; top: 42%; left: calc(100% + 40px); }
}

/* ── Mountain silhouette ──────────────────────────────────────────── */
.vw-mountains {
  position: absolute; left: 0; right: 0;
  top: calc(6% + 52px); height: 80px;
  background: linear-gradient(180deg, rgba(32,6,60,.0) 0%, #190340 35%, #0d0128 100%);
  clip-path: polygon(
    0% 100%, 0% 75%,
    2% 62%,  4% 50%,  6% 62%,  8% 45%,  10% 30%,
    12% 45%, 14% 38%, 16% 52%, 18% 28%, 20% 48%,
    22% 60%, 24% 40%, 26% 52%, 28% 20%, 30% 42%,
    32% 55%, 34% 38%, 36% 52%, 38% 15%, 40% 40%,
    42% 55%, 44% 35%, 46% 50%, 48% 25%, 50% 45%,
    52% 60%, 54% 38%, 56% 52%, 58% 18%, 60% 42%,
    62% 58%, 64% 36%, 66% 50%, 68% 28%, 70% 48%,
    72% 62%, 74% 40%, 76% 54%, 78% 22%, 80% 44%,
    82% 58%, 84% 42%, 86% 55%, 88% 16%, 90% 40%,
    92% 60%, 94% 46%, 96% 58%, 98% 70%, 100% 62%,
    100% 100%
  );
}
.vw-mountains::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(189,95,255,.12) 0%, rgba(255,45,120,.06) 40%, transparent 70%);
}

/* ── Sun ──────────────────────────────────────────────────────────── */
.vw-sun-wrap {
  position: absolute; left: 50%; top: 5%;
  transform: translateX(-50%);
  width: 178px; height: 89px;
  filter:
    drop-shadow(0 0 20px rgba(255,45,120,.90))
    drop-shadow(0 0 55px rgba(255,45,120,.40))
    drop-shadow(0 0 90px var(--c, rgba(189,95,255,.35)));
  animation: vw-sun-breathe 3.5s ease-in-out infinite;
}
.vw-sun { width: 100%; height: 100%; display: block; }
@keyframes vw-sun-breathe {
  0%,100% {
    filter:
      drop-shadow(0 0 20px rgba(255,45,120,.90))
      drop-shadow(0 0 55px rgba(255,45,120,.40))
      drop-shadow(0 0 90px var(--c, rgba(189,95,255,.35)));
  }
  50% {
    filter:
      drop-shadow(0 0 32px rgba(255,45,120,1))
      drop-shadow(0 0 90px rgba(255,45,120,.60))
      drop-shadow(0 0 130px var(--c, rgba(189,95,255,.55)));
  }
}

/* ── Horizon lines ────────────────────────────────────────────────── */
.vw-horizon-line {
  position: absolute; left: 0; right: 0;
  top: calc(5% + 90px); height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--c) 15%, #ff6fb0 40%, #ffffff 50%, #ff6fb0 60%, var(--c) 85%, transparent 100%);
  box-shadow: 0 0 10px var(--c), 0 0 30px rgba(255,45,120,.55), 0 -1px 10px var(--c);
  animation: vw-horizon-pulse 2.6s ease-in-out infinite;
}
.vw-horizon-line::after {
  content: '';
  position: absolute; left: 5%; right: 5%; top: 5px; height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--c) 20%, rgba(255,45,120,.6) 50%, var(--c) 80%, transparent 100%);
  opacity: .35;
}
@keyframes vw-horizon-pulse { 0%,100% { opacity:.7; } 50% { opacity:1; } }

/* ── Perspective grid ─────────────────────────────────────────────── */
.vw-grid-wrap {
  position: absolute; left: 0; right: 0; bottom: 0;
  height: 44%; overflow: hidden;
}
.vw-grid {
  position: absolute; left: -80%; right: -80%; top: 0; bottom: -12%;
  background-image:
    linear-gradient(to right,  var(--c) 1px, transparent 1px),
    linear-gradient(to bottom, var(--c) 1px, transparent 1px);
  background-size: 85px 52px;
  transform: perspective(320px) rotateX(54deg);
  transform-origin: top center;
  mask-image:         linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.05) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.05) 100%);
  animation: vw-grid-march 2.2s linear infinite, vw-grid-glow 5s ease-in-out infinite;
}
@keyframes vw-grid-march { from { background-position: 42px 0; } to { background-position: 42px 52px; } }
@keyframes vw-grid-glow  { 0%,100% { opacity:.48; } 50% { opacity:.72; } }

/* ── Floating shapes ──────────────────────────────────────────────── */
.vw-float { position: absolute; }

.vw-f1 {
  width: 68px; height: 68px; left: 4%; top: 22%;
  border: 2px solid #ff2d78; background: rgba(255,45,120,.04);
  box-shadow:
    0 0 12px rgba(255,45,120,.75), 0 0 32px rgba(255,45,120,.25),
    inset 0 0 16px rgba(255,45,120,.10);
  animation: vw-spin-float-a 9s ease-in-out infinite;
}
@keyframes vw-spin-float-a {
  0%   { transform: rotate(45deg)  translateY(0px);   }
  25%  { transform: rotate(135deg) translateY(-14px); }
  50%  { transform: rotate(225deg) translateY(0px);   }
  75%  { transform: rotate(315deg) translateY(14px);  }
  100% { transform: rotate(405deg) translateY(0px);   }
}

.vw-f2 {
  width: 46px; height: 46px; right: 7%; top: 26%;
  border: 2px solid #00e5ff; background: rgba(0,229,255,.04);
  box-shadow:
    0 0 12px rgba(0,229,255,.75), 0 0 28px rgba(0,229,255,.25),
    inset 0 0 12px rgba(0,229,255,.08);
  animation: vw-spin-float-b 7s 1.4s ease-in-out infinite;
}
@keyframes vw-spin-float-b {
  0%   { transform: rotate(45deg)   translateY(0px);  }
  25%  { transform: rotate(-45deg)  translateY(10px); }
  50%  { transform: rotate(-135deg) translateY(0px);  }
  75%  { transform: rotate(-225deg) translateY(-10px);}
  100% { transform: rotate(-315deg) translateY(0px);  }
}

.vw-f3 {
  width: 82px; height: 82px; right: 3%; top: 4%;
  border: 2px dashed var(--c); border-radius: 50%;
  box-shadow: 0 0 16px var(--c), 0 0 38px var(--c); opacity: .8;
  animation: vw-spin-circle 14s 0.9s linear infinite;
}
@keyframes vw-spin-circle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.vw-f4 {
  width: 32px; height: 32px; left: 16%; top: 50%;
  border: 1.5px solid #bd5fff; background: rgba(189,95,255,.05);
  box-shadow:
    0 0 10px rgba(189,95,255,.80), 0 0 26px rgba(189,95,255,.30),
    inset 0 0 8px rgba(189,95,255,.12);
  animation: vw-spin-float-c 11s 2.8s ease-in-out infinite;
}
@keyframes vw-spin-float-c {
  0%   { transform: rotate(45deg)  translateY(0px);  }
  50%  { transform: rotate(225deg) translateY(18px); }
  100% { transform: rotate(405deg) translateY(0px);  }
}

.vw-f5 {
  width: 96px; height: 96px; left: -32px; top: 36%;
  border: 1.5px solid var(--c); border-radius: 50%;
  box-shadow: 0 0 22px var(--c), 0 0 50px var(--c); opacity: .42;
  animation: vw-ghost-float 13s 4.5s ease-in-out infinite;
}
@keyframes vw-ghost-float {
  0%,100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-26px) scale(1.08); }
}

/* Diamond shape */
.vw-f6 {
  width: 32px; height: 32px; right: 14%; top: 55%;
  border: 2px solid #ffd200; background: rgba(255,210,0,.04);
  box-shadow:
    0 0 10px rgba(255,210,0,.80), 0 0 26px rgba(255,210,0,.30),
    inset 0 0 8px rgba(255,210,0,.10);
  transform: rotate(45deg);
  animation: vw-diamond-float 8s 0.6s ease-in-out infinite;
}
@keyframes vw-diamond-float {
  0%,100% { transform: rotate(45deg) translateY(0) scale(1);    opacity: .75; }
  40%      { transform: rotate(60deg) translateY(-14px) scale(1.1); opacity: 1; }
  70%      { transform: rotate(38deg) translateY(6px) scale(.95); opacity: .8; }
}

/* ── Sweep lines ──────────────────────────────────────────────────── */
.vw-sweep {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--c), #00e5ff, var(--c), transparent);
  box-shadow: 0 0 7px var(--c); opacity: .28;
  animation: vw-sweep-down 10s linear infinite;
}
.vw-sweep::after {
  content: '';
  position: absolute; left: 0; right: 0; top: 4px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,45,120,.6), transparent);
  opacity: .5;
}
@keyframes vw-sweep-down { from { top: -2px; } to { top: 100%; } }

/* ── Scanlines + shimmer pass ─────────────────────────────────────── */
.vw-scanlines {
  position: absolute; inset: 0; z-index: 4;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 3px,
    rgba(0,0,0,.10) 3px, rgba(0,0,0,.10) 4px
  );
}
.vw-scanlines::before {
  content: '';
  position: absolute; left: 0; right: 0; height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,.03) 50%, transparent 100%);
  animation: vw-scan-shimmer 8s 1s linear infinite;
}
@keyframes vw-scan-shimmer { from { top: -30%; } to { top: 130%; } }

/* ── CRT corner vignette ──────────────────────────────────────────── */
.vw-crt {
  position: absolute; inset: 0; z-index: 5;
  background: radial-gradient(
    ellipse 110% 110% at 50% 50%,
    transparent 55%,
    rgba(0,0,0,.30) 78%,
    rgba(0,0,0,.65) 100%
  );
  pointer-events: none;
}
</style>
