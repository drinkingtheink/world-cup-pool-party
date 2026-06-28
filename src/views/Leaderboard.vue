<template>
  <div class="view">
    <p class="view-title">Full Tournament Stats</p>

    <div class="tourney-stats card">
      <div class="stat-item">
        <span class="stat-value">{{ totalGoals }}</span>
        <span class="stat-label">Goals</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ matchesPlayed }} <span class="stat-of">/ {{ totalMatches }}</span></span>
        <span class="stat-label">Matches</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ goalsPerGame }}</span>
        <span class="stat-label">Goals / Game</span>
      </div>
    </div>

    <button class="schedule-btn" @click="router.push('/matches')">
      <CalendarDays :size="15" class="schedule-btn-icon" />
      <span class="schedule-btn-label">See Match Schedule</span>
      <ChevronRight :size="14" class="schedule-btn-arrow" />
    </button>

    <p class="view-title"></p>

    <div class="leaderboard">
      <div class="lb-header">
        <span></span>
        <span>Player</span>
        <span>Teams</span>
        <span>Stats</span>
        <span class="lb-header-pts">Points</span>
      </div>

      <div
        v-for="(entry, i) in store.leaderboard"
        :key="entry.name"
        class="lb-row card"
        :class="{ 'lb-row--first': entry.rank === 1 }"
        :style="{ '--i': i, '--pts-pct': ptsPct(entry) + '%' }"
        @click="expanded = expanded === entry.name ? null : entry.name"
      >
        <div class="lb-main">
          <span class="lb-rank" :class="rankClass(entry.rank)">{{ entry.rank }}</span>
          <div class="lb-center">
            <div class="lb-name-row">
              <div class="lb-name-line">
                <span class="lb-name">{{ entry.name }}</span>
                <span v-if="trending.holders.has(entry.name)" class="lb-trending-fire" aria-hidden="true">🔥</span>
                <button
                  v-if="playerLiveMatches[entry.name]?.length"
                  class="lb-live-btn"
                  @click.stop="router.push({ path: '/matches', hash: '#' + matchSlug(playerLiveMatches[entry.name][0]) })"
                  :title="playerLiveMatches[entry.name].map(m => `${m.home} vs ${m.away}`).join(', ')"
                >
                  <span class="lb-live-dot"></span>
                  <span v-for="m in playerLiveMatches[entry.name]" :key="m.home + m.away" class="lb-live-flag">
                    {{ FLAG_MAP[entry.teams.find(t => t === m.home || t === m.away)] ?? '🏳' }}
                  </span>
                  LIVE
                </button>
              </div>
              <div class="lb-badges">
                <span v-if="entry.name === pointsLeader" class="lb-setting-pace lb-tooltip-wrap" tabindex="0">🏊 Setting the Pace<span class="lb-tooltip">Current points leader</span></span>
                <span v-if="entry.name === 'Jason'" class="lb-shield lb-tooltip-wrap" tabindex="0">🏆 Community Shield<span class="lb-tooltip">Most Points Through Group Stage</span></span>
                <span v-if="inTheChase.holders.has(entry.name)" class="lb-in-the-chase lb-tooltip-wrap" tabindex="0">🎯 In the Chase<span class="lb-tooltip">Within {{ inTheChase.threshold }} pts of the leader</span></span>
                <span v-if="entry.teams.includes('USA')" class="lb-real-american lb-tooltip-wrap" tabindex="0">🦅🇺🇸<span class="lb-tooltip">Real American — picked the US in their Pool</span></span>
                <span v-if="entry.teams.includes('England')" class="lb-imperialism lb-tooltip-wrap" tabindex="0">👌🏴󠁧󠁢󠁥󠁮󠁧󠁿<span class="lb-tooltip">Ok with Imperialism — This player is admitting their implicit support for the imperialistic atrocities of England upon the nations they occupied. ¯\_(ツ)_/¯</span></span>
                <span v-if="ballsy.holders.has(entry.name)" class="lb-ballsy lb-tooltip-wrap" tabindex="0">💪 Ballsy<span class="lb-tooltip">Below average European teams picked (avg: {{ ballsy.avg }})</span></span>
                <span v-if="goldenGlove.holders.has(entry.name)" class="lb-golden-glove lb-tooltip-wrap" tabindex="0">🧤 Golden Glove<span class="lb-tooltip">Fewest goals conceded in the Group Stage ({{ goldenGlove.conceded }})</span></span>
                <span v-if="goldenBootGroup.holders.has(entry.name)" class="lb-golden-boot lb-tooltip-wrap" tabindex="0">⚡ Golden Boot - Groups<span class="lb-tooltip">Most goals scored in the Group Stage ({{ goldenBootGroup.goals }})</span></span>
                <span v-if="coldBoots.holders.has(entry.name)" class="lb-shrinkage lb-tooltip-wrap" tabindex="0">🧊 Shrinkage<span class="lb-tooltip">Fewest goals scored in the Group Stage ({{ coldBoots.scored }})</span></span>
                <span v-if="comebackKid.holders.has(entry.name)" class="lb-comeback lb-tooltip-wrap" tabindex="0">🪃 Comeback Kid<span class="lb-tooltip">Most comeback wins — teams that trailed but won ({{ comebackKid.count }})</span></span>
                <span v-if="dirtyPool.holders.has(entry.name)" class="lb-dirty-pool lb-tooltip-wrap" tabindex="0">🟨 Dirty Pool<span class="lb-tooltip">Most yellow cards across all teams ({{ dirtyPool.count }} yellows)</span></span>
                <span v-if="lateShow.holders.has(entry.name)" class="lb-late-show lb-tooltip-wrap" tabindex="0">🌙 The Late Show<span class="lb-tooltip">Most goals scored after the 80th minute ({{ lateShow.count }})</span></span>
                <span v-if="twoPumpChump.holders.has(entry.name)" class="lb-two-pump lb-tooltip-wrap" tabindex="0">💦 2-Pump Chump<span class="lb-tooltip">Majority of goals scored in the first half</span></span>
                <span v-if="tournamentComplete && goldenBoot.holders.has(entry.name)" class="lb-golden-boot-overall lb-tooltip-wrap" tabindex="0">⚡ Golden Boot<span class="lb-tooltip">Most goals scored across all rounds ({{ goldenBoot.goals }})</span></span>
                <span v-if="groundskeeper.holders.has(entry.name)" class="lb-groundskeeper lb-tooltip-wrap" tabindex="0">🛟 Lifeguard Duty<span class="lb-tooltip">Most clubs eliminated from the Pool ({{ groundskeeper.count }})</span></span>
                <span v-if="trending.holders.has(entry.name)" class="lb-trending lb-tooltip-wrap" tabindex="0">🔥 Trending<span class="lb-tooltip">Most points over the last 3 matchdays (+{{ trending.pts }})</span></span>
                <span v-if="bestSingleDay.holders.has(entry.name)" class="lb-best-day lb-tooltip-wrap" tabindex="0">🥇 +{{ bestSingleDay.pts }}<span class="lb-tooltip">Best single-day points total</span></span>
                <span v-if="secondBestSingleDay.holders.has(entry.name)" class="lb-second-day lb-tooltip-wrap" tabindex="0">🥈 +{{ secondBestSingleDay.pts }}<span class="lb-tooltip">2nd best single-day points total</span></span>
                <span v-if="!entry.teams.includes('USA')" class="lb-sus lb-tooltip-wrap" tabindex="0">👀 sus<span class="lb-tooltip">Did not select the US in their pool. The US Government has been notified.</span></span>
              </div>
              <span class="lb-today-tomorrow">
                <span class="lb-tt-label">MATCHES:</span> {{ playerMatchDays[entry.name].today }} Today
                <span class="lb-tt-sep">/</span>
                {{ playerMatchDays[entry.name].tomorrow }} Tomorrow
              </span>
            </div>
            <div class="lb-flags">
              <span v-for="team in rankedTeams(entry.teams)" :key="team" class="lb-flag" :class="{ 'lb-flag--eliminated': ELIMINATED_TEAMS.has(team) }" :title="team"><span class="lb-flag-emoji">{{ FLAG_MAP[team] ?? '🏳' }}</span><span v-if="ELIMINATED_TEAMS.has(team)" class="lb-flag-x">✕</span></span>
            </div>
            <div class="lb-stats-row">
              <span class="lb-stat"><span class="lb-stat-value">{{ playerGamesPlayed[entry.name].played }}</span><span class="lb-stat-label">Matches</span></span>
              <span class="lb-stat"><span class="lb-stat-value">{{ playerGoals[entry.name] }}</span><span class="lb-stat-label">Goals</span></span>
              <span class="lb-stat"><span class="lb-stat-value">{{ playerGoalsPerGame[entry.name] }}</span><span class="lb-stat-label">Goals/Game</span></span>
            </div>
          </div>
          <span class="lb-pts">{{ entry.total }} <span class="lb-pts-label">pts</span></span>
        </div>

        <!-- Expanded team breakdown + match day pts -->
        <transition name="expand">
          <div v-if="expanded === entry.name" class="lb-expanded">
            <div class="lb-breakdown"
              @click.stop="router.push({ path: '/my-teams', query: { player: entry.name } })">
              <div v-for="team in rankedTeams(entry.teams)" :key="team" class="lb-team-row" :class="{ 'lb-team-row--eliminated': ELIMINATED_TEAMS.has(team) }">
                <span class="lb-team-flag">{{ FLAG_MAP[team] ?? '🏳' }}</span>
                <span class="lb-team-name">{{ team }}</span>
                <span class="lb-team-pts">{{ entry.breakdown[team] ?? 0 }} pts</span>
              </div>
            </div>
            <div v-if="playerPointsByDate[entry.name]?.length" class="lb-daygrid" @click.stop>
              <span class="lb-daygrid-label">Points by Day</span>
              <div class="lb-daygrid-chips">
                <div v-if="lastGroupDate" class="lb-day-divider lb-day-divider--start">
                  <span class="lb-day-divider-label">Group Stage</span>
                </div>
                <template v-for="d in playerPointsByDate[entry.name]" :key="d.date">
                  <div
                    class="lb-day-chip"
                    :class="{ 'lb-day-chip--zero': d.pts === 0, 'lb-day-chip--high': d.pts >= 10 && d.pts < 20, 'lb-day-chip--ultra': d.pts >= 20 }"
                    @click.stop="router.push({ path: '/matches', hash: '#date-' + d.date })"
                  >
                    <span class="lb-day-date">{{ fmtDate(d.date) }}</span>
                    <span class="lb-day-pts">+{{ fmt(d.pts) }}</span>
                  </div>
                  <div v-if="lastGroupDate && d.date === lastGroupDate" class="lb-day-divider">
                    <span class="lb-day-divider-label">Knockout Rounds</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <p v-if="!store.leaderboard.length" class="empty-msg">No data yet</p>
    </div>

    <template v-if="chartGeom">
      <p class="view-title" style="margin-top:20px">Points Over Time</p>
      <div class="card pot-card">
        <svg :viewBox="`0 0 ${chartGeom.W} ${chartGeom.H}`" class="pot-svg" preserveAspectRatio="none">
          <line v-for="frac in [0, 0.25, 0.5, 0.75, 1]" :key="frac"
            x1="0" :x2="chartGeom.W"
            :y1="chartGeom.H - 10 - frac * (chartGeom.H - 20)" :y2="chartGeom.H - 10 - frac * (chartGeom.H - 20)"
            class="pot-gridline" />
          <polyline
            v-for="p in store.players" :key="p.name"
            :points="chartGeom.lines[p.name]"
            class="pot-line"
            :style="{ stroke: playerColor[p.name], opacity: highlighted && highlighted !== p.name ? 0.15 : 1, strokeWidth: highlighted === p.name ? 3 : 1.75 }"
            fill="none"
          />
          <circle v-for="pt in chartGeom.lastPoints" :key="pt.name"
            :cx="pt.x" :cy="pt.y" r="3"
            :style="{ fill: playerColor[pt.name], opacity: highlighted && highlighted !== pt.name ? 0.15 : 1 }"
          />
        </svg>
        <div class="pot-axis">
          <span>Start</span>
          <span>{{ fmtDate(chartGeom.dates[chartGeom.dates.length - 1]) }}</span>
        </div>
        <div class="pot-legend">
          <button v-for="entry in store.leaderboard" :key="entry.name"
            class="pot-legend-item" :class="{ 'pot-legend-item--dim': highlighted && highlighted !== entry.name }"
            @click="highlighted = highlighted === entry.name ? null : entry.name">
            <span class="pot-dot" :style="{ background: playerColor[entry.name] }"></span>
            <span class="pot-legend-name">{{ entry.name }}</span>
            <span class="pot-legend-pts">{{ entry.total }}</span>
          </button>
        </div>
      </div>
    </template>

    <template v-if="topDaysChart">
      <p class="view-title" style="margin-top:20px">Best Single Days</p>
      <p class="strength-sub">Each player's 3 highest-scoring match days</p>
      <div class="card best-days-card">
        <svg :viewBox="`0 0 ${topDaysChart.W} ${topDaysChart.H}`" class="best-days-svg" preserveAspectRatio="none">
          <line v-for="g in topDaysChart.gridLines" :key="g.y"
            x1="0" :x2="topDaysChart.W" :y1="g.y" :y2="g.y" class="pot-gridline" />
          <template v-for="group in topDaysChart.groups" :key="group.name">
            <g v-for="(bar, bi) in group.bars" :key="bi">
              <title>{{ fmtDate(bar.date) }} · {{ bar.pts }} pts</title>
              <rect :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
                :fill="bar.color" rx="2" opacity="0.85" />
            </g>
          </template>
        </svg>
        <div class="best-days-names">
          <div v-for="group in topDaysChart.groups" :key="group.name" class="best-days-name-col">
            <span class="best-days-name">{{ group.name }}</span>
            <div class="best-days-vals">
              <span
                v-for="(bar, bi) in group.bars" :key="bi"
                class="best-days-val"
                :style="{ color: ['#ffd200','#00e5ff','#bd5fff'][bi] }"
              >{{ bar.pts }}</span>
            </div>
          </div>
        </div>
        <div class="best-days-legend">
          <span class="bd-leg"><span class="bd-dot" style="background:#ffd200"></span>Best day</span>
          <span class="bd-leg"><span class="bd-dot" style="background:#00e5ff"></span>2nd</span>
          <span class="bd-leg"><span class="bd-dot" style="background:#bd5fff"></span>3rd</span>
        </div>
      </div>
    </template>

    <div class="quote-card">
      <span class="quote-mark">"</span>
      <p class="quote-text">{{ randomQuote.text }}</p>
      <p class="quote-author">— {{ randomQuote.author }}</p>
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
      <div
        v-for="item in sharedPicks" :key="item.team"
        class="shared-chip" :class="`shared-t${item.tier}`"
        :style="chipScale(item.count)"
      >
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

    <!-- Same-Group Picks -->
    <p class="view-title" style="margin-top:28px">Same-Group Picks</p>
    <p class="strength-sub">Players with two or more teams competing in the same group</p>
    <div v-if="groupClashes.length" class="clash-list">
      <div v-for="entry in groupClashes" :key="entry.name" class="clash-row">
        <span class="clash-player">{{ entry.name }}</span>
        <div class="clash-groups">
          <div v-for="clash in entry.clashes" :key="clash.group" class="clash-group">
            <span class="clash-group-label">Group {{ clash.group }}</span>
            <div class="clash-teams">
              <span v-for="(team, ti) in clash.teams" :key="team" class="clash-team">
                <span class="clash-flag">{{ FLAG_MAP[team] ?? '🏳' }}</span>
                <span class="clash-team-name">{{ team }}</span>
                <span v-if="ti < clash.teams.length - 1" class="clash-vs">vs</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="strength-sub" style="font-style:italic">No same-group picks</p>

    <div v-if="noConflictPlayers.length" class="clash-clean">
      <span class="clash-clean-trophy">🏆</span>
      <div class="clash-clean-body">
        <span class="clash-clean-names">{{ noConflictPlayers.join(', ') }}</span>
        <span class="clash-clean-label">No group conflicts — every team in a different group</span>
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

    <!-- Pool Matchups -->
    <div class="section-title-row" style="margin-top:28px">
      <p id="pool-matchups" class="view-title">Pool Matchups</p>
      <button class="section-link-btn" @click="copyMatchupsLink" :title="matchupsLinkCopied ? 'Copied!' : 'Copy link'">
        <Check v-if="matchupsLinkCopied" :size="12" />
        <Link2 v-else :size="12" />
        <span>{{ matchupsLinkCopied ? 'Copied!' : 'Copy link' }}</span>
      </button>
    </div>
    <p class="strength-sub">Group stage matches where players have skin in the game on both sides</p>
    <div class="mu-summary">
      <div v-for="type in matchupStats.sortedTypes" :key="type" class="mu-chip" :class="`mu-intensity-${matchupStats.intensity[type]}`">
        <span class="mu-chip-type">{{ type.replace('v', ' v ') }}</span>
        <span class="mu-chip-count">{{ matchupStats.tally[type] }}</span>
      </div>
    </div>
    <div v-for="type in matchupStats.sortedTypes" :key="type" class="mu-group">
      <div class="mu-group-header">
        <span class="mu-badge" :class="`mu-intensity-${matchupStats.intensity[type]}`">{{ type.replace('v', ' v ') }}</span>
        <span class="mu-group-sub">{{ matchupStats.byType[type].length }} match{{ matchupStats.byType[type].length !== 1 ? 'es' : '' }}</span>
      </div>
      <div class="card mu-list">
        <div v-for="(m, i) in matchupStats.byType[type]" :key="m.home + m.date"
          class="mu-row" :class="{ 'mu-row--div': i > 0, 'mu-row--done': m.home_score !== '' && !m.snapshot_minute }">
          <span class="mu-date">
            <span>{{ fmtDate(m.date) }}</span>
            <span v-if="m.date === today" class="mu-today-badge">Today</span>
          </span>
          <div class="mu-sides">
            <div class="mu-side">
              <span class="mu-flag">{{ FLAG_MAP[m.home] ?? '🏳' }}</span>
              <div class="mu-info">
                <span class="mu-team">{{ m.home }}</span>
                <span class="mu-players">
                  <span v-for="(name, ni) in m.homePlayers" :key="name"
                    :class="{ 'mu-player-both': m.awayPlayers.includes(name) }"
                  >{{ name }}{{ ni < m.homePlayers.length - 1 ? ', ' : '' }}</span>
                </span>
              </div>
            </div>
            <div class="mu-center">
              <template v-if="m.home_score !== '' && !m.snapshot_minute">
                <span class="mu-score">{{ m.home_score }}–{{ m.away_score }}</span>
                <span class="mu-ft">FT</span>
              </template>
              <span v-else class="mu-vs">vs</span>
            </div>
            <div class="mu-side mu-side--right">
              <div class="mu-info mu-info--right">
                <span class="mu-team">{{ m.away }}</span>
                <span class="mu-players">
                  <span v-for="(name, ni) in m.awayPlayers" :key="name"
                    :class="{ 'mu-player-both': m.homePlayers.includes(name) }"
                  >{{ name }}{{ ni < m.awayPlayers.length - 1 ? ', ' : '' }}</span>
                </span>
              </div>
              <span class="mu-flag">{{ FLAG_MAP[m.away] ?? '🏳' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CalendarDays, ChevronRight, Link2, Check } from 'lucide-vue-next'
import { usePoolStore } from '../stores/pool.js'
import { quotes, FLAG_MAP, ELIMINATED_TEAMS } from '../data/index.js'
import { matchSlug } from '../utils.js'
import { calcPlayerPoints, matchPointsForTeam } from '../services/points.js'

const router = useRouter()
const route  = useRoute()

const store = usePoolStore()
const expanded = ref(null)
const ready = ref(false)

const matchupsLinkCopied = ref(false)
function copyMatchupsLink() {
  const url = `${window.location.origin}${window.location.pathname}#/#pool-matchups`
  navigator.clipboard.writeText(url).then(() => {
    matchupsLinkCopied.value = true
    setTimeout(() => { matchupsLinkCopied.value = false }, 2000)
  })
}

function scrollToHash(hash) {
  if (!hash) return
  nextTick(() => {
    const el   = document.querySelector(hash)
    const main = document.querySelector('.app-main')
    if (!el || !main) return
    const top = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop
    main.scrollTo({ top: top - 16, behavior: 'smooth' })
  })
}

watch(() => route.hash, scrollToHash)
onMounted(() => nextTick(() => {
  ready.value = true
  scrollToHash(route.hash)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lb-tooltip-wrap')) {
      document.querySelectorAll('.lb-tooltip-wrap[tabindex]').forEach(el => el.blur())
    }
  })
}))

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
}
const today = todayStr()

const totalGoals    = computed(() => store.matches.reduce((sum, m) => sum + (m.goals?.length ?? 0), 0))

const playerGoals = computed(() => {
  const map = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    let g = 0
    store.matches.forEach(m => {
      ;(m.goals ?? []).forEach(goal => {
        if (teams.has(goal.team === 'home' ? m.home : m.away)) g++
      })
    })
    map[p.name] = g
  })
  return map
})
const playerGoalsPerGame = computed(() => {
  const map = {}
  store.players.forEach(p => {
    const played = playerGamesPlayed.value[p.name].played
    map[p.name] = played ? (playerGoals.value[p.name] / played).toFixed(2) : '—'
  })
  return map
})

const playerGamesPlayed = computed(() => {
  const map = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    let played = 0, total = 0
    store.matches.forEach(m => {
      if (!teams.has(m.home) && !teams.has(m.away)) return
      total++
      if (m.home_score !== '' && !m.snapshot_minute) played++
    })
    map[p.name] = { played, total }
  })
  return map
})
const completedMatches = computed(() => store.matches.filter(m => m.home_score !== '' && !m.snapshot_minute))
const matchesPlayed = computed(() => completedMatches.value.length)
const totalMatches  = computed(() => store.matches.length)
const goalsPerGame  = computed(() => {
  if (!matchesPlayed.value) return '—'
  const goals = completedMatches.value.reduce((sum, m) => sum + (m.goals?.length ?? 0), 0)
  return (goals / matchesPlayed.value).toFixed(2)
})

function playerTeams(p) {
  return [p.team1, p.team2, p.team3, p.team4, p.team5, p.team6].filter(Boolean)
}

const playerMatchDays = computed(() => {
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)
  const result = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    let todayCount = 0, tomorrowCount = 0
    store.matches.forEach(m => {
      if (!teams.has(m.home) && !teams.has(m.away)) return
      if (m.date === today) todayCount++
      else if (m.date === tomorrowStr) tomorrowCount++
    })
    result[p.name] = { today: todayCount, tomorrow: tomorrowCount }
  })
  return result
})


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

// Players with 2+ teams in the same group
const groupClashes = computed(() =>
  store.players
    .map(p => {
      const teams = playerTeams(p)
      const byGroup = {}
      teams.forEach(t => {
        const g = store.groupOf[t]
        if (!g) return
        if (!byGroup[g]) byGroup[g] = []
        byGroup[g].push(t)
      })
      const clashes = Object.entries(byGroup)
        .filter(([, ts]) => ts.length >= 2)
        .map(([group, ts]) => ({ group, teams: ts }))
        .sort((a, b) => a.group.localeCompare(b.group))
      return { name: p.name, clashes }
    })
    .filter(p => p.clashes.length > 0)
)

const noConflictPlayers = computed(() =>
  store.players
    .filter(p => {
      const teams = playerTeams(p)
      const groups = teams.map(t => store.groupOf[t]).filter(Boolean)
      return groups.length === new Set(groups).size
    })
    .map(p => p.name)
)

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


const matchupStats = computed(() => {
  const tally = {}
  const byType = {}

  store.enrichedMatches
    .filter(m => m.stage === 'Group Stage')
    .forEach(m => {
      const h = m.homePlayers.length
      const a = m.awayPlayers.length
      if (h === 0 || a === 0) return
      const [big, small] = h >= a ? [h, a] : [a, h]
      const key = `${big}v${small}`
      tally[key] = (tally[key] || 0) + 1
      if (!byType[key]) byType[key] = []
      byType[key].push(m)
    })

  Object.values(byType).forEach(arr => arr.sort((a, b) => a.date.localeCompare(b.date)))

  const sortedTypes = Object.keys(tally).sort((a, b) => {
    const [a1, a2] = a.split('v').map(Number)
    const [b1, b2] = b.split('v').map(Number)
    return (b1 + b2) - (a1 + a2) || b1 - a1
  })

  const intensityOrder = ['low', 'low', 'medium', 'medium', 'high', 'max']
  const intensity = {}
  sortedTypes.forEach((type, i) => {
    const [a, b] = type.split('v').map(Number)
    const total = a + b
    intensity[type] = total >= 6 ? 'max' : total >= 5 ? 'high' : total >= 4 ? 'medium' : 'low'
  })

  return { tally, byType, sortedTypes, intensity }
})

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(d) {
  const [, m, day] = d.split('-')
  return `${MONTHS[+m - 1]} ${+day}`
}

function chipScale(count) {
  const maxCount = Math.max(...sharedPicks.value.map(s => s.count))
  const t = (count - 2) / Math.max(maxCount - 2, 1)
  const fontSize = (11 + t * 10).toFixed(1) + 'px'
  const padV    = (4  + t * 6).toFixed(1) + 'px'
  const padH    = (10 + t * 10).toFixed(1) + 'px'
  return { fontSize, padding: `${padV} ${padH}` }
}

function rankedTeams(teams) {
  return [...teams].sort((a, b) => (store.fifaRankMap[a] ?? 999) - (store.fifaRankMap[b] ?? 999))
}

const playerLiveMatches = computed(() => {
  const map = {}
  store.leaderboard.forEach(entry => {
    const teamSet = new Set(entry.teams)
    const lives = store.enrichedMatches.filter(m =>
      (m.snapshot_minute || m.autoLive) &&
      (teamSet.has(m.home) || teamSet.has(m.away))
    )
    if (lives.length) map[entry.name] = lives
  })
  return map
})

// ── Points Over Time ─────────────────────────────────────────────
const CHART_COLORS = ['#ff2d78', '#00e5ff', '#00ff9f', '#bd5fff', '#ffd200', '#ff8c00', '#5b8def', '#ff5d8f']
const playerColor = computed(() => {
  const map = {}
  store.players.forEach((p, i) => { map[p.name] = CHART_COLORS[i % CHART_COLORS.length] })
  return map
})
const highlighted = ref(null)

const pointsOverTime = computed(() => {
  const matchDates = [...new Set(
    store.matches
      .filter(m => m.home_score !== '' && !m.snapshot_minute)
      .map(m => m.date)
  )].sort()
  const dates = [null, ...matchDates]
  const series = {}
  store.players.forEach(p => { series[p.name] = [0] })
  matchDates.forEach(d => {
    const upTo = store.matches.filter(m => m.date <= d && m.home_score !== '' && !m.snapshot_minute)
    store.players.forEach(p => {
      series[p.name].push(calcPlayerPoints(p, upTo).total)
    })
  })
  return { dates, series }
})

const chartGeom = computed(() => {
  const { dates, series } = pointsOverTime.value
  if (dates.length < 2) return null
  const W = 600, H = 180, padT = 10, padB = 10
  const maxVal = Math.max(1, ...Object.values(series).flat())
  const n = dates.length
  const xFor = i => (i / (n - 1)) * W
  const yFor = v => H - padB - (v / maxVal) * (H - padT - padB)
  const lines = {}
  const lastPoints = []
  Object.entries(series).forEach(([name, vals]) => {
    lines[name] = vals.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ')
    lastPoints.push({ name, x: xFor(n - 1), y: yFor(vals[vals.length - 1]) })
  })
  return { W, H, lines, lastPoints, dates }
})

function rankClass(r) {
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return ''
}

function ptsPct(entry) {
  const max = store.leaderboard[0]?.total ?? 1
  return max > 0 ? ((entry.total / max) * 100).toFixed(1) : '0'
}

const lastGroupDate = computed(() => {
  const dates = store.enrichedMatches
    .filter(m => m.stage === 'Group Stage')
    .map(m => m.date)
    .sort()
  return dates[dates.length - 1] ?? null
})

const playerPointsByDate = computed(() => {
  const result = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    const byDate = {}
    store.enrichedMatches.forEach(m => {
      if (!m.played || m.snapshot_minute) return
      if (!teams.has(m.home) && !teams.has(m.away)) return
      if (!byDate[m.date]) byDate[m.date] = 0
      if (teams.has(m.home)) byDate[m.date] += matchPointsForTeam(m.home, m)
      if (teams.has(m.away)) byDate[m.date] += matchPointsForTeam(m.away, m)
    })
    result[p.name] = Object.entries(byDate)
      .map(([date, pts]) => ({ date, pts: Math.round(pts * 10) / 10 }))
      .sort((a, b) => a.date.localeCompare(b.date))
  })
  return result
})

const EUROPEAN_TEAMS = new Set([
  'England','Germany','Norway','Scotland','France','Netherlands',
  'Croatia','Switzerland','Spain','Sweden','Czechia',
  'Bosnia & Herzegovina','Portugal','Belgium','Austria','Türkiye',
])

const ballsy = computed(() => {
  const counts = store.leaderboard.map(e => ({
    name: e.name,
    count: e.teams.filter(t => EUROPEAN_TEAMS.has(t)).length,
  }))
  const avg = counts.reduce((s, c) => s + c.count, 0) / counts.length
  const holders = new Set(counts.filter(c => c.count < avg).map(c => c.name))
  return { avg: Math.round(avg * 10) / 10, holders }
})

const goldenGlove = computed(() => {
  const totals = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const conceded = store.enrichedMatches
      .filter(m => m.played && !m.snapshot_minute && m.stage === 'Group Stage')
      .reduce((sum, m) => {
        if (teamSet.has(m.home)) sum += Number(m.away_score)
        if (teamSet.has(m.away)) sum += Number(m.home_score)
        return sum
      }, 0)
    return { name: e.name, conceded }
  })
  const min = Math.min(...totals.map(t => t.conceded))
  const holders = new Set(totals.filter(t => t.conceded === min).map(t => t.name))
  return { conceded: min, holders }
})

const pointsLeader = computed(() => store.leaderboard[0]?.name ?? null)

const IN_THE_CHASE_THRESHOLD = 10

const inTheChase = computed(() => {
  const leader = store.leaderboard[0]?.total ?? 0
  const holders = new Set(
    store.leaderboard
      .filter(e => e.total < leader && leader - e.total <= IN_THE_CHASE_THRESHOLD)
      .map(e => e.name)
  )
  return { holders, threshold: IN_THE_CHASE_THRESHOLD }
})

const tournamentComplete = computed(() =>
  store.enrichedMatches.some(m => m.stage === 'Final' && m.played)
)

function calcGoals(stageFilter) {
  return store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const goals = store.enrichedMatches
      .filter(m => m.played && !m.snapshot_minute && (!stageFilter || m.stage === stageFilter))
      .reduce((sum, m) => {
        if (teamSet.has(m.home)) sum += Number(m.home_score)
        if (teamSet.has(m.away)) sum += Number(m.away_score)
        return sum
      }, 0)
    return { name: e.name, goals }
  })
}

const goldenBootGroup = computed(() => {
  const totals = calcGoals('Group Stage')
  const max = Math.max(...totals.map(t => t.goals))
  const holders = new Set(totals.filter(t => t.goals === max && max > 0).map(t => t.name))
  return { goals: max, holders }
})

const coldBoots = computed(() => {
  const totals = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const scored = store.enrichedMatches
      .filter(m => m.played && !m.snapshot_minute && m.stage === 'Group Stage')
      .reduce((sum, m) => {
        if (teamSet.has(m.home)) sum += Number(m.home_score)
        if (teamSet.has(m.away)) sum += Number(m.away_score)
        return sum
      }, 0)
    return { name: e.name, scored }
  })
  const min = Math.min(...totals.map(t => t.scored))
  const holders = new Set(totals.filter(t => t.scored === min).map(t => t.name))
  return { scored: min, holders }
})

const goldenBoot = computed(() => {
  const totals = calcGoals(null)
  const max = Math.max(...totals.map(t => t.goals))
  const holders = new Set(totals.filter(t => t.goals === max && max > 0).map(t => t.name))
  return { goals: max, holders }
})

const comebackKid = computed(() => {
  const comebackWinners = store.enrichedMatches
    .filter(m => m.played && !m.snapshot_minute && m.goals?.length > 0)
    .flatMap(m => {
      const homeScore = Number(m.home_score)
      const awayScore = Number(m.away_score)
      if (homeScore === awayScore) return []
      const winner = homeScore > awayScore ? 'home' : 'away'
      if (m.goals[0].team === winner) return []
      return [winner === 'home' ? m.home : m.away]
    })
  const counts = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    return { name: e.name, count: comebackWinners.filter(t => teamSet.has(t)).length }
  })
  const max = Math.max(...counts.map(c => c.count))
  const holders = new Set(counts.filter(c => c.count === max && max > 0).map(c => c.name))
  return { count: max, holders }
})

const dirtyPool = computed(() => {
  const counts = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const yellows = store.enrichedMatches
      .filter(m => m.played && m.cards?.length)
      .reduce((sum, m) => {
        for (const c of m.cards) {
          if (c.type !== 'yellow') continue
          const team = c.team === 'home' ? m.home : m.away
          if (teamSet.has(team)) sum++
        }
        return sum
      }, 0)
    return { name: e.name, yellows }
  })
  const max = Math.max(...counts.map(c => c.yellows))
  const holders = new Set(counts.filter(c => c.yellows === max && max > 0).map(c => c.name))
  return { count: max, holders }
})

const lateShow = computed(() => {
  const counts = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const goals = store.enrichedMatches
      .filter(m => m.played && m.goals?.length)
      .reduce((sum, m) => {
        for (const g of m.goals) {
          if (g.minute <= 80) continue
          const team = g.team === 'home' ? m.home : m.away
          if (teamSet.has(team)) sum++
        }
        return sum
      }, 0)
    return { name: e.name, goals }
  })
  const max = Math.max(...counts.map(c => c.goals))
  const holders = new Set(counts.filter(c => c.goals === max && max > 0).map(c => c.name))
  return { count: max, holders }
})

const twoPumpChump = computed(() => {
  const holders = new Set(
    store.leaderboard
      .filter(e => {
        const teamSet = new Set(e.teams)
        let first = 0, second = 0
        for (const m of store.enrichedMatches) {
          if (!m.played || !m.goals?.length) continue
          for (const g of m.goals) {
            const team = g.team === 'home' ? m.home : m.away
            if (!teamSet.has(team)) continue
            if (g.minute <= 45) first++
            else second++
          }
        }
        return first + second > 0 && first > second
      })
      .map(e => e.name)
  )
  return { holders }
})

const groundskeeper = computed(() => {
  const counts = store.leaderboard.map(e => ({
    name: e.name,
    count: e.teams.filter(t => ELIMINATED_TEAMS.has(t)).length,
  }))
  const max = Math.max(...counts.map(c => c.count))
  const holders = new Set(counts.filter(c => c.count === max && max > 0).map(c => c.name))
  return { count: max, holders }
})

const trending = computed(() => {
  const allDates = [...new Set(
    store.enrichedMatches.filter(m => m.played && !m.snapshot_minute).map(m => m.date)
  )].sort()
  const last3 = allDates.slice(-3)
  const totals = store.leaderboard.map(e => {
    const pts = last3.reduce((sum, date) => {
      return sum + (playerPointsByDate.value[e.name] ?? [])
        .filter(d => d.date === date)
        .reduce((s, d) => s + d.pts, 0)
    }, 0)
    return { name: e.name, pts }
  })
  const max = Math.max(...totals.map(t => t.pts))
  const holders = new Set(totals.filter(t => t.pts === max && max > 0).map(t => t.name))
  return { pts: max, holders, dates: last3 }
})

const bestSingleDay = computed(() => {
  let max = 0
  Object.values(playerPointsByDate.value).forEach(days =>
    days.forEach(d => { if (d.pts > max) max = d.pts })
  )
  const holders = new Set(
    Object.entries(playerPointsByDate.value)
      .filter(([, days]) => days.some(d => d.pts === max))
      .map(([name]) => name)
  )
  return { pts: max, holders }
})

const secondBestSingleDay = computed(() => {
  const { pts: first } = bestSingleDay.value
  let second = 0
  Object.values(playerPointsByDate.value).forEach(days =>
    days.forEach(d => { if (d.pts > second && d.pts < first) second = d.pts })
  )
  const holders = new Set(
    Object.entries(playerPointsByDate.value)
      .filter(([, days]) => days.some(d => d.pts === second))
      .map(([name]) => name)
  )
  return { pts: second, holders }
})

function fmt(n) { return Number.isInteger(n) ? n : n.toFixed(1) }

const topDaysChart = computed(() => {
  const entries = store.leaderboard
  if (!entries.length) return null

  const W = 600, H = 160
  const padX = 4, padT = 10
  const cW = W - padX * 2
  const cH = H - padT

  const allPts = entries.flatMap(e =>
    (playerPointsByDate.value[e.name] ?? []).map(d => d.pts)
  )
  if (!allPts.length) return null
  const maxPts = Math.max(10, ...allPts)

  const groupW = cW / entries.length
  const barW = Math.max(7, Math.floor(groupW * 0.19))
  const gap = 3
  const BAR_COLORS = ['#ffd200', '#00e5ff', '#bd5fff']

  const groups = entries.map((entry, gi) => {
    const cx = padX + (gi + 0.5) * groupW
    const top3 = [...(playerPointsByDate.value[entry.name] ?? [])]
      .sort((a, b) => b.pts - a.pts).slice(0, 3)
    const bars = top3.map((d, bi) => {
      const x = cx + (bi - 1) * (barW + gap) - barW / 2
      const bH = (d.pts / maxPts) * cH
      return { x, y: padT + cH - bH, w: barW, h: bH, pts: d.pts, date: d.date, color: BAR_COLORS[bi] }
    })
    return { name: entry.name, bars }
  })

  const gridLines = [0.25, 0.5, 0.75, 1].map(f => ({ y: padT + cH * (1 - f), label: Math.round(f * maxPts) }))

  return { W, H, groups, gridLines }
})
</script>

<style scoped>
.tourney-stats {
  display: flex; align-items: center; justify-content: space-around;
  padding: 16px; margin-bottom: 16px;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.stat-value {
  font-size: 26px; font-weight: 800;
  background: linear-gradient(90deg, var(--green) 0%, var(--cyan) 40%, rgba(255,255,255,0.75) 50%, var(--cyan) 60%, var(--green) 100%);
  background-size: 250% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 8s ease-in-out infinite;
}
.stat-of { font-size: 16px; font-weight: 600; -webkit-text-fill-color: var(--text-dim); color: var(--text-dim); }
.stat-label { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-dim); }

.leaderboard { display: flex; flex-direction: column; gap: 8px; }

.lb-row { cursor: pointer; transition: border-color .15s; overflow: visible; position: relative; z-index: 0; }
.lb-row:has(.lb-tooltip-wrap:hover),
.lb-row:has(.lb-tooltip-wrap:focus) { z-index: 50; }
.lb-row--first { border-color: var(--accent); }

.lb-main {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px;
}

.lb-rank {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; background: var(--surface2); color: var(--text-dim);
  flex-shrink: 0; margin-top: 1px;
}
.rank-gold   { background: #4a3a1a; color: #f0c060; }
.rank-silver { background: #2a2e3a; color: #d0d8e8; }
.rank-bronze { background: #2e2018; color: #e89060; }

.lb-center { flex: 1; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.lb-name { font-size: 18px; font-weight: 600; color: #ffffff; }
.lb-trending-fire { font-size: 16px; line-height: 1; }

.lb-shield {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,210,0,0.18), rgba(255,255,255,0.22), rgba(255,210,0,0.18));
  background-size: 200% auto;
  color: #ffd200;
  border: 1px solid rgba(255,210,0,0.4);
  white-space: nowrap;
  animation: shield-sparkle 2s linear infinite;
}
@keyframes shield-sparkle {
  0%   { background-position: 200% center; }
  100% { background-position: 0% center; }
}

.lb-setting-pace {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,229,255,0.15), rgba(255,255,255,0.22), rgba(0,229,255,0.15));
  background-size: 200% auto;
  color: var(--cyan);
  border: 1px solid rgba(0,229,255,0.45);
  white-space: nowrap;
  animation: shield-sparkle 1.5s linear infinite;
}

.lb-in-the-chase {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,229,255,0.12), rgba(255,255,255,0.18), rgba(0,229,255,0.12));
  background-size: 200% auto;
  color: var(--cyan);
  border: 1px solid rgba(0,229,255,0.35);
  white-space: nowrap;
  animation: shield-sparkle 1.6s linear infinite;
}

.lb-sus {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(255,45,120,0.1);
  border: 1px solid rgba(255,45,120,0.35);
  color: #ff6fa0;
  white-space: nowrap;
}

.lb-ballsy {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,140,0,0.13), rgba(255,255,255,0.18), rgba(255,140,0,0.13));
  background-size: 200% auto;
  color: #ff9d3a;
  border: 1px solid rgba(255,140,0,0.38);
  white-space: nowrap;
  animation: shield-sparkle 2.5s linear infinite;
}

.lb-real-american {
  font-size: 14px; line-height: 1;
  padding: 3px 7px; border-radius: 20px;
  background: rgba(0,229,255,0.12);
  border: 1px solid rgba(0,229,255,0.4);
  white-space: nowrap; cursor: default;
  filter: drop-shadow(0 0 5px rgba(0,229,255,0.35));
}

.lb-imperialism {
  font-size: 14px; line-height: 1;
  padding: 3px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(180,20,20,0.14), rgba(220,80,80,0.2), rgba(180,20,20,0.14));
  background-size: 200% auto;
  color: #e87878;
  border: 1px solid rgba(200,50,50,0.38);
  white-space: nowrap;
  animation: shield-sparkle 3.5s linear infinite;
}

.lb-golden-glove {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,255,159,0.12), rgba(255,255,255,0.18), rgba(0,255,159,0.12));
  background-size: 200% auto;
  color: var(--green);
  border: 1px solid rgba(0,255,159,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.3s linear infinite;
}

.lb-golden-boot {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,210,0,0.15), rgba(255,255,255,0.22), rgba(255,210,0,0.15));
  background-size: 200% auto;
  color: #ffd200;
  border: 1px solid rgba(255,210,0,0.4);
  white-space: nowrap;
  animation: shield-sparkle 2.2s linear infinite;
}

.lb-shrinkage {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(100,200,255,0.12), rgba(200,240,255,0.2), rgba(100,200,255,0.12));
  background-size: 200% auto;
  color: #7ee8ff;
  border: 1px solid rgba(100,200,255,0.35);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}

.lb-comeback {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(80,255,150,0.12), rgba(200,255,220,0.2), rgba(80,255,150,0.12));
  background-size: 200% auto;
  color: #4dff9e;
  border: 1px solid rgba(80,255,150,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.4s linear infinite;
}

.lb-dirty-pool {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,210,0,0.13), rgba(255,240,100,0.22), rgba(255,210,0,0.13));
  background-size: 200% auto;
  color: #ffe040;
  border: 1px solid rgba(255,210,0,0.38);
  white-space: nowrap;
  animation: shield-sparkle 2.6s linear infinite;
}

.lb-late-show {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(120,80,220,0.15), rgba(180,140,255,0.22), rgba(120,80,220,0.15));
  background-size: 200% auto;
  color: #c4a0ff;
  border: 1px solid rgba(150,100,255,0.38);
  white-space: nowrap;
  animation: shield-sparkle 3.2s linear infinite;
}

.lb-two-pump {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(255,45,120,0.1);
  border: 1px solid rgba(255,45,120,0.35);
  color: #ff6fa0;
  white-space: nowrap;
}

.lb-golden-boot-overall {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,160,0,0.18), rgba(255,255,255,0.24), rgba(255,160,0,0.18));
  background-size: 200% auto;
  color: #ffa500;
  border: 1px solid rgba(255,160,0,0.5);
  white-space: nowrap;
  animation: shield-sparkle 1.9s linear infinite;
}

.lb-trending {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,45,120,0.13), rgba(255,255,255,0.18), rgba(255,45,120,0.13));
  background-size: 200% auto;
  color: #ff6fa0;
  border: 1px solid rgba(255,45,120,0.32);
  white-space: nowrap;
  animation: shield-sparkle 1.8s linear infinite;
}

.lb-groundskeeper {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,100,0,0.14), rgba(255,255,255,0.18), rgba(255,100,0,0.14));
  background-size: 200% auto;
  color: #ff7a2f;
  border: 1px solid rgba(255,100,0,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.8s linear infinite;
}

.lb-best-day {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,255,159,0.15), rgba(255,255,255,0.2), rgba(0,255,159,0.15));
  background-size: 200% auto;
  color: var(--green);
  border: 1px solid rgba(0,255,159,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2s linear infinite;
}

.lb-tooltip-wrap { position: relative; cursor: default; z-index: 1; }
.lb-tooltip-wrap:focus { outline: none; }
.lb-tooltip-wrap:hover,
.lb-tooltip-wrap:focus { z-index: 100; }
.lb-tooltip {
  display: none;
  position: absolute; top: calc(100% + 6px); left: 0;
  background: var(--surface2); color: var(--text);
  border: 1px solid var(--border);
  font-size: 11px; font-weight: 500; letter-spacing: 0;
  white-space: normal; max-width: min(260px, calc(100vw - 32px)); padding: 4px 8px; border-radius: 6px;
  pointer-events: none; z-index: 10; line-height: 1.4;
}
.lb-tooltip::after {
  content: ''; position: absolute; bottom: 100%; left: 10px;
  border: 5px solid transparent;
  border-bottom-color: var(--border);
}
.lb-tooltip-wrap:hover .lb-tooltip,
.lb-tooltip-wrap:focus .lb-tooltip { display: block; }

.lb-second-day {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,229,255,0.12), rgba(255,255,255,0.18), rgba(0,229,255,0.12));
  background-size: 200% auto;
  color: var(--cyan);
  border: 1px solid rgba(0,229,255,0.3);
  white-space: nowrap;
  animation: shield-sparkle 2.4s linear infinite;
}
.lb-flags { display: flex; gap: 3px; flex-wrap: nowrap; }
.lb-flag { font-size: 24px; line-height: 1; cursor: default; flex-shrink: 0; display: inline-flex; flex-direction: column; align-items: center; gap: 1px; }
.lb-flag-x { font-size: 9px; font-weight: 900; color: #ffffff; line-height: 1; }
.lb-stats-row { display: flex; align-items: stretch; gap: 12px; margin-top: 10px; }
.lb-stat { display: flex; flex-direction: column; gap: 1px; min-width: 0; padding-top: 6px; }
.lb-stat-value { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.2; }
.lb-stat-label { font-size: 9px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--text-dim); line-height: 1.25; white-space: nowrap; }
@media (max-width: 380px) {
  .lb-stats-row { gap: 8px; }
  .lb-stat-label { white-space: normal; }
}
.lb-pts { font-size: 20px; font-weight: 800; color: var(--accent); flex-shrink: 0; }
.lb-pts-label { font-size: 13px; font-weight: 500; color: var(--text-dim); }

.lb-name-row { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }

.lb-name-line { display: flex; align-items: center; gap: 8px; }

.lb-badges { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }

.lb-live-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 2px 8px 2px 6px; border-radius: 99px;
  background: rgba(0,255,159,0.10); border: 1px solid rgba(0,255,159,0.35);
  color: var(--green); font-size: 10px; font-weight: 800; letter-spacing: .08em;
  cursor: pointer; text-transform: uppercase; flex-shrink: 0;
  transition: background .15s, border-color .15s;
}
.lb-live-btn:hover { background: rgba(0,255,159,0.18); border-color: rgba(0,255,159,0.6); }
.lb-live-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0;
  animation: live-pulse 1.5s ease-in-out infinite;
}
.lb-live-flag { font-size: 14px; line-height: 1; }
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
.lb-today-tomorrow {
  font-size: 11px; font-weight: 600; color: var(--text-dim);
  letter-spacing: .02em; white-space: nowrap;
}
.lb-tt-label { text-transform: uppercase; letter-spacing: .06em; font-size: 10px; }
.lb-tt-sep { margin: 0 4px; opacity: 0.4; }

.lb-breakdown {
  border-top: 1px solid var(--border);
  padding: 10px 16px 14px;
  display: flex; flex-direction: column; gap: 6px;
  cursor: pointer;
}
.lb-breakdown:hover { background: rgba(255,255,255,0.03); }
.lb-team-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 16px;
}
.lb-team-flag { font-size: 18px; line-height: 1; flex-shrink: 0; }
.lb-team-name { display: flex; align-items: center; gap: 6px; color: var(--text-dim); flex: 1; }
.lb-team-pts { font-weight: 600; color: #ffffff; }
.lb-team-row--eliminated { opacity: 0.35; }
.lb-team-row--eliminated .lb-team-name { text-decoration: line-through; }
.lb-flag--eliminated .lb-flag-emoji { opacity: 0.35; }

.expand-enter-active, .expand-leave-active { transition: opacity .15s; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

.empty-msg { text-align: center; color: var(--text-dim); padding: 32px; font-size: 17px; }

/* ── Paper Strength ───────────────────────────────────────────── */
.strength-sub {
  font-size: 13px; color: var(--text-dim); margin-bottom: 14px; margin-top: -8px;
}

.strength-list { display: flex; flex-direction: column; gap: 12px; }

.strength-row { display: flex; align-items: flex-start; gap: 10px; }

.strength-rank {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: var(--surface2); color: var(--text-dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; margin-top: 2px;
}

.strength-body { flex: 1; }

.strength-meta {
  display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;
}
.strength-name { font-size: 17px; font-weight: 700; color: #ffffff; }
.strength-score { font-size: 14px; font-weight: 700; color: var(--cyan); }

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
  font-size: 12px; font-weight: 600; color: var(--text-dim);
  background: var(--surface2); border: 1px solid var(--border);
  padding: 2px 7px; border-radius: 99px;
}

/* ── Tier Mix ─────────────────────────────────────────────────── */
.tiermix-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
.tiermix-row { display: flex; align-items: center; gap: 10px; }
.tiermix-name { font-size: 16px; font-weight: 700; color: #fff; width: 62px; flex-shrink: 0; }
.tiermix-bar {
  flex: 1; height: 10px; border-radius: 99px; overflow: hidden;
  background: var(--surface2); display: flex;
}
.tiermix-seg { height: 100%; transition: width .6s cubic-bezier(.4,0,.2,1); }
.seg-t1 { background: #ff2d78; }
.seg-t2 { background: #00e5ff; }
.seg-t3 { background: #00ff9f; }
.seg-t4 { background: #bd5fff; }
.tiermix-legend { font-size: 13px; font-weight: 700; color: var(--text-dim); white-space: nowrap; display: flex; align-items: center; gap: 3px; }
.tl-dot { font-size: 11px; }
.tl-dot.t1 { color: #ff2d78; }
.tl-dot.t2 { color: #00e5ff; }
.tl-dot.t3 { color: #00ff9f; }
.tl-dot.t4 { color: #bd5fff; }
.tiermix-key {
  display: flex; gap: 14px; font-size: 12px; color: var(--text-dim);
  margin-top: 4px; padding-left: 72px;
}
.tiermix-key span { display: flex; align-items: center; gap: 3px; }

/* ── Shared Picks ─────────────────────────────────────────────── */
.shared-grid { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-end; }
.shared-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 99px; border: 1px solid;
  font-size: 13px; font-weight: 700;
}
.shared-t1 { background: rgba(255,45,120,0.12); color: #ff6fa0; border-color: rgba(255,45,120,0.3); }
.shared-t2 { background: rgba(0,229,255,0.1); color: #00e5ff; border-color: rgba(0,229,255,0.3); }
.shared-t3 { background: rgba(0,255,159,0.08); color: #00ff9f; border-color: rgba(0,255,159,0.25); }
.shared-t4 { background: rgba(189,95,255,0.1); color: #bd5fff; border-color: rgba(189,95,255,0.25); }
.shared-count {
  background: rgba(255,255,255,0.12); border-radius: 99px;
  padding: 0 5px; font-size: 12px; font-weight: 800; color: #fff;
}

/* ── Wildcards ────────────────────────────────────────────────── */
.wildcard-list { display: flex; flex-direction: column; gap: 7px; }
.wildcard-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 10px; border-radius: 8px;
  background: var(--surface2); border: 1px solid var(--border);
}
.wildcard-team { font-size: 16px; font-weight: 700; }
.wt-t1 { color: #ff6fa0; }
.wt-t2 { color: #00e5ff; }
.wt-t3 { color: #00ff9f; }
.wt-t4 { color: #bd5fff; }
.wildcard-player { font-size: 13px; font-weight: 600; color: var(--text-dim); }

/* ── Avg FIFA Rank ────────────────────────────────────────────── */
.fifa-score { font-size: 14px; font-weight: 700; color: #ffd200; }
.fifa-bar {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #ffd200, #ff8c00);
  box-shadow: 0 0 8px rgba(255,210,0,0.3);
  transition: width .6s cubic-bezier(.4,0,.2,1);
}

/* ── Points Over Time ─────────────────────────────────────────── */
.pot-card { padding: 14px 14px 12px; margin-bottom: 16px; }
.pot-svg { width: 100%; height: 180px; display: block; overflow: visible; }
.pot-gridline { stroke: var(--border); stroke-width: 1; vector-effect: non-scaling-stroke; }
.pot-line { stroke-width: 1.75; vector-effect: non-scaling-stroke; transition: opacity .15s, stroke-width .15s; }
.pot-axis { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-dim); margin-top: 6px; padding: 0 2px; }
.pot-legend { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.pot-legend-item {
  display: flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 99px;
  border: 1px solid var(--border); background: var(--surface2); cursor: pointer;
  transition: opacity .15s, border-color .15s; font: inherit; color: inherit;
}
.pot-legend-item--dim { opacity: 0.35; }
.pot-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.pot-legend-name { font-size: 12px; font-weight: 700; color: #fff; }
.pot-legend-pts { font-size: 11px; font-weight: 800; color: var(--accent); }

/* ── Match Schedule Button ────────────────────────────────────── */
@keyframes btn-shimmer {
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
}

.schedule-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 15px 20px;
  margin: 16px 0 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,45,120,0.12) 0%, rgba(13,10,30,0.9) 50%, rgba(0,229,255,0.12) 100%);
  box-shadow:
    0 0 0 1px rgba(255,45,120,0.45),
    0 0 18px rgba(255,45,120,0.12),
    inset 0 1px 0 rgba(255,255,255,0.06);
  color: #fff;
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1);
}

.schedule-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 20%,
    rgba(255,255,255,0.04) 50%,
    transparent 80%
  );
  background-size: 300% auto;
  animation: btn-shimmer 7s linear infinite;
  pointer-events: none;
}

.schedule-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(0,229,255,0.55),
    0 0 18px rgba(0,229,255,0.14),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.schedule-btn:active {
  transform: translateY(1px) scale(0.97);
  box-shadow:
    0 0 0 1px rgba(255,45,120,0.6),
    0 0 10px rgba(255,45,120,0.25),
    inset 0 2px 4px rgba(0,0,0,0.3);
  transition: transform 0.07s ease, box-shadow 0.07s ease;
}

.schedule-btn-label {
  background: linear-gradient(90deg, var(--accent) 0%, var(--cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.schedule-btn-icon { color: var(--accent); flex-shrink: 0; }
.schedule-btn-arrow { color: var(--cyan); flex-shrink: 0; opacity: 0.7; }

/* ── Header Quote Card ────────────────────────────────────────── */
.quote-card {
  position: relative;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 16px 18px 14px;
  border-radius: 12px;
  background: rgba(13,10,30,0.7);
  border: 1px solid rgba(0,229,255,0.18);
  box-shadow: 0 0 18px rgba(0,229,255,0.07), inset 0 1px 0 rgba(255,255,255,0.04);
  overflow: hidden;
}
.quote-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(189,95,255,0.04) 100%);
  pointer-events: none;
}
.quote-mark {
  display: block;
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 48px; line-height: 1;
  color: var(--cyan);
  opacity: 0.35;
  margin-bottom: -6px;
  text-shadow: 0 0 12px rgba(0,229,255,0.5);
}
.quote-text {
  font-style: italic;
  font-size: 17px;
  line-height: 1.55;
  color: rgba(255,255,255,0.85);
  margin: 0 0 8px;
}
.quote-author {
  font-size: 13px;
  font-weight: 600;
  color: var(--cyan);
  margin: 0;
  opacity: 0.75;
  letter-spacing: .04em;
}

/* ── Same-Group Picks ─────────────────────────────────────────── */
.clash-clean {
  display: flex; align-items: center; gap: 12px;
  margin-top: 10px; padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255,210,0,0.06);
  border: 1px solid rgba(255,210,0,0.2);
}
.clash-clean-trophy { font-size: 28px; line-height: 1; flex-shrink: 0; }
.clash-clean-body { display: flex; flex-direction: column; gap: 2px; }
.clash-clean-names { font-size: 16px; font-weight: 700; color: #ffd200; }
.clash-clean-label { font-size: 12px; color: var(--text-dim); }

.clash-list { display: flex; flex-direction: column; gap: 10px; }

.clash-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: var(--surface); border: 1px solid var(--border);
}

.clash-player {
  font-size: 15px; font-weight: 700; color: #fff;
  width: 62px; flex-shrink: 0; padding-top: 1px;
}

.clash-groups { display: flex; flex-direction: column; gap: 6px; flex: 1; }

.clash-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.clash-group-label {
  font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
  color: #ffd200; background: rgba(255,210,0,0.1);
  border: 1px solid rgba(255,210,0,0.25);
  border-radius: 4px; padding: 2px 6px; flex-shrink: 0;
}

.clash-teams { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.clash-team { display: flex; align-items: center; gap: 4px; }
.clash-flag { font-size: 18px; line-height: 1; }
.clash-team-name { font-size: 13px; font-weight: 600; color: var(--text-dim); }
.clash-vs {
  font-size: 11px; font-weight: 800; letter-spacing: .06em;
  color: var(--text-dim); opacity: 0.4;
}

/* ── Section link ─────────────────────────────────────────────── */
.section-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-title-row .view-title { margin-bottom: 0; }
.section-link-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 99px;
  border: 1px solid var(--border); background: transparent;
  color: var(--text-dim); font-size: 11px; font-weight: 700;
  letter-spacing: .04em; cursor: pointer;
  transition: color .15s, border-color .15s;
}
.section-link-btn:hover { color: var(--cyan); border-color: rgba(0,229,255,0.4); }

/* ── Pool Matchups ────────────────────────────────────────────── */
.mu-summary { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }

.mu-chip {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 12px; border-radius: 99px; border: 1px solid;
}
.mu-chip-type { font-size: 14px; font-weight: 800; letter-spacing: .04em; }
.mu-chip-count {
  font-size: 13px; font-weight: 800;
  background: rgba(255,255,255,0.1); border-radius: 99px;
  padding: 1px 7px; color: #fff;
}

.mu-intensity-low    { background: rgba(255,255,255,0.05); color: var(--text-dim); border-color: var(--border); }
.mu-intensity-medium { background: rgba(0,229,255,0.08);   color: #00e5ff;         border-color: rgba(0,229,255,0.3); }
.mu-intensity-high   { background: rgba(189,95,255,0.10);  color: var(--purple);   border-color: rgba(189,95,255,0.35); }
.mu-intensity-max    { background: rgba(255,45,120,0.10);  color: #ff6fa0;         border-color: rgba(255,45,120,0.35); }

.mu-group { margin-bottom: 16px; }
.mu-group-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.mu-badge {
  font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 6px; border: 1px solid;
}
.mu-group-sub { font-size: 13px; color: var(--text-dim); }

.mu-list {}
.mu-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
}
.mu-row--div { border-top: 1px solid var(--border); }
.mu-date {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  color: var(--cyan); white-space: nowrap; flex-shrink: 0; width: 42px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
}
.mu-today-badge {
  font-size: 8px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase;
  padding: 1px 5px; border-radius: 99px; white-space: nowrap;
  background: var(--accent); color: var(--bg);
}
.mu-sides { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.mu-side { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.mu-side--right { justify-content: flex-end; text-align: right; }
.mu-flag { font-size: 20px; line-height: 1; flex-shrink: 0; }
.mu-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.mu-info--right { align-items: flex-end; }
.mu-team { font-size: 14px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mu-players { font-size: 11px; font-weight: 600; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mu-row--done { opacity: 0.5; }
.mu-center { display: flex; flex-direction: column; align-items: center; gap: 1px; flex-shrink: 0; }
.mu-vs { font-size: 11px; font-weight: 800; color: var(--text-dim); letter-spacing: .06em; }
.mu-score { font-size: 13px; font-weight: 800; color: #fff; letter-spacing: .04em; }
.mu-ft { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--text-dim); }
.mu-player-both { color: var(--green); font-weight: 800; }

/* ── Desktop Leaderboard ──────────────────────────────────────────── */
.lb-header { display: none; }

@media (min-width: 768px) {
  .lb-header {
    display: grid;
    grid-template-columns: 44px 1fr 180px 195px 90px;
    gap: 0 16px;
    padding: 0 20px 8px;
    font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    color: var(--text-dim);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 6px;
  }
  .lb-header-pts { text-align: right; padding-right: 4px; }

  .lb-row { position: relative; }
  .lb-row::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: var(--pts-pct, 0%);
    background: rgba(0,255,159,0.055);
    pointer-events: none;
    transition: width .8s cubic-bezier(.4,0,.2,1);
  }
  .lb-row--first::before { background: rgba(0,255,159,0.09); }

  .lb-main {
    display: grid;
    grid-template-columns: 44px 1fr 180px 195px 90px;
    align-items: center;
    gap: 0 16px;
    padding: 12px 20px;
  }
  .lb-center { display: contents; }

  .lb-name { font-size: 20px; }

  .lb-flags { gap: 5px; }
  .lb-flag { font-size: 26px; }

  .lb-stats-row { margin-top: 0; justify-content: space-between; }
  .lb-stat { padding-top: 0; }
  .lb-stat-value { font-size: 16px; }

  .lb-pts { font-size: 24px; text-align: right; }
  .lb-pts-label { font-size: 14px; }

  .lb-rank { width: 32px; height: 32px; font-size: 15px; }

  .lb-breakdown {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px 16px;
    padding: 10px 20px 16px;
  }
}

/* ── Match Day Points Grid ────────────────────────────────────────── */
.lb-daygrid {
  border-top: 1px solid var(--border);
  padding: 10px 16px 14px;
  display: flex; flex-direction: column; gap: 8px;
}
.lb-daygrid-label {
  font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: var(--text-dim);
}
.lb-daygrid-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.lb-day-divider {
  width: 100%; display: flex; align-items: center; gap: 6px;
  color: var(--accent); font-size: 9px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  margin: 2px 0;
}
.lb-day-divider--start { margin-top: 0; }
.lb-day-divider::before, .lb-day-divider::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,45,120,0.4), transparent);
}
.lb-day-chip {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 5px 9px; border-radius: 8px;
  background: var(--surface2); border: 1px solid var(--border);
  min-width: 54px; cursor: pointer;
  transition: border-color .15s;
}
.lb-day-chip:hover { border-color: rgba(0,229,255,0.4); }
.lb-day-date {
  font-size: 9px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  color: var(--text-dim); white-space: nowrap;
}
.lb-day-pts { font-size: 13px; font-weight: 800; color: var(--green); }
.lb-day-chip--zero .lb-day-pts { color: var(--text-dim); }
.lb-day-chip--zero { opacity: 0.5; }
.lb-day-chip--high {
  background: rgba(255,45,120,0.1);
  border-color: rgba(189,95,255,0.5);
  box-shadow: 0 0 10px rgba(255,45,120,0.18), 0 0 4px rgba(189,95,255,0.2);
}
.lb-day-chip--high .lb-day-date { color: rgba(255,130,200,0.85); }
.lb-day-chip--high .lb-day-pts {
  background: linear-gradient(90deg, #ff2d78 0%, #bd5fff 35%, #ff79c6 55%, #ff2d78 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lb-day-shimmer 2s linear infinite;
}
.lb-day-chip--ultra {
  background: rgba(255,120,0,0.12);
  border-color: rgba(255,160,0,0.55);
  box-shadow: 0 0 12px rgba(255,100,0,0.25), 0 0 4px rgba(255,200,0,0.2);
}
.lb-day-chip--ultra .lb-day-date { color: rgba(255,180,80,0.9); }
.lb-day-chip--ultra .lb-day-pts {
  background: linear-gradient(90deg, #ff4500 0%, #ffb300 40%, #ff8c00 60%, #ff4500 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lb-day-shimmer 1.6s linear infinite;
}

@keyframes lb-day-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

@media (min-width: 768px) {
  .lb-daygrid { padding: 10px 20px 16px; }
}

/* ── Best Single Days Chart ───────────────────────────────────────── */
.best-days-card { padding: 14px 14px 12px; margin-bottom: 16px; }
.best-days-svg { width: 100%; display: block; overflow: visible; }
.best-days-names { display: flex; margin-top: 8px; }
.best-days-name-col {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  min-width: 0; padding: 0 1px;
}
.best-days-name {
  font-size: 11px; font-weight: 700; color: var(--text-dim);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
}
.best-days-vals { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; }
.best-days-val { font-size: 12px; font-weight: 800; line-height: 1; }
.best-days-legend { display: flex; gap: 14px; margin-top: 10px; }
.bd-leg { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-dim); }
.bd-dot { width: 9px; height: 9px; border-radius: 2px; flex-shrink: 0; }

@media (max-width: 767px) {
  .lb-tooltip-wrap { -webkit-tap-highlight-color: transparent; }
  .lb-tooltip {
    position: fixed;
    top: auto;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    left: 16px;
    right: 16px;
    max-width: none;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 10px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .lb-tooltip::after { display: none; }
  .lb-badges { gap: 8px; }
  .lb-tooltip-wrap[tabindex] { min-height: 28px; display: inline-flex; align-items: center; }
}
</style>
