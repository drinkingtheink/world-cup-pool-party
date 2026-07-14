<template>
  <div class="view">
    <p class="view-title">Full Tournament Stats</p>

    <div class="tourney-stats card">
      <div class="tourney-stats-row">
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
      <div class="tourney-stats-row tourney-stats-row--days">
        <div class="stat-item">
          <span class="stat-value">{{ daysToGo }}</span>
          <span class="stat-label">Days to Go</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ teamsRemaining }}</span>
          <span class="stat-label">Teams Left</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ gamesRemaining }}</span>
          <span class="stat-label">Games Remaining</span>
        </div>
      </div>
    </div>

    <div class="purse-section">
      <!-- vaporwave scene -->
      <div class="purse-scene">
        <div class="purse-sky"><div class="purse-stars"></div></div>
        <div class="purse-mountains"></div>
        <div class="purse-sun-wrap">
          <svg class="purse-sun" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="psg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#ff9de2"/>
                <stop offset="42%"  stop-color="#ff2d78"/>
                <stop offset="100%" stop-color="#ffb800"/>
              </linearGradient>
              <clipPath id="psc"><rect x="0" y="0" width="200" height="100"/></clipPath>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#psg)" clip-path="url(#psc)"/>
            <rect x="0" y="46" width="200" height="3.5" fill="#080612"/>
            <rect x="0" y="55" width="200" height="4.5" fill="#080612"/>
            <rect x="0" y="65" width="200" height="6"   fill="#080612"/>
            <rect x="0" y="76" width="200" height="7.5" fill="#080612"/>
            <rect x="0" y="88" width="200" height="9.5" fill="#080612"/>
          </svg>
        </div>
        <div class="purse-horizon"></div>
        <div class="purse-grid-wrap"><div class="purse-grid"></div></div>
        <div class="purse-sweep"></div>
        <div class="purse-scanlines"></div>
        <div class="purse-crt"></div>
      </div>
      <p class="purse-title">💰 Prize Pool</p>
      <div class="purse-podium">
        <div class="purse-place purse-place--2">
          <span class="purse-medal">🥈</span>
          <span class="purse-label">2nd</span>
          <span class="purse-amount">$100</span>
        </div>
        <div class="purse-place purse-place--1">
          <span class="purse-medal">🥇</span>
          <span class="purse-label">1st</span>
          <span class="purse-amount">$200</span>
        </div>
        <div class="purse-place purse-place--3">
          <span class="purse-medal">🥉</span>
          <span class="purse-label">3rd</span>
          <span class="purse-amount">$50</span>
        </div>
      </div>
      <button class="purse-path-link" @click.stop="scrollToPrize">Path To The Prize >></button>
    </div>

    <div class="leaderboard">
      <div class="lb-header">
        <span></span>
        <span>Player</span>
        <span>Teams &amp; Stats</span>
        <span class="lb-header-pts">Points</span>
      </div>

      <div
        v-for="(entry, i) in store.leaderboard"
        :key="entry.name"
        class="lb-row card"
        :class="{ 'lb-row--first': entry.rank === 1, 'lb-row--critical': lastLeg.has(entry.name), 'lb-row--low-health': treadingWater.has(entry.name) }"
        :style="{ '--i': i }"
        @click="expanded = expanded === entry.name ? null : entry.name"
      >
        <div class="lb-main">
          <span class="lb-rank" :class="rankClass(entry.rank)">{{ entry.rank }}</span>
          <div class="lb-center">
            <div class="lb-name-row">
              <div class="lb-name-line">
                <span class="lb-name" :class="{ 'lb-name--shimmer': entry.name === pointsLeader, 'lb-name--vaporfire': trending.holders.has(entry.name) && entry.name !== pointsLeader, 'lb-name--critical': lastLeg.has(entry.name), 'lb-name--low-health': treadingWater.has(entry.name) && !lastLeg.has(entry.name) }">{{ entry.name }}</span><span v-if="entry.name === pointsLeader" class="lb-name-crown" aria-hidden="true">👑</span><span v-if="groundskeeper.holders.has(entry.name)" class="lb-name-lifeguard" title="LG Duty">🛟</span><span v-if="goldenGlove.holders.has(entry.name)" class="lb-name-glove" title="Gold Glove">🧤</span><span v-if="positionChange.risers.has(entry.name)" class="lb-name-rocket" aria-hidden="true">🚀</span><span v-if="goldenBoot.holders.has(entry.name) || goldenBootGroup.holders.has(entry.name) || goldenBootKnockout.holders.has(entry.name)" class="lb-name-boot" title="Gold Boot">⚡</span>
                <span v-if="lastLeg.has(entry.name)" class="lb-teams-left lb-teams-left--critical">1 Team Left</span>
                <span v-else-if="treadingWater.has(entry.name)" class="lb-teams-left lb-teams-left--low">2 Teams Left</span>
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
                <span v-if="entry.name === 'Jason'" class="lb-shield lb-tooltip-wrap" tabindex="0">🏆 {{ communityShieldPts }}<span class="lb-tooltip">Community Shield — most points through Group Stage</span></span>
                <span v-if="groupStagePts[entry.name] > 0 && gsPointsRank[entry.name] !== 1" class="lb-gs-pts lb-tooltip-wrap" :class="{ 'lb-gs-pts--silver': gsPointsRank[entry.name] === 2, 'lb-gs-pts--bronze': gsPointsRank[entry.name] === 3 }" tabindex="0">{{ gsPointsRank[entry.name] === 2 ? '🥈' : gsPointsRank[entry.name] === 3 ? '🥉' : '🌊' }} GS {{ groupStagePts[entry.name] }}<span class="lb-tooltip">{{ gsPointsRank[entry.name] === 2 ? '2nd most' : gsPointsRank[entry.name] === 3 ? '3rd most' : '' }} Points earned during the Group Stage</span></span>
                <span v-if="goldenBootGroup.holders.has(entry.name)" class="lb-golden-boot lb-tooltip-wrap" tabindex="0">⚡ GB - GS {{ goldenBootGroup.goals }}<span class="lb-tooltip">Gold Boot — most goals scored in the Group Stage</span></span>
                <span v-if="goldenBootKnockout.holders.has(entry.name)" class="lb-golden-boot-ko lb-tooltip-wrap" tabindex="0">⚡ GB - KO {{ goldenBootKnockout.goals }}<span class="lb-tooltip">Gold Boot — most goals scored in the Knockout Rounds</span></span>
                <span v-if="trending.holders.has(entry.name)" class="lb-trending lb-tooltip-wrap" tabindex="0">🔥 Trending<span class="lb-tooltip">Most points over the last 3 matchdays (+{{ trending.pts }})</span></span>
                <span v-if="positionChange.risers.has(entry.name)" class="lb-on-the-rise lb-tooltip-wrap" tabindex="0">🚀 On the Rise<span class="lb-tooltip">Biggest jump in the standings since yesterday (+{{ positionChange.riseCount }} place{{ positionChange.riseCount !== 1 ? 's' : '' }})</span></span>
                <span v-if="positionChange.fallers.has(entry.name)" class="lb-sinker lb-tooltip-wrap" tabindex="0">🪨 Sinker<span class="lb-tooltip">Biggest drop in the standings since yesterday (-{{ positionChange.fallCount }} place{{ positionChange.fallCount !== 1 ? 's' : '' }})</span></span>
                <span v-if="entry.name === pointsLeader" class="lb-setting-pace lb-tooltip-wrap" tabindex="0">🏊 Pacer<span class="lb-tooltip">Current points leader</span></span>
                <span v-if="firstTimeLead.holders.has(entry.name)" class="lb-first-lead lb-tooltip-wrap" tabindex="0">🌊 1st Wave<span class="lb-tooltip">First time reaching 1st place in the pool</span></span>
                <span v-if="madeWaves[entry.name]" class="lb-made-waves lb-tooltip-wrap" tabindex="0">{{ madeWaves[entry.name] === madeWavesMax ? '👑' : '' }}🌊 {{ madeWaves[entry.name] }}d<span class="lb-tooltip">Made Waves — led the pool on {{ madeWaves[entry.name] }} match day{{ madeWaves[entry.name] !== 1 ? 's' : '' }}</span></span>
                <span v-if="entry.name === 'Jason' && pointsLeader === 'Jason'" class="lb-foia lb-tooltip-wrap" tabindex="0">📋 FOIA<span class="lb-tooltip">Yes, Jason is leading but the data is public and can be shared if you are interested. What's your Github @?</span></span>
                <span v-if="inTheChase.holders.has(entry.name)" class="lb-in-the-chase lb-tooltip-wrap" tabindex="0">🎯 -{{ inTheChase.gaps[entry.name] }}<span class="lb-tooltip">Chasing — within {{ inTheChase.threshold }} pts of the leader</span></span>
                <span v-if="inReach.holders.has(entry.name)" class="lb-in-reach lb-tooltip-wrap" tabindex="0">📡 -{{ inReach.gaps[entry.name] }}<span class="lb-tooltip">In Reach — within {{ IN_REACH_THRESHOLD }} pts of the leader</span></span>
                <span v-if="beyondReach[entry.name]" class="lb-beyond-reach lb-tooltip-wrap" tabindex="0">−{{ beyondReach[entry.name] }} pts<span class="lb-tooltip">Points behind the leader</span></span>
                <span v-if="entry.teams.includes('USA')" class="lb-real-american lb-tooltip-wrap" tabindex="0">🦅🇺🇸<span class="lb-tooltip">Real American — picked the US in their Pool</span></span>
                <span v-if="entry.teams.includes('England')" class="lb-imperialism lb-tooltip-wrap" tabindex="0">👌🏴󠁧󠁢󠁥󠁮󠁧󠁿<span class="lb-tooltip">Ok with Imperialism — This player is admitting their implicit support for the imperialistic atrocities of England upon the nations they occupied. ¯\_(ツ)_/¯</span></span>
                <span v-if="ballsy.holders.has(entry.name)" class="lb-ballsy lb-tooltip-wrap" tabindex="0">💪 Ballsy<span class="lb-tooltip">Below average European teams picked (avg: {{ ballsy.avg }})</span></span>
                <span v-if="herdMentality.holders.has(entry.name)" class="lb-herd lb-tooltip-wrap" tabindex="0">🍍 Pro-Poly<span class="lb-tooltip">Most teams shared with other players in the pool</span></span>
                <span v-if="goYourOwnWay.holders.has(entry.name)" class="lb-go-own-way lb-tooltip-wrap" tabindex="0">🥁 Diff Beat<span class="lb-tooltip">Most teams no one else picked ({{ goYourOwnWay.count }})</span></span>
                <span v-if="eskimoBros.holders.has(entry.name)" class="lb-eskimo-bros lb-tooltip-wrap" tabindex="0">🛁 'Cuzzi Bros<span class="lb-tooltip">All picked {{ eskimoBros.team }} — the most-shared team in the pool ({{ eskimoBros.count }} players)</span></span>
                <span v-if="goldenGlove.holders.has(entry.name)" class="lb-golden-glove lb-tooltip-wrap" tabindex="0">🧤 GG {{ goldenGlove.conceded }}<span class="lb-tooltip">Gold Glove — fewest goals conceded in the Group Stage</span></span>
                <span v-if="clinical.holders.has(entry.name)" class="lb-clinical lb-tooltip-wrap" tabindex="0">🎯 Clinical<span class="lb-tooltip">Most goals per game across all teams ({{ clinical.gpg }} g/g)</span></span>
                <span v-if="peakGPG.holders.has(entry.name)" class="lb-peak-gpg lb-tooltip-wrap" tabindex="0">📈 {{ peakGPG.gpg }} g/g<span class="lb-tooltip">Peak GPG — all-time highest goals per game average ever achieved in this pool</span></span>
                <span v-if="coldBoots.holders.has(entry.name)" class="lb-shrinkage lb-tooltip-wrap" tabindex="0">🧊 Shrinkage<span class="lb-tooltip">Fewest goals scored in the Group Stage ({{ coldBoots.scored }})</span></span>
                <span v-if="comebackKid.holders.has(entry.name)" class="lb-comeback lb-tooltip-wrap" tabindex="0">🪃 {{ comebackKid.count }}<span class="lb-tooltip">Comeback Kid — most comeback wins (teams that trailed but won)</span></span>
                <span v-if="mostDraws.holders.has(entry.name)" class="lb-most-draws lb-tooltip-wrap" tabindex="0">🪄 Wiz {{ mostDraws.count }}<span class="lb-tooltip">Wash Wizard — most draws across all teams</span></span>
                <span v-if="cleanPool.holders.has(entry.name)" class="lb-clean-pool lb-tooltip-wrap" tabindex="0">🧽 Spotless<span class="lb-tooltip">Fewest total cards across all teams ({{ cleanPool.count }}) with zero red cards</span></span>
                <span v-if="dirtyPool.counts[entry.name] > 0" class="lb-dirty-pool lb-tooltip-wrap" :class="{ 'lb-dirty-pool--leader': dirtyPool.holders.has(entry.name) }" tabindex="0">{{ dirtyPool.holders.has(entry.name) ? '👑' : '' }}🟨 {{ dirtyPool.counts[entry.name] }}<span class="lb-tooltip">{{ dirtyPool.holders.has(entry.name) ? 'Dirty Pool — most yellow cards across all teams' : 'Your yellow card count' }}</span></span>
                <span v-if="iMeanCmon.holders.has(entry.name)" class="lb-i-mean-cmon lb-tooltip-wrap" tabindex="0">🙄 Puhleez<span class="lb-tooltip">Highest-ranked pools by avg FIFA ranking</span></span>
                <span v-if="madGenius.holders.has(entry.name)" class="lb-mad-genius lb-tooltip-wrap" tabindex="0">💡 Mad Genius?<span class="lb-tooltip">Least likely pool to win the tournament based on pre-tournament odds</span></span>
                <span v-if="bellyFlop.holders.has(entry.name)" class="lb-belly-flop lb-tooltip-wrap" tabindex="0">🫃 Swim Test<span class="lb-tooltip">Lowest-ranked pool by avg FIFA ranking (avg: #{{ bellyFlop.avg }})</span></span>
                <span v-if="earlyShower.counts[entry.name] > 0" class="lb-dirty-pool-plus lb-tooltip-wrap" :class="{ 'lb-dirty-pool-plus--leader': earlyShower.holders.has(entry.name) }" tabindex="0">{{ earlyShower.holders.has(entry.name) ? '👑' : '' }}🟥 {{ earlyShower.counts[entry.name] }}<span class="lb-tooltip">{{ earlyShower.holders.has(entry.name) ? 'Dirty Pool+ — most red cards across all teams' : 'Your red card count' }}</span></span>
                <span v-if="lateShow.perPlayer[entry.name] > 0" class="lb-late-show lb-tooltip-wrap" :class="{ 'lb-late-show--leader': lateShow.holders.has(entry.name) }" tabindex="0">{{ lateShow.holders.has(entry.name) ? '👑' : '' }}🌙 {{ lateShow.perPlayer[entry.name] }}<span class="lb-tooltip">{{ lateShow.holders.has(entry.name) ? 'Late Show leader — most goals after the 80th minute' : 'Goals scored after the 80th minute' }} ({{ lateShow.perPlayer[entry.name] }})</span></span>
                <span v-if="twoPumpChump.holders.has(entry.name)" class="lb-two-pump lb-tooltip-wrap" tabindex="0">💦 Early Finisher<span class="lb-tooltip">Majority of goals scored in the first half</span></span>
                <span v-if="goldenBoot.holders.has(entry.name)" class="lb-golden-boot-overall lb-tooltip-wrap" tabindex="0">⚡ GB {{ goldenBoot.goals }}<span class="lb-tooltip">Overall Gold Boot — most total goals scored</span></span>
                <span v-if="playerMatchDays[entry.name].today === 0" class="lb-poolside lb-tooltip-wrap" tabindex="0">🍹 Poolside<span class="lb-tooltip">No matches scheduled today</span></span>
                <span v-if="floaties.has(entry.name)" class="lb-floaties lb-tooltip-wrap" tabindex="0">🤽 Floaties<span class="lb-tooltip">4 or more teams still alive</span></span>
                <span v-if="halfDead.has(entry.name)" class="lb-half-dead lb-tooltip-wrap" tabindex="0">🐟 1/2 Sunk<span class="lb-tooltip">Half your teams have been eliminated</span></span>
                <span v-if="treadingWater.has(entry.name)" class="lb-treading-water lb-tooltip-wrap" tabindex="0">🏊 Undertow<span class="lb-tooltip">Only 2 teams still alive</span></span>
                <span v-if="lastLeg.has(entry.name)" class="lb-last-leg lb-tooltip-wrap" tabindex="0">🦵 Last Leg<span class="lb-tooltip">Only 1 team still alive</span></span>
                <span v-if="poolBully.holders.has(entry.name)" class="lb-pool-bully lb-tooltip-wrap" tabindex="0">😤 Pool Bully<span class="lb-tooltip">Most knockout wins against other pool players ({{ poolBully.wins }})</span></span>
                <span v-if="washedUp.holders.has(entry.name)" class="lb-washed-up lb-tooltip-wrap" tabindex="0">🧼 Washed Up<span class="lb-tooltip">First pool player with all teams eliminated</span></span>
                <span v-if="outOfPool.has(entry.name)" class="lb-out-of-pool lb-tooltip-wrap" tabindex="0">🚿 Out of the Pool<span class="lb-tooltip">All teams eliminated</span></span>
                <span v-if="groundskeeper.holders.has(entry.name)" class="lb-groundskeeper lb-tooltip-wrap" tabindex="0">🛟 LG Duty<span class="lb-tooltip">Lifeguard Duty — most clubs eliminated from the Pool ({{ groundskeeper.count }})</span></span>
                <span v-if="backToBack.holders.has(entry.name)" class="lb-back-to-back lb-tooltip-wrap" tabindex="0">🥇 2 20+<span class="lb-tooltip">Back to Back 20+ point match days</span></span>
                <span v-if="bestSingleDay.holders.has(entry.name)" class="lb-best-day lb-tooltip-wrap" tabindex="0">🥇 +{{ bestSingleDay.pts }}<span class="lb-tooltip">Best single-day points total</span></span>
                <span v-if="secondBestSingleDay.holders.has(entry.name)" class="lb-second-day lb-tooltip-wrap" tabindex="0">🥈 +{{ secondBestSingleDay.pts }}<span class="lb-tooltip">2nd best single-day points total</span></span>
                <span v-if="winPathMap[entry.name]" class="lb-prize-path lb-tooltip-wrap" :class="winPathMap[entry.name].can ? 'lb-prize-path--alive' : winPathMap[entry.name].bestFinish <= 3 ? 'lb-prize-path--podium' : 'lb-prize-path--out'" tabindex="0">{{ winPathMap[entry.name].can ? '⚡ In It' : winPathMap[entry.name].bestFinish === 2 ? '🥈 2nd Max' : winPathMap[entry.name].bestFinish === 3 ? '🥉 3rd Max' : '🚫 No Path' }}<span class="lb-tooltip">Prize Path — {{ winPathMap[entry.name].path }}</span></span>
                <span v-if="mathElim[entry.name]" class="lb-math-elim lb-tooltip-wrap" tabindex="0">🚫 {{ fmtDate(mathElim[entry.name].date) }}<span class="lb-tooltip">Mathematically eliminated from pool contention on {{ fmtDate(mathElim[entry.name].date) }} · {{ mathElim[entry.name].days }} day{{ mathElim[entry.name].days !== 1 ? 's' : '' }} ago</span></span>
                <span v-if="!entry.teams.includes('USA')" class="lb-sus lb-tooltip-wrap" tabindex="0">👀 sus<span class="lb-tooltip">Did not select the US in their pool. The US Government has been notified.</span></span>
              </div>
              <span class="lb-today-tomorrow">
                <span class="lb-tt-label">MATCHES:</span> {{ playerMatchDays[entry.name].today }} Today<template v-if="playerMatchDays[entry.name].todayTeams > playerMatchDays[entry.name].today"> · {{ playerMatchDays[entry.name].todayTeams }} Teams</template>
                <span class="lb-tt-sep">/</span>
                {{ playerMatchDays[entry.name].tomorrow }} Tomorrow
              </span>
            </div>
          </div>
          <div class="lb-right">
            <div class="lb-flags">
              <span v-for="team in rankedTeams(entry.teams)" :key="team" class="lb-flag" :class="{ 'lb-flag--eliminated': ELIMINATED_TEAMS.has(team) }" :title="team"><span class="lb-flag-emoji">{{ FLAG_MAP[team] ?? '🏳' }}</span><span v-if="ELIMINATED_TEAMS.has(team)" class="lb-flag-x">✕</span></span>
            </div>
            <div class="lb-stats-row">
              <span class="lb-stat"><span class="lb-stat-value">{{ playerGamesPlayed[entry.name].played }}</span><span class="lb-stat-label">Matches</span></span>
              <span class="lb-stat">
                <span class="lb-stat-value lb-tooltip-wrap" :class="{ 'lb-stat-value--shimmer': playerGoals[entry.name] === maxPlayerGoals }" :tabindex="playerGoals[entry.name] === maxPlayerGoals ? 0 : -1">
                  {{ playerGoals[entry.name] }}
                  <span v-if="playerGoals[entry.name] === maxPlayerGoals" class="lb-tooltip">Most goals scored in the pool ({{ maxPlayerGoals }})</span>
                </span>
                <span class="lb-stat-label">Goals</span>
              </span>
              <span class="lb-stat">
                <span class="lb-stat-value lb-tooltip-wrap" :class="{ 'lb-stat-value--shimmer': playerGoalsPerGame[entry.name] !== '—' && Number(playerGoalsPerGame[entry.name]) === maxPlayerGpg }" :tabindex="playerGoalsPerGame[entry.name] !== '—' && Number(playerGoalsPerGame[entry.name]) === maxPlayerGpg ? 0 : -1">
                  {{ playerGoalsPerGame[entry.name] }}
                  <span v-if="playerGoalsPerGame[entry.name] !== '—' && Number(playerGoalsPerGame[entry.name]) === maxPlayerGpg" class="lb-tooltip">Best goals per game in the pool ({{ maxPlayerGpg.toFixed(2) }} g/g)</span>
                </span>
                <span class="lb-stat-label">Goals/Game</span>
              </span>
            </div>
          </div>
          <span class="lb-pts">{{ entry.total }} <span class="lb-pts-label">pts</span></span>
        </div>

        <button class="lb-player-link" @click.stop="router.push({ path: '/my-teams', query: { player: entry.name } })">
          View {{ entry.name }}'s Teams &amp; Stats
        </button>

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
                <template v-for="(d, di) in playerPointsByDate[entry.name]" :key="d.date">
                  <div v-if="lastGroupDate && d.date > lastGroupDate && (di === 0 || playerPointsByDate[entry.name][di - 1].date <= lastGroupDate)" class="lb-day-divider">
                    <span class="lb-day-divider-label">Knockout Rounds</span>
                  </div>
                  <div
                    class="lb-day-chip"
                    :class="{ 'lb-day-chip--zero': d.pts === 0, 'lb-day-chip--high': d.pts >= 10 && d.pts < 20, 'lb-day-chip--ultra': d.pts >= 20 }"
                    @click.stop="router.push({ path: '/matches', hash: '#date-' + d.date })"
                  >
                    <span class="lb-day-date">{{ fmtDate(d.date) }}</span>
                    <span class="lb-day-pts">+{{ fmt(d.pts) }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <p v-if="!store.leaderboard.length" class="empty-msg">No data yet</p>
    </div>

    <p id="path-to-prize" class="view-title" style="margin-top:28px">Path To The Prize 💰</p>
    <p class="strength-sub">What needs to happen for each player to win the pool</p>
    <p class="win-path-disclaimer">Calculated before the Semifinals</p>
    <div class="win-path-list">
      <div
        v-for="entry in winPathEntries"
        :key="entry.name"
        class="win-path-row card"
        :class="entry.can ? 'win-path-row--alive' : entry.bestFinish <= 3 ? 'win-path-row--out' : 'win-path-row--dead'"
      >
        <div class="win-path-header">
          <span class="win-path-name">{{ entry.name }}</span>
          <span class="win-path-badge" :class="entry.can ? 'win-path-badge--alive' : entry.bestFinish <= 3 ? 'win-path-badge--podium' : 'win-path-badge--out'">
            {{ entry.can ? '⚡ In It' : entry.bestFinish === 2 ? '🥈 2nd Max' : entry.bestFinish === 3 ? '🥉 3rd Max' : '🚫 No Path' }}
          </span>
        </div>
        <p class="win-path-text">{{ entry.path }}</p>
        <template v-if="entry.path2">
          <p class="win-path-sensitivity-label">Score Sensitivity</p>
          <p class="win-path-text win-path-text--2">{{ entry.path2 }}</p>
        </template>
      </div>
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
    <p class="strength-sub">Matches across all stages where players have skin in the game on both sides</p>
    <div class="card elim-feed">
      <div v-for="e in poolEliminations" :key="e.loserTeam + e.date" class="elim-row">
        <div class="elim-meta">
          <span class="elim-stage">{{ e.stage }}</span>
          <span class="elim-date">{{ fmtDate(e.date) }}</span>
        </div>
        <div class="elim-matchup">
          <div class="elim-winner">
            <span class="elim-flag">{{ FLAG_MAP[e.winnerTeam] ?? '🏳' }}</span>
            <div>
              <span class="elim-team">{{ e.winnerTeam }}</span>
              <span class="elim-players elim-players--killer">{{ e.killers.join(', ') }}</span>
            </div>
          </div>
          <span class="elim-score">{{ e.score }}{{ e.penWinner ? ' (P)' : '' }}</span>
          <div class="elim-loser">
            <div class="elim-info--right">
              <span class="elim-team">{{ e.loserTeam }}</span>
              <span class="elim-players elim-players--victim">{{ e.victims.join(', ') }}</span>
            </div>
            <span class="elim-flag">{{ FLAG_MAP[e.loserTeam] ?? '🏳' }}</span>
          </div>
        </div>
      </div>
      <p v-if="!poolEliminations.length" class="elim-empty">No pool player eliminations yet</p>
    </div>
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
import { Link2, Check } from 'lucide-vue-next'
import { usePoolStore } from '../stores/pool.js'
import { quotes, FLAG_MAP, ELIMINATED_TEAMS, tiers } from '../data/index.js'
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

const MATH_ELIM_DATA = {
  Charley: { date: '2026-07-11', detail: "Norway lost to England in the QF — his last independent team gone. Jay went 4.5pts clear with the same England upside remaining." },
  Gabe:    { date: '2026-07-10', detail: "Spain beat Belgium in the QF, giving Jay 12pts Gabe couldn't share. Jay went 10pts clear." },
  Dan:     { date: '2026-07-05', detail: "Mexico and Brazil were eliminated in the R16, leaving only Spain. Jared already held a 26.5pt lead with the same Spain upside." },
  James:   { date: '2026-07-07', detail: "Colombia lost on penalties in the R16 — his last independent team gone. Jared was 51pts ahead with the same Spain remaining." },
}

const mathElim = computed(() => {
  const result = {}
  Object.entries(MATH_ELIM_DATA).forEach(([name, data]) => {
    const elimMs = new Date(data.date).getTime()
    const todayMs = new Date(today).getTime()
    const days = Math.round((todayMs - elimMs) / 86400000)
    result[name] = { ...data, days }
  })
  return result
})

const WIN_PATHS = [
  { name: 'Tommy',   can: true,  bestFinish: 1,
    path:  'Argentina wins the Final — either opponent works.',
    path2: 'Both routes are bulletproof. Even 1-0 wins all the way add 28pts and you win every scenario by 20+ points. No scoreline dependency.' },
  { name: 'Jared',   can: true,  bestFinish: 1,
    path:  'Spain beats Argentina in the Final. A Spain vs England Final is a genuine toss-up with Jay — too close to call.',
    path2: 'Spain vs Argentina is solid — Spain earns SF and Final points while Tommy only picks up Argentina\'s SF. At estimated scoring you lead Tommy by ~15pts. The only danger: Argentina has a great SF AND Spain is flat at the same time.' },
  { name: 'Jason',   can: true,  bestFinish: 1,
    path:  'France wins the Final — either opponent works.',
    path2: 'France vs England is bulletproof — Tommy and Jared earn nothing more so you win regardless of scorelines. France vs Argentina is score-dependent: you lead Tommy by ~4.5pts at estimated scoring, but a flat France run (1-0 both games) flips it to Tommy.' },
  { name: 'Jay',     can: true,  bestFinish: 1,
    path:  'England beats France or Argentina in the Final. A Spain vs England Final is a toss-up with Jared.',
    path2: 'England vs France is solid and score-independent — your 4.5pt head start over Charley is permanent since you share all remaining England points. The Spain-England scenario is the coin-flip: one England goal in the SF could be the difference between you and Jared for 1st.' },
  { name: 'Charley', can: false, bestFinish: 2,
    path:  "Can't win 1st — Jay always beats him when England wins. But he can finish 2nd if England wins the Final against either opponent.",
    path2: '2nd place is locked in regardless of scorelines — you and Jay always earn identical England points from here, so your 4.5pt gap to him is permanent. You also stay 5.5pts clear of Gabe for the same reason. Solid podium.' },
  { name: 'Gabe',    can: false, bestFinish: 3,
    path:  "Can't win 1st — 10pts behind Jay with the same England upside. Can still finish 3rd if England wins the Final.",
    path2: 'England beats France: 3rd is secure and score-independent. England beats Spain: precarious — you edge Jared for 3rd by an estimated 0.5pts. One extra Spain goal in the SF and Jared jumps you.' },
  { name: 'Dan',     can: false, bestFinish: 3,
    path:  "Can't win 1st — Jared always beats him when Spain wins. Can still finish 3rd if Spain wins the Final against either opponent.",
    path2: 'Spain vs Argentina: 3rd is comfortable — you lead Jay by ~10pts since you earn Final points and he doesn\'t. Spain vs England: tight — you lead Tommy by just ~2pts at estimated scoring. Flat Spain performances close that margin fast.' },
  { name: 'James',   can: false, bestFinish: 5,
    path:  'No prize path. Even a Spain title gets him to ~176pts — Tommy is already sitting at 193.',
    path2: "Didn't work out for you this Cup, but you'll always have a saved seat next to your favorite 'cuzzi jet." },
]

const winPathEntries = computed(() =>
  store.leaderboard.map(e => WIN_PATHS.find(p => p.name === e.name)).filter(Boolean)
)

const winPathMap = Object.fromEntries(WIN_PATHS.map(p => [p.name, p]))

function scrollToPrize() {
  document.getElementById('path-to-prize')?.scrollIntoView({ behavior: 'smooth' })
}

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
}
const today = todayStr()

const totalGoals    = computed(() => store.matches.reduce((sum, m) => sum + (m.goals?.length ?? 0), 0))

const teamsRemaining = computed(() => tiers.filter(t => !ELIMINATED_TEAMS.has(t.team)).length)

const gamesRemaining = computed(() =>
  store.matches.filter(m => m.home_score === '' && !m.snapshot_minute).length
)

const daysToGo = computed(() => {
  const finalMatch = store.matches.find(m => m.stage === 'Final')
  if (!finalMatch) return '—'
  const diff = Math.ceil((new Date(finalMatch.date) - new Date(today)) / 86400000)
  return Math.max(0, diff)
})

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
const maxPlayerGoals = computed(() => Math.max(...Object.values(playerGoals.value)))
const maxPlayerGpg   = computed(() => Math.max(...Object.values(playerGoalsPerGame.value).map(Number).filter(n => !isNaN(n))))

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
    let todayCount = 0, todayTeams = 0, tomorrowCount = 0
    store.matches.forEach(m => {
      if (!teams.has(m.home) && !teams.has(m.away)) return
      if (m.date === today) {
        todayCount++
        if (teams.has(m.home)) todayTeams++
        if (teams.has(m.away)) todayTeams++
      } else if (m.date === tomorrowStr) tomorrowCount++
    })
    result[p.name] = { today: todayCount, todayTeams, tomorrow: tomorrowCount }
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


const poolEliminations = computed(() => {
  return store.enrichedMatches
    .filter(m =>
      m.home_score !== '' && !m.snapshot_minute &&
      KNOCKOUT_STAGES.has(m.stage) &&
      m.homePlayers.length > 0 && m.awayPlayers.length > 0
    )
    .map(m => {
      const homeScore = Number(m.home_score)
      const awayScore = Number(m.away_score)
      const homeWon = homeScore > awayScore || m.penalties_winner === 'home'
      const winnerTeam   = homeWon ? m.home : m.away
      const loserTeam    = homeWon ? m.away : m.home
      const winnerPlayers = homeWon ? m.homePlayers : m.awayPlayers
      const loserPlayers  = homeWon ? m.awayPlayers : m.homePlayers
      const bothSides     = loserPlayers.filter(p => winnerPlayers.includes(p))
      const killers       = winnerPlayers.filter(p => !loserPlayers.includes(p))
      const victims       = loserPlayers.filter(p => !winnerPlayers.includes(p))
      return { date: m.date, stage: m.stage, winnerTeam, loserTeam, killers, victims, bothSides,
               score: `${m.home_score}–${m.away_score}`, penWinner: m.penalties_winner }
    })
    .filter(e => e.killers.length > 0 && e.victims.length > 0)
})

const poolWL = computed(() => {
  const records = {}
  store.players.forEach(p => { records[p.name] = { w: 0, l: 0 } })

  store.enrichedMatches.forEach(m => {
    if (m.home_score === '' || m.snapshot_minute) return
    if (!m.homePlayers.length || !m.awayPlayers.length) return

    const homeScore = Number(m.home_score)
    const awayScore = Number(m.away_score)
    let winners, losers

    if (homeScore > awayScore || m.penalties_winner === 'home') {
      winners = m.homePlayers; losers = m.awayPlayers
    } else if (awayScore > homeScore || m.penalties_winner === 'away') {
      winners = m.awayPlayers; losers = m.homePlayers
    } else {
      return
    }

    winners.forEach(w => losers.forEach(l => {
      if (w === l) return
      if (records[w]) records[w].w++
      if (records[l]) records[l].l++
    }))
  })

  return Object.entries(records)
    .map(([name, { w, l }]) => ({ name, w, l }))
    .sort((a, b) => b.w - a.w || a.l - b.l)
})

const poolBully = computed(() => {
  const max = Math.max(...poolWL.value.map(r => r.w))
  if (max === 0) return { holders: new Set(), wins: 0 }
  const holders = new Set(poolWL.value.filter(r => r.w === max).map(r => r.name))
  return { holders, wins: max }
})

const matchupStats = computed(() => {
  const tally = {}
  const byType = {}

  store.enrichedMatches
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


const lastGroupDate = computed(() => {
  const dates = store.enrichedMatches
    .filter(m => m.stage === 'Group Stage')
    .map(m => m.date)
    .sort()
  return dates[dates.length - 1] ?? null
})

const communityShieldPts = computed(() => {
  const jason = store.players.find(p => p.name === 'Jason')
  if (!jason) return 0
  const teams = new Set(playerTeams(jason))
  let total = 0
  store.enrichedMatches.forEach(m => {
    if (m.stage !== 'Group Stage' || !m.played || m.snapshot_minute) return
    if (teams.has(m.home)) total += matchPointsForTeam(m.home, m)
    if (teams.has(m.away)) total += matchPointsForTeam(m.away, m)
  })
  return Math.round(total * 10) / 10
})

const groupStagePts = computed(() => {
  const map = {}
  store.players.forEach(p => {
    const teams = new Set(playerTeams(p))
    let total = 0
    store.enrichedMatches.forEach(m => {
      if (m.stage !== 'Group Stage' || !m.played || m.snapshot_minute) return
      if (teams.has(m.home)) total += matchPointsForTeam(m.home, m)
      if (teams.has(m.away)) total += matchPointsForTeam(m.away, m)
    })
    map[p.name] = Math.round(total * 10) / 10
  })
  return map
})

const gsPointsRank = computed(() => {
  const map = {}
  Object.entries(groupStagePts.value)
    .sort(([, a], [, b]) => b - a)
    .forEach(([name], i) => { map[name] = i + 1 })
  return map
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

const leadHistory = computed(() => {
  const playedDates = [...new Set(
    store.enrichedMatches
      .filter(m => m.played && !m.snapshot_minute)
      .map(m => m.date)
  )].sort()
  const running = Object.fromEntries(store.players.map(p => [p.name, 0]))
  const firstLead = {}
  const leadCount = Object.fromEntries(store.players.map(p => [p.name, 0]))
  for (const date of playedDates) {
    for (const p of store.players) {
      const entry = (playerPointsByDate.value[p.name] ?? []).find(d => d.date === date)
      if (entry) running[p.name] += entry.pts
    }
    const max = Math.max(...Object.values(running))
    if (max <= 0) continue
    for (const [name, pts] of Object.entries(running)) {
      if (pts === max) {
        if (!firstLead[name]) firstLead[name] = date
        leadCount[name]++
      }
    }
  }
  return { firstLead, leadCount }
})

const firstTimeLead = computed(() => {
  const { firstLead } = leadHistory.value
  const holders = new Set(
    store.players
      .filter(p => p.name === pointsLeader.value && firstLead[p.name] === today)
      .map(p => p.name)
  )
  return { holders }
})

const madeWaves = computed(() => {
  const { leadCount } = leadHistory.value
  return Object.fromEntries(
    store.players
      .filter(p => leadCount[p.name] > 0)
      .map(p => [p.name, leadCount[p.name]])
  )
})

const madeWavesMax = computed(() => Math.max(0, ...Object.values(madeWaves.value)))

const IN_THE_CHASE_THRESHOLD = 10
const IN_REACH_THRESHOLD = 20

const inTheChase = computed(() => {
  const leader = store.leaderboard[0]?.total ?? 0
  const entries = store.leaderboard.filter(e => e.total < leader && leader - e.total <= IN_THE_CHASE_THRESHOLD)
  const holders = new Set(entries.map(e => e.name))
  const gaps = Object.fromEntries(entries.map(e => [e.name, leader - e.total]))
  return { holders, gaps, threshold: IN_THE_CHASE_THRESHOLD }
})

const inReach = computed(() => {
  const leader = store.leaderboard[0]?.total ?? 0
  const entries = store.leaderboard.filter(e => {
    const diff = leader - e.total
    return diff > IN_THE_CHASE_THRESHOLD && diff <= IN_REACH_THRESHOLD
  })
  const holders = new Set(entries.map(e => e.name))
  const gaps = Object.fromEntries(entries.map(e => [e.name, leader - e.total]))
  return { holders, gaps }
})

const beyondReach = computed(() => {
  const leader = store.leaderboard[0]?.total ?? 0
  const entries = store.leaderboard.filter(e => leader - e.total > IN_REACH_THRESHOLD)
  return Object.fromEntries(entries.map(e => [e.name, leader - e.total]))
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

const KNOCKOUT_STAGES = new Set(['Round of 32', 'Round of 16', 'Quarterfinal', 'Semifinal', 'Third Place', 'Final'])
const goldenBootKnockout = computed(() => {
  const totals = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const goals = store.enrichedMatches
      .filter(m => m.played && !m.snapshot_minute && KNOCKOUT_STAGES.has(m.stage))
      .reduce((sum, m) => {
        if (teamSet.has(m.home)) sum += Number(m.home_score)
        if (teamSet.has(m.away)) sum += Number(m.away_score)
        return sum
      }, 0)
    return { name: e.name, goals }
  })
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
  const countMap = Object.fromEntries(counts.map(c => [c.name, c.yellows]))
  return { count: max, holders, counts: countMap }
})

const mostDraws = computed(() => {
  const counts = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const draws = store.enrichedMatches
      .filter(m => m.played && m.home_score != null && m.home_score === m.away_score)
      .filter(m => teamSet.has(m.home) || teamSet.has(m.away))
      .length
    return { name: e.name, draws }
  })
  const max = Math.max(...counts.map(c => c.draws))
  const holders = new Set(counts.filter(c => c.draws === max && max > 0).map(c => c.name))
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
  const perPlayer = Object.fromEntries(counts.map(c => [c.name, c.goals]))
  return { count: max, holders, perPlayer }
})

const fifaRankMap = Object.fromEntries(tiers.map(t => [t.team, t.fifaRank]))
const oddsMap = Object.fromEntries(tiers.map(t => [t.team, t.odds]))

const clinical = computed(() => {
  const rates = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    let goals = 0, games = 0
    for (const m of store.enrichedMatches) {
      if (!m.played || m.snapshot_minute) continue
      if (teamSet.has(m.home)) { goals += Number(m.home_score); games++ }
      if (teamSet.has(m.away)) { goals += Number(m.away_score); games++ }
    }
    const gpg = games ? goals / games : 0
    return { name: e.name, gpg }
  })
  const max = Math.max(...rates.map(r => r.gpg))
  const holders = new Set(rates.filter(r => r.gpg === max && max > 0).map(r => r.name))
  return { holders, gpg: max.toFixed(2) }
})

const peakGPG = computed(() => {
  const played = store.enrichedMatches.filter(m => m.played && !m.snapshot_minute)
  const dates = [...new Set(played.map(m => m.date))].sort()
  const goalTotals = Object.fromEntries(store.leaderboard.map(e => [e.name, 0]))
  const gameTotals = Object.fromEntries(store.leaderboard.map(e => [e.name, 0]))
  let peak = 0
  let peakHolders = new Set()
  for (const date of dates) {
    const dateMatches = played.filter(m => m.date === date)
    for (const entry of store.leaderboard) {
      const teamSet = new Set(entry.teams)
      for (const m of dateMatches) {
        if (teamSet.has(m.home)) { goalTotals[entry.name] += Number(m.home_score); gameTotals[entry.name]++ }
        if (teamSet.has(m.away)) { goalTotals[entry.name] += Number(m.away_score); gameTotals[entry.name]++ }
      }
    }
    for (const entry of store.leaderboard) {
      if (!gameTotals[entry.name]) continue
      const gpg = goalTotals[entry.name] / gameTotals[entry.name]
      if (gpg > peak) { peak = gpg; peakHolders = new Set([entry.name]) }
      else if (gpg === peak && peak > 0) peakHolders.add(entry.name)
    }
  }
  return { holders: peakHolders, gpg: peak.toFixed(2) }
})

const madGenius = computed(() => {
  const holders = new Set()

  // Worst avg FIFA rank (lowest strength on paper)
  const avgs = store.leaderboard.map(e => ({
    name: e.name,
    avg: e.teams.reduce((s, t) => s + (fifaRankMap[t] ?? 99), 0) / e.teams.length,
  }))
  const maxRank = Math.max(...avgs.map(a => a.avg))
  avgs.filter(a => a.avg === maxRank).forEach(a => holders.add(a.name))

  // Fewest European teams
  const euroCounts = store.leaderboard.map(e => ({
    name: e.name,
    count: e.teams.filter(t => EUROPEAN_TEAMS.has(t)).length,
  }))
  const minEuro = Math.min(...euroCounts.map(c => c.count))
  euroCounts.filter(c => c.count === minEuro).forEach(c => holders.add(c.name))

  return { holders }
})

const goYourOwnWay = computed(() => {
  const teamCount = {}
  for (const e of store.leaderboard)
    for (const t of e.teams)
      teamCount[t] = (teamCount[t] ?? 0) + 1
  const counts = store.leaderboard.map(e => ({
    name: e.name,
    unique: e.teams.filter(t => teamCount[t] === 1).length,
  }))
  const max = Math.max(...counts.map(c => c.unique))
  const holders = new Set(counts.filter(c => c.unique === max && max > 0).map(c => c.name))
  return { holders, count: max }
})

const eskimoBros = computed(() => {
  const teamPickers = {}
  for (const e of store.leaderboard)
    for (const t of e.teams)
      teamPickers[t] = (teamPickers[t] ?? []).concat(e.name)
  const max = Math.max(...Object.values(teamPickers).map(p => p.length))
  const topTeams = Object.entries(teamPickers).filter(([, p]) => p.length === max)
  const sharedTeam = topTeams[0]?.[0] ?? ''
  const holders = new Set(topTeams[0]?.[1] ?? [])
  return { holders, team: sharedTeam, count: max }
})

const herdMentality = computed(() => {
  const allTeams = store.leaderboard.map(e => e.teams)
  const scores = store.leaderboard.map(e => {
    const overlap = e.teams.reduce((sum, team) => {
      return sum + allTeams.filter((teams, i) => store.leaderboard[i].name !== e.name && teams.includes(team)).length
    }, 0)
    return { name: e.name, overlap }
  }).sort((a, b) => b.overlap - a.overlap)
  const threshold = scores[2]?.overlap ?? 0
  const holders = new Set(scores.filter(s => s.overlap >= threshold && threshold > 0).map(s => s.name))
  return { holders }
})

const iMeanCmon = computed(() => {
  const avgs = store.leaderboard.map(e => {
    const ranks = e.teams.map(t => fifaRankMap[t] ?? 99)
    return { name: e.name, avg: ranks.reduce((a, b) => a + b, 0) / ranks.length }
  }).sort((a, b) => a.avg - b.avg)
  const threshold = avgs[2]?.avg ?? 0
  const holders = new Set(avgs.filter(a => a.avg <= threshold).map(a => a.name))
  return { holders }
})

const bellyFlop = computed(() => {
  const avgs = store.leaderboard.map(e => {
    const ranks = e.teams.map(t => fifaRankMap[t] ?? 99)
    const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length
    return { name: e.name, avg }
  })
  const max = Math.max(...avgs.map(a => a.avg))
  const holders = new Set(avgs.filter(a => a.avg === max).map(a => a.name))
  return { holders, avg: Math.round(max) }
})

const earlyShower = computed(() => {
  const counts = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    const reds = store.enrichedMatches
      .filter(m => m.played && m.cards?.length)
      .reduce((sum, m) => {
        for (const c of m.cards) {
          if (c.type !== 'red') continue
          const team = c.team === 'home' ? m.home : m.away
          if (teamSet.has(team)) sum++
        }
        return sum
      }, 0)
    return { name: e.name, reds }
  })
  const max = Math.max(...counts.map(c => c.reds))
  const holders = new Set(counts.filter(c => c.reds === max && max > 0).map(c => c.name))
  const countMap = Object.fromEntries(counts.map(c => [c.name, c.reds]))
  return { count: max, holders, counts: countMap }
})

const cleanPool = computed(() => {
  const counts = store.leaderboard.map(e => {
    const teamSet = new Set(e.teams)
    let total = 0, reds = 0
    store.enrichedMatches
      .filter(m => m.played && m.cards?.length)
      .forEach(m => {
        for (const c of m.cards) {
          const team = c.team === 'home' ? m.home : m.away
          if (teamSet.has(team)) { total++; if (c.type === 'red') reds++ }
        }
      })
    return { name: e.name, cards: total, reds }
  })
  const min = Math.min(...counts.map(c => c.cards))
  const holders = new Set(counts.filter(c => c.cards === min && c.reds === 0).map(c => c.name))
  return { count: min, holders }
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

const backToBack = computed(() => {
  const holders = new Set()
  const scores = {}
  store.players.forEach(p => {
    const days = playerPointsByDate.value[p.name] ?? []
    let streak = 0, run = []
    for (const { pts } of days) {
      if (pts >= 20) {
        streak++; run.push(pts)
        if (streak >= 2) { holders.add(p.name); scores[p.name] = run.slice(-2); break }
      } else { streak = 0; run = [] }
    }
  })
  return { holders, scores }
})

const floaties = computed(() => new Set(
  store.players
    .filter(p => playerTeams(p).filter(t => !ELIMINATED_TEAMS.has(t)).length >= 4)
    .map(p => p.name)
))

const halfDead = computed(() => new Set(
  store.players
    .filter(p => {
      const teams = playerTeams(p)
      return teams.length > 0 && teams.filter(t => ELIMINATED_TEAMS.has(t)).length === Math.floor(teams.length / 2)
    })
    .map(p => p.name)
))

const treadingWater = computed(() => new Set(
  store.players
    .filter(p => playerTeams(p).filter(t => !ELIMINATED_TEAMS.has(t)).length === 2)
    .map(p => p.name)
))

const lastLeg = computed(() => new Set(
  store.players
    .filter(p => playerTeams(p).filter(t => !ELIMINATED_TEAMS.has(t)).length === 1)
    .map(p => p.name)
))

const washedUp = computed(() => {
  // Find last played-match date per eliminated team
  const teamLastDate = {}
  store.enrichedMatches
    .filter(m => m.played && !m.snapshot_minute)
    .forEach(m => {
      for (const side of ['home', 'away']) {
        const team = side === 'home' ? m.home : m.away
        if (ELIMINATED_TEAMS.has(team) && (!teamLastDate[team] || m.date > teamLastDate[team]))
          teamLastDate[team] = m.date
      }
    })
  // Players with every team eliminated; find when their last team went out
  const eligible = store.players
    .filter(p => {
      const teams = playerTeams(p)
      return teams.length > 0 && teams.every(t => ELIMINATED_TEAMS.has(t))
    })
    .map(p => ({
      name: p.name,
      finishedOn: playerTeams(p).reduce((max, t) => {
        const d = teamLastDate[t] ?? '9999'
        return d > max ? d : max
      }, '0000'),
    }))
  if (!eligible.length) return { holders: new Set() }
  const earliest = eligible.reduce((a, b) => a.finishedOn <= b.finishedOn ? a : b).finishedOn
  const holders = new Set(eligible.filter(e => e.finishedOn === earliest).map(e => e.name))
  return { holders }
})

const outOfPool = computed(() => new Set(
  store.players
    .filter(p => {
      const teams = playerTeams(p)
      return teams.length > 0 && teams.every(t => ELIMINATED_TEAMS.has(t)) && !washedUp.holders.has(p.name)
    })
    .map(p => p.name)
))

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

const positionChange = computed(() => {
  const allDates = [...new Set(
    store.enrichedMatches.filter(m => m.played && !m.snapshot_minute).map(m => m.date)
  )].sort()
  if (allDates.length < 2) return { risers: new Set(), fallers: new Set(), riseCount: 0, fallCount: 0 }
  const lastDate = allDates[allDates.length - 1]
  const prevDates = new Set(allDates.slice(0, -1))
  const prevTotals = store.leaderboard
    .map(e => ({
      name: e.name,
      pts: (playerPointsByDate.value[e.name] ?? [])
        .filter(d => prevDates.has(d.date))
        .reduce((s, d) => s + d.pts, 0),
    }))
    .sort((a, b) => b.pts - a.pts)
  const prevPos = Object.fromEntries(prevTotals.map((e, i) => [e.name, i + 1]))
  const changes = store.leaderboard.map((e, i) => ({
    name: e.name,
    change: (prevPos[e.name] ?? i + 1) - (i + 1),
  }))
  const maxRise = Math.max(...changes.map(c => c.change))
  const maxFall = Math.min(...changes.map(c => c.change))
  const risers = new Set(changes.filter(c => c.change === maxRise && maxRise > 0).map(c => c.name))
  const fallers = new Set(changes.filter(c => c.change === maxFall && maxFall < 0).map(c => c.name))
  return { risers, fallers, riseCount: maxRise, fallCount: Math.abs(maxFall), lastDate }
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
.win-path-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
.win-path-row { padding: 12px 14px; border-radius: 10px; }
.win-path-row--alive { border-left: 3px solid var(--accent); }
.win-path-row--out   { border-left: 3px solid #00e5ff; }
.win-path-row--dead  { border-left: 3px solid #00e5ff; opacity: 0.45; }
.win-path-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.win-path-name { font-weight: 700; font-size: 14px; color: var(--text); }
.win-path-badge {
  font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  padding: 2px 8px; border-radius: 20px;
}
.win-path-badge--alive  { background: rgba(255,45,120,0.15); color: var(--accent); }
.win-path-badge--podium { background: rgba(255,210,100,0.12); color: #ffd264; border: 1px solid rgba(255,210,100,0.25); }
.win-path-badge--out    { background: rgba(255,255,255,0.06); color: var(--text-dim); }
.win-path-text { font-size: 13px; line-height: 1.5; color: var(--text-dim); margin: 0; }
.win-path-sensitivity-label {
  font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: #00e5ff; margin: 8px 0 2px; opacity: 0.8;
}
.win-path-text--2 { font-size: 12px; line-height: 1.5; color: #00e5ff; margin: 0; opacity: 0.7; }

.tourney-stats {
  display: flex; flex-direction: column; gap: 12px;
  padding: 16px; margin-bottom: 16px;
}
.tourney-stats-row {
  display: flex; align-items: center; justify-content: space-around;
}
.tourney-stats-row--days {
  border-top: 1px solid var(--border);
  padding-top: 12px;
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

.purse-section {
  margin: 4px 0 20px;
  padding: 18px 16px 20px;
  border-radius: 14px;
  border: 1px solid rgba(189,95,255,0.35);
  box-shadow: 0 0 0 1px rgba(255,45,120,0.12), 0 0 40px rgba(189,95,255,0.10);
  position: relative;
  overflow: hidden;
}

/* ── Vaporwave scene ─────────────────────────────────────── */
.purse-scene {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
}
.purse-sky {
  position: absolute; inset: 0 0 42% 0;
  background: linear-gradient(to bottom, #020109 0%, #0d0220 38%, #1e0645 72%, #38098a 100%);
  overflow: hidden;
}
.purse-stars {
  position: absolute; inset: 0;
}
.purse-stars::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 2px; height: 2px; border-radius: 50%; background: transparent;
  box-shadow:
    14px 10px 0 rgba(255,255,255,.85),  40px 5px 0 rgba(255,255,255,.55),
    70px 18px 0 rgba(189,95,255,.80),   100px 8px 0 rgba(255,255,255,.95),
    130px 22px 0 rgba(0,229,255,.70),   160px 12px 0 rgba(255,255,255,.75),
    190px 30px 0 rgba(255,45,120,.65),  220px 6px 0 rgba(255,255,255,.85),
    250px 20px 0 rgba(189,95,255,.60),  280px 14px 0 rgba(255,255,255,.95),
    310px 28px 0 rgba(0,229,255,.75),   340px 8px 0 rgba(255,255,255,.65),
    370px 18px 0 rgba(255,45,120,.70),  400px 5px 0 rgba(255,255,255,.80),
    430px 24px 0 rgba(189,95,255,.65),  460px 10px 0 rgba(255,255,255,.55),
    490px 20px 0 rgba(0,229,255,.60),   520px 15px 0 rgba(255,255,255,.85),
    550px 30px 0 rgba(255,45,120,.55),  580px 6px 0 rgba(255,255,255,.75);
  animation: purse-twinkle 4.5s ease-in-out infinite;
}
.purse-stars::after {
  content: ''; position: absolute; top: 0; left: 0;
  width: 1px; height: 1px; border-radius: 50%; background: transparent;
  box-shadow:
    25px 20px 0 rgba(255,255,255,.65),  55px 35px 0 rgba(255,255,255,.45),
    85px 12px 0 rgba(255,255,255,.75),  115px 28px 0 rgba(255,255,255,.55),
    145px 40px 0 rgba(255,255,255,.85), 175px 16px 0 rgba(255,255,255,.45),
    205px 32px 0 rgba(255,255,255,.65), 235px 22px 0 rgba(255,255,255,.75),
    265px 38px 0 rgba(255,255,255,.55), 295px 10px 0 rgba(255,255,255,.85),
    325px 26px 0 rgba(255,255,255,.45), 355px 42px 0 rgba(255,255,255,.65),
    385px 14px 0 rgba(255,255,255,.75), 415px 30px 0 rgba(255,255,255,.55),
    445px 44px 0 rgba(255,255,255,.45), 475px 18px 0 rgba(255,255,255,.65),
    505px 34px 0 rgba(255,255,255,.75), 535px 8px 0 rgba(255,255,255,.55),
    565px 28px 0 rgba(255,255,255,.65), 595px 40px 0 rgba(255,255,255,.45);
  animation: purse-twinkle 6.8s 1.2s ease-in-out infinite;
}
@keyframes purse-twinkle { 0%,100% { opacity:.9; } 50% { opacity:.15; } }

.purse-mountains {
  position: absolute; left: 0; right: 0;
  bottom: 42%; height: 54px;
  background: linear-gradient(180deg, rgba(32,6,60,0) 0%, #190340 40%, #0d0128 100%);
  clip-path: polygon(
    0% 100%, 0% 80%,
    4% 55%,  8% 35%,  12% 55%, 16% 25%, 20% 48%,
    24% 65%, 28% 40%, 32% 55%, 36% 18%, 40% 42%,
    44% 60%, 48% 38%, 52% 22%, 56% 45%, 60% 62%,
    64% 38%, 68% 52%, 72% 28%, 76% 48%, 80% 65%,
    84% 42%, 88% 55%, 92% 32%, 96% 58%, 100% 70%,
    100% 100%
  );
}

.purse-sun-wrap {
  position: absolute; left: 50%; bottom: 42%;
  transform: translateX(-50%) translateY(50%);
  width: 110px; height: 55px;
  filter:
    drop-shadow(0 0 14px rgba(255,45,120,.90))
    drop-shadow(0 0 36px rgba(255,45,120,.40))
    drop-shadow(0 0 60px rgba(189,95,255,.35));
  animation: purse-sun-breathe 3.5s ease-in-out infinite;
}
.purse-sun { width: 100%; height: 100%; display: block; }
@keyframes purse-sun-breathe {
  0%,100% { filter: drop-shadow(0 0 14px rgba(255,45,120,.90)) drop-shadow(0 0 36px rgba(255,45,120,.40)) drop-shadow(0 0 60px rgba(189,95,255,.35)); }
  50%      { filter: drop-shadow(0 0 22px rgba(255,45,120,1))   drop-shadow(0 0 55px rgba(255,45,120,.60)) drop-shadow(0 0 90px rgba(189,95,255,.55)); }
}

.purse-horizon {
  position: absolute; left: 0; right: 0; bottom: 42%; height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(189,95,255,.8) 15%, #ff6fb0 40%, #ffffff 50%, #ff6fb0 60%, rgba(189,95,255,.8) 85%, transparent 100%);
  box-shadow: 0 0 8px rgba(189,95,255,.8), 0 0 22px rgba(255,45,120,.55);
  animation: purse-horizon-pulse 2.6s ease-in-out infinite;
}
@keyframes purse-horizon-pulse { 0%,100% { opacity:.7; } 50% { opacity:1; } }

.purse-grid-wrap {
  position: absolute; left: 0; right: 0; bottom: 0; height: 42%; overflow: hidden;
}
.purse-grid {
  position: absolute; left: -80%; right: -80%; top: 0; bottom: -12%;
  background-image:
    linear-gradient(to right,  rgba(189,95,255,.55) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(189,95,255,.55) 1px, transparent 1px);
  background-size: 52px 32px;
  transform: perspective(200px) rotateX(54deg);
  transform-origin: top center;
  mask-image:         linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.05) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.05) 100%);
  animation: purse-grid-march 2.2s linear infinite, purse-grid-glow 5s ease-in-out infinite;
}
@keyframes purse-grid-march { from { background-position: 26px 0; } to { background-position: 26px 32px; } }
@keyframes purse-grid-glow  { 0%,100% { opacity:.5; } 50% { opacity:.8; } }

.purse-sweep {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(189,95,255,.8), #00e5ff, rgba(189,95,255,.8), transparent);
  box-shadow: 0 0 6px rgba(189,95,255,.8); opacity: .3;
  animation: purse-sweep 10s linear infinite;
}
@keyframes purse-sweep { from { top: -2px; } to { top: 100%; } }

.purse-scanlines {
  position: absolute; inset: 0; z-index: 4;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 3px,
    rgba(0,0,0,.12) 3px, rgba(0,0,0,.12) 4px
  );
}

.purse-crt {
  position: absolute; inset: 0; z-index: 5;
  background: radial-gradient(ellipse 110% 110% at 50% 50%, transparent 55%, rgba(0,0,0,.45) 100%);
  border-radius: 14px;
}
.purse-path-link {
  display: block; width: 100%; position: relative; z-index: 6;
  text-align: center;
  margin-top: 14px;
  padding: 0;
  background: none; border: none; outline: none;
  font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: #ffd264; opacity: 0.7;
  cursor: pointer;
  transition: opacity .15s;
}
.purse-path-link:hover { opacity: 1; }
.purse-title {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 11px; font-weight: 800;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--text-dim);
  text-align: center;
  margin: 0 0 16px;
  position: relative; z-index: 6;
}
.purse-podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  position: relative; z-index: 6;
}
.purse-place {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px;
  padding: 14px 10px 16px;
  border-radius: 10px;
  flex: 1; max-width: 110px;
  position: relative;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.purse-place--1 {
  background: linear-gradient(180deg, rgba(12,6,28,0.88) 0%, rgba(20,10,40,0.92) 100%);
  border: 1px solid rgba(255,210,100,0.55);
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: 0 0 24px rgba(255,210,100,0.18), inset 0 1px 0 rgba(255,210,100,0.12);
}
.purse-place--2 {
  background: linear-gradient(180deg, rgba(12,6,28,0.82) 0%, rgba(18,8,36,0.88) 100%);
  border: 1px solid rgba(189,95,255,0.45);
  box-shadow: inset 0 1px 0 rgba(189,95,255,0.10);
}
.purse-place--3 {
  background: linear-gradient(180deg, rgba(12,6,28,0.82) 0%, rgba(18,8,36,0.88) 100%);
  border: 1px solid rgba(255,45,120,0.4);
  box-shadow: inset 0 1px 0 rgba(255,45,120,0.08);
}
.purse-medal { font-size: 22px; line-height: 1; }
.purse-place--1 .purse-medal { font-size: 28px; }
.purse-label {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.purse-amount {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 22px; font-weight: 900; letter-spacing: .02em;
  color: var(--text);
}
.purse-place--1 .purse-amount {
  font-size: 30px;
  color: #ffd264;
  text-shadow: 0 0 12px rgba(255,210,100,0.8), 0 0 28px rgba(255,180,0,0.5);
}
.purse-place--2 .purse-amount {
  color: #d89fff;
  text-shadow: 0 0 10px rgba(189,95,255,0.7), 0 0 22px rgba(189,95,255,0.35);
}
.purse-place--3 .purse-amount {
  color: #ff6fa8;
  text-shadow: 0 0 10px rgba(255,45,120,0.7), 0 0 22px rgba(255,45,120,0.35);
}

.leaderboard { display: flex; flex-direction: column; gap: 8px; }

.lb-row { cursor: pointer; transition: border-color .15s; overflow: visible; position: relative; z-index: 0; }
.lb-row:has(.lb-tooltip-wrap:hover),
.lb-row:has(.lb-tooltip-wrap:focus) { z-index: 50; }
.lb-row--first { border-color: var(--accent); }
.lb-row--low-health { animation: lb-low-health 3s ease-in-out infinite; }
.lb-row--critical   { animation: lb-critical 2s ease-in-out infinite; }
@keyframes lb-low-health {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,140,0,0), inset 0 0 0 0 rgba(255,140,0,0); }
  50%       { box-shadow: 0 0 12px 2px rgba(255,140,0,0.35), inset 0 0 18px 2px rgba(255,140,0,0.12); }
}
@keyframes lb-critical {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,50,50,0), inset 0 0 0 0 rgba(255,50,50,0); }
  50%       { box-shadow: 0 0 18px 4px rgba(255,50,50,0.5), inset 0 0 40px 8px rgba(255,50,50,0.35); }
}

.lb-main {
  display: grid;
  grid-template-columns: 26px 1fr auto;
  grid-template-rows: auto auto;
  gap: 0 12px;
  padding: 14px 16px;
}

.lb-rank {
  grid-column: 1; grid-row: 1 / 3;
  align-self: start;
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; background: var(--surface2); color: var(--text-dim);
  flex-shrink: 0; margin-top: 1px;
}
.rank-gold   { background: #4a3a1a; color: #f0c060; }
.rank-silver { background: #2a2e3a; color: #d0d8e8; }
.rank-bronze { background: #2e2018; color: #e89060; }

.lb-center {
  grid-column: 2; grid-row: 1;
  display: flex; flex-direction: column; gap: 5px; min-width: 0;
}
.lb-right {
  grid-column: 2; grid-row: 2;
  display: flex; flex-direction: column; gap: 5px; min-width: 0;
  margin-top: 6px;
}
.lb-pts { grid-column: 3; grid-row: 1 / 3; align-self: start; }
.lb-name { font-size: 18px; font-weight: 600; color: #ffffff; }
.lb-name--shimmer {
  background: linear-gradient(90deg, var(--green) 0%, #fff 45%, #afffdc 55%, var(--green) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lb-stat-shimmer 2s linear infinite;
}
.lb-name--vaporfire {
  background: linear-gradient(90deg, #ff2d95 0%, #ff5500 25%, #ffcc00 50%, #ff2d00 75%, #ff2d95 100%);
  background-size: 300% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lb-vaporfire 2.4s linear infinite;
}
@keyframes lb-vaporfire {
  0%   { background-position: 0% center; }
  100% { background-position: 300% center; }
}
.lb-name--low-health { animation: lb-name-low-health 3s ease-in-out infinite; }
@keyframes lb-name-low-health {
  0%, 100% { text-shadow: none; }
  50%       { text-shadow: 0 0 10px rgba(255,140,0,0.9), 0 0 22px rgba(255,140,0,0.4); }
}
.lb-name--critical { animation: lb-name-critical 2s ease-in-out infinite; }
@keyframes lb-name-critical {
  0%, 100% { text-shadow: none; }
  50%       { text-shadow: 0 0 12px rgba(255,50,50,1), 0 0 28px rgba(255,50,50,0.6); }
}
.lb-teams-left { font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.lb-teams-left--low      { color: #ffaa00; }
.lb-teams-left--critical { color: #ff4040; }
.lb-name-crown { font-size: 14px; line-height: 1; }
.lb-name-lifeguard { font-size: 14px; line-height: 1; opacity: 0.85; }
.lb-name-glove { font-size: 14px; line-height: 1; opacity: 0.9; }
.lb-name-rocket { font-size: 14px; line-height: 1; }
.lb-name-boot { font-size: 14px; line-height: 1; }
.lb-trending-fire { font-size: 16px; line-height: 1; }

.lb-foia {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(180,160,120,0.12);
  border: 1px solid rgba(180,160,100,0.35);
  color: #c8b884;
  white-space: nowrap;
}

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

.lb-gs-pts {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(96,184,255,0.12), rgba(255,255,255,0.18), rgba(96,184,255,0.12));
  background-size: 200% auto;
  color: #60b8ff;
  border: 1px solid rgba(96,184,255,0.35);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}
.lb-gs-pts--silver {
  background: linear-gradient(90deg, rgba(184,197,214,0.12), rgba(255,255,255,0.22), rgba(184,197,214,0.12));
  color: #b8c5d6;
  border-color: rgba(184,197,214,0.45);
}
.lb-gs-pts--bronze {
  background: linear-gradient(90deg, rgba(200,121,65,0.12), rgba(255,255,255,0.2), rgba(200,121,65,0.12));
  color: #c87941;
  border-color: rgba(200,121,65,0.45);
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

.lb-first-lead {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,229,255,0.18), rgba(255,255,255,0.30), rgba(0,255,180,0.18));
  background-size: 200% auto;
  color: #fff;
  border: 1px solid rgba(0,229,255,0.55);
  white-space: nowrap;
  animation: shield-sparkle 1.2s linear infinite;
}

.lb-made-waves {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,180,220,0.14), rgba(100,220,255,0.22), rgba(0,180,220,0.14));
  background-size: 200% auto;
  color: #44ccee;
  border: 1px solid rgba(0,200,240,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.2s linear infinite;
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

.lb-in-reach {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,229,255,0.07), rgba(255,255,255,0.11), rgba(0,229,255,0.07));
  background-size: 200% auto;
  color: var(--cyan);
  border: 1px solid rgba(0,229,255,0.2);
  white-space: nowrap;
  animation: shield-sparkle 2.2s linear infinite;
}

.lb-beyond-reach {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(189,95,255,0.12), rgba(255,45,120,0.14), rgba(189,95,255,0.12));
  background-size: 200% auto;
  color: var(--purple);
  border: 1px solid rgba(189,95,255,0.3);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}

.lb-sus {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(255,45,120,0.1);
  border: 1px solid rgba(255,45,120,0.35);
  color: #ff6fa0;
  white-space: nowrap;
}

.lb-eskimo-bros {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(160,230,255,0.12), rgba(210,245,255,0.2), rgba(160,230,255,0.12));
  background-size: 200% auto;
  color: #a8e8ff;
  border: 1px solid rgba(160,220,255,0.38);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}

.lb-go-own-way {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(210,160,40,0.13), rgba(255,210,80,0.2), rgba(210,160,40,0.13));
  background-size: 200% auto;
  color: #f0c040;
  border: 1px solid rgba(210,170,40,0.4);
  white-space: nowrap;
  animation: shield-sparkle 3.6s linear infinite;
}

.lb-herd {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(180,170,160,0.13), rgba(220,215,210,0.2), rgba(180,170,160,0.13));
  background-size: 200% auto;
  color: #c8c0b8;
  border: 1px solid rgba(180,170,160,0.38);
  white-space: nowrap;
  animation: shield-sparkle 3.4s linear infinite;
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

.lb-clinical {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,80,0,0.13), rgba(255,140,60,0.2), rgba(255,80,0,0.13));
  background-size: 200% auto;
  color: #ff9040;
  border: 1px solid rgba(255,100,20,0.4);
  white-space: nowrap;
  animation: shield-sparkle 1.8s linear infinite;
}

.lb-peak-gpg {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,60,0,0.12), rgba(255,180,0,0.2), rgba(255,60,0,0.12));
  background-size: 200% auto;
  color: #ffb840;
  border: 1px solid rgba(255,140,0,0.42);
  white-space: nowrap;
  animation: shield-sparkle 2.2s linear infinite;
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

.lb-golden-boot-ko {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,160,0,0.15), rgba(255,255,255,0.22), rgba(255,160,0,0.15));
  background-size: 200% auto;
  color: #ffaa00;
  border: 1px solid rgba(255,160,0,0.4);
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

.lb-most-draws {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(120,180,255,0.12), rgba(180,220,255,0.22), rgba(120,180,255,0.12));
  background-size: 200% auto;
  color: #88c4ff;
  border: 1px solid rgba(120,180,255,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.8s linear infinite;
}

.lb-clean-pool {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(200,240,255,0.1), rgba(220,255,240,0.18), rgba(200,240,255,0.1));
  background-size: 200% auto;
  color: #b8f0e0;
  border: 1px solid rgba(180,240,220,0.38);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
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
.lb-dirty-pool--leader {
  background: linear-gradient(90deg, rgba(255,210,0,0.22), rgba(255,240,100,0.38), rgba(255,210,0,0.22));
  border-color: rgba(255,210,0,0.7);
  box-shadow: 0 0 6px rgba(255,210,0,0.3);
  animation: shield-sparkle 1.4s linear infinite;
}

.lb-mad-genius {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(160,0,255,0.14), rgba(220,100,255,0.22), rgba(160,0,255,0.14));
  background-size: 200% auto;
  color: #d966ff;
  border: 1px solid rgba(180,40,255,0.42);
  white-space: nowrap;
  animation: shield-sparkle 0.9s linear infinite;
}

.lb-i-mean-cmon {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(200,200,220,0.12), rgba(240,240,255,0.2), rgba(200,200,220,0.12));
  background-size: 200% auto;
  color: #d0d4f0;
  border: 1px solid rgba(200,200,240,0.35);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}

.lb-belly-flop {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,160,220,0.13), rgba(80,210,255,0.2), rgba(0,160,220,0.13));
  background-size: 200% auto;
  color: #4dd4ff;
  border: 1px solid rgba(0,180,240,0.38);
  white-space: nowrap;
  animation: shield-sparkle 2.8s linear infinite;
}

.lb-dirty-pool-plus {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(220,30,30,0.13), rgba(255,80,80,0.2), rgba(220,30,30,0.13));
  background-size: 200% auto;
  color: #ff6060;
  border: 1px solid rgba(220,40,40,0.4);
  white-space: nowrap;
  animation: shield-sparkle 2s linear infinite;
}
.lb-dirty-pool-plus--leader {
  background: linear-gradient(90deg, rgba(220,30,30,0.22), rgba(255,80,80,0.36), rgba(220,30,30,0.22));
  border-color: rgba(220,40,40,0.72);
  box-shadow: 0 0 6px rgba(220,40,40,0.3);
  animation: shield-sparkle 1s linear infinite;
}

.lb-late-show {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(120,80,220,0.1);
  color: #c4a0ff;
  border: 1px solid rgba(150,100,255,0.25);
  white-space: nowrap;
}
.lb-late-show--leader {
  background: linear-gradient(90deg, rgba(120,80,220,0.15), rgba(180,140,255,0.22), rgba(120,80,220,0.15));
  background-size: 200% auto;
  border-color: rgba(150,100,255,0.38);
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

.lb-on-the-rise {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(80,255,180,0.12), rgba(200,255,230,0.2), rgba(80,255,180,0.12));
  background-size: 200% auto;
  color: #4dffb0;
  border: 1px solid rgba(80,255,180,0.35);
  white-space: nowrap;
  animation: shield-sparkle 1.6s linear infinite;
}

.lb-sinker {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(160,100,255,0.12), rgba(200,160,255,0.2), rgba(160,100,255,0.12));
  background-size: 200% auto;
  color: #c87fff;
  border: 1px solid rgba(160,100,255,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2s linear infinite;
}

.lb-back-to-back {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,255,159,0.15), rgba(255,255,255,0.2), rgba(0,255,159,0.15));
  background-size: 200% auto;
  color: var(--green);
  border: 1px solid rgba(0,255,159,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2s linear infinite;
}
.lb-floaties {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,180,255,0.14), rgba(100,230,255,0.22), rgba(0,180,255,0.14));
  background-size: 200% auto;
  color: #55ddff;
  border: 1px solid rgba(0,200,255,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2s linear infinite;
}
.lb-poolside {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,200,80,0.13), rgba(255,230,140,0.20), rgba(255,200,80,0.13));
  background-size: 200% auto;
  color: #f5c842;
  border: 1px solid rgba(240,190,60,0.35);
  white-space: nowrap;
  animation: shield-sparkle 3.2s linear infinite;
}
.lb-half-dead {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(160,80,180,0.14), rgba(200,120,220,0.22), rgba(160,80,180,0.14));
  background-size: 200% auto;
  color: #cc88ee;
  border: 1px solid rgba(180,80,200,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.8s linear infinite;
}
.lb-treading-water {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(0,160,180,0.14), rgba(80,210,200,0.22), rgba(0,160,180,0.14));
  background-size: 200% auto;
  color: #40d0c0;
  border: 1px solid rgba(0,190,180,0.35);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}
.lb-prize-path {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  white-space: nowrap;
}
.lb-prize-path--alive  { background: rgba(255,45,120,0.12); color: var(--accent); border: 1px solid rgba(255,45,120,0.3); }
.lb-prize-path--podium { background: rgba(255,210,100,0.1); color: #ffd264; border: 1px solid rgba(255,210,100,0.28); }
.lb-prize-path--out    { background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid rgba(255,255,255,0.1); }

.lb-math-elim {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(255, 45, 120, 0.1);
  color: rgba(255, 45, 120, 0.7);
  border: 1px solid rgba(255, 45, 120, 0.25);
  white-space: nowrap;
}

.lb-last-leg {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,160,0,0.14), rgba(255,210,100,0.22), rgba(255,160,0,0.14));
  background-size: 200% auto;
  color: #ffcc55;
  border: 1px solid rgba(255,190,50,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.5s linear infinite;
}
.lb-washed-up {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(120,140,180,0.15), rgba(200,210,230,0.22), rgba(120,140,180,0.15));
  background-size: 200% auto;
  color: #a0b0cc;
  border: 1px solid rgba(140,160,200,0.3);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
}
.lb-pool-bully {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,45,120,0.14), rgba(189,95,255,0.18), rgba(255,45,120,0.14));
  background-size: 200% auto;
  color: var(--accent);
  border: 1px solid rgba(255,45,120,0.35);
  white-space: nowrap;
  animation: shield-sparkle 2.5s linear infinite;
}
.lb-out-of-pool {
  font-size: 11px; font-weight: 800; letter-spacing: .05em;
  padding: 2px 7px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(200,50,50,0.14), rgba(255,100,100,0.22), rgba(200,50,50,0.14));
  background-size: 200% auto;
  color: #ff6b6b;
  border: 1px solid rgba(220,80,80,0.35);
  white-space: nowrap;
  animation: shield-sparkle 3s linear infinite;
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
  -webkit-text-fill-color: var(--text);
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
.lb-stats-row { display: flex; align-items: flex-start; gap: 12px; margin-top: 10px; }
.lb-stat { display: flex; flex-direction: column; gap: 1px; min-width: 0; padding-top: 6px; }
.lb-stat-value { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.2; }

@media (max-width: 479px) {
  .lb-stats-row {
    gap: 0;
    margin-top: 8px;
    border-top: 1px solid var(--border);
    padding-top: 2px;
    justify-content: space-between;
  }
  .lb-stat {
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 3px;
    text-align: center;
    padding: 6px 4px;
    border-right: 1px solid var(--border);
  }
  .lb-stat .lb-tooltip-wrap[tabindex] {
    min-height: unset;
    display: inline;
  }
  .lb-stat:last-child { border-right: none; }
  .lb-stat-value { font-size: 15px; }
  .lb-stat-label { font-size: 8px; white-space: normal; text-align: center; }
}

.lb-stat-value--shimmer {
  background: linear-gradient(90deg, var(--green) 0%, #fff 45%, #afffdc 55%, var(--green) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lb-stat-shimmer 2s linear infinite;
}
@keyframes lb-stat-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.lb-stat-label { font-size: 9px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--text-dim); line-height: 1.25; white-space: nowrap; }
.lb-pts { font-size: 20px; font-weight: 800; color: var(--accent); flex-shrink: 0; white-space: nowrap; }
.lb-pts-label { font-size: 13px; font-weight: 500; color: var(--text-dim); }

.lb-name-row { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }

.lb-name-line { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.lb-badges { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; width: 100%; }

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
@media (min-width: 480px) {
  .lb-today-tomorrow { font-size: 14px; }
  .lb-tt-label { font-size: 12px; }
}
.lb-tt-sep { margin: 0 4px; opacity: 0.4; }

.lb-player-link {
  display: block; width: 100%;
  padding: 7px 14px;
  border: none; border-top: 1px solid var(--border);
  background: transparent;
  color: var(--accent);
  font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  text-align: center; cursor: pointer;
  opacity: 0.6;
  transition: opacity .15s, background .15s;
}
.lb-player-link:hover { opacity: 1; background: rgba(255,45,120,0.05); }

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
.win-path-disclaimer {
  font-size: 11px; font-weight: 600; letter-spacing: .04em;
  color: #ffd264; opacity: 0.7;
  margin: -8px 0 12px;
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

/* ── Bracket CTA ──────────────────────────────────────────────── */
.bracket-cta-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 15px 20px;
  margin: 16px 0 10px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(189,95,255,0.15) 0%, rgba(13,10,30,0.9) 50%, rgba(255,45,120,0.15) 100%);
  box-shadow:
    0 0 0 1px rgba(189,95,255,0.5),
    0 0 18px rgba(189,95,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.06);
  color: #fff;
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s cubic-bezier(.4,0,.2,1);
}
.bracket-cta-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.04) 50%, transparent 80%);
  background-size: 300% auto;
  animation: btn-shimmer 7s linear infinite;
  pointer-events: none;
}
.bracket-cta-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255,45,120,0.55),
    0 0 18px rgba(255,45,120,0.14),
    inset 0 1px 0 rgba(255,255,255,0.08);
}
.bracket-cta-btn:active {
  transform: translateY(1px) scale(0.97);
  transition: transform 0.07s ease, box-shadow 0.07s ease;
}
.bracket-cta-btn .schedule-btn-label {
  background: linear-gradient(90deg, var(--purple) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.bracket-cta-btn .schedule-btn-icon { color: var(--purple); }
.bracket-cta-btn .schedule-btn-arrow { color: var(--accent); opacity: 0.7; }

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
.elim-feed { padding: 4px 0; margin-bottom: 20px; }
.elim-row {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.elim-row:last-child { border-bottom: none; }
.elim-meta {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.elim-stage {
  font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  color: var(--purple); background: rgba(189,95,255,0.12);
  border: 1px solid rgba(189,95,255,0.25); border-radius: 20px; padding: 1px 7px;
}
.elim-date { font-size: 11px; color: var(--text-dim); }
.elim-matchup {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.elim-winner, .elim-loser {
  display: flex; align-items: center; gap: 8px; flex: 1;
}
.elim-loser { justify-content: flex-end; }
.elim-info--right { text-align: right; }
.elim-flag { font-size: 20px; line-height: 1; }
.elim-team { display: block; font-size: 13px; font-weight: 700; color: var(--text); }
.elim-players { display: block; font-size: 11px; font-weight: 600; }
.elim-players--killer { color: var(--cyan); }
.elim-players--victim { color: #ff6b6b; }
.elim-score {
  font-size: 13px; font-weight: 800; color: var(--text-dim);
  white-space: nowrap; padding: 0 8px;
}
.elim-empty { font-size: 13px; color: var(--text-dim); padding: 12px 16px; }

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
    grid-template-columns: 44px 1fr auto auto;
    gap: 0 16px;
    padding: 0 20px 8px;
    font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    color: var(--text-dim);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 6px;
  }
  .lb-header-pts { text-align: right; padding-right: 4px; }

  .lb-row { position: relative; }

  .lb-main {
    display: grid;
    grid-template-columns: 44px 1fr auto auto;
    align-items: stretch;
    gap: 0 16px;
    padding: 12px 20px;
  }

  .lb-rank {
    grid-column: 1; grid-row: 1;
    align-self: center;
    width: 32px; height: 32px; font-size: 15px;
  }
  .lb-center {
    grid-column: 2; grid-row: 1;
    display: flex; flex-direction: column; gap: 5px;
  }
  .lb-right {
    grid-column: 3; grid-row: 1;
    display: flex; flex-direction: column;
    align-items: flex-end; justify-content: center;
    gap: 10px; margin-top: 0;
  }
  .lb-pts {
    grid-column: 4; grid-row: 1;
    align-self: center;
    font-size: 24px; text-align: right;
  }

  .lb-name { font-size: 20px; }

  .lb-flags { gap: 5px; }
  .lb-flag { font-size: 26px; }

  .lb-stats-row { margin-top: 0; gap: 20px; }
  .lb-stat { padding-top: 0; }
  .lb-stat-value { font-size: 16px; }

  .lb-pts-label { font-size: 14px; }

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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: auto;
    right: auto;
    width: calc(100vw - 48px);
    max-width: none;
    font-size: 14px;
    line-height: 1.5;
    padding: 16px 18px;
    border-radius: 14px;
    z-index: 9999;
    text-align: center;
    box-shadow: 0 0 0 1px rgba(255,45,120,0.2), 0 24px 60px rgba(0,0,0,0.75);
  }
  .lb-tooltip::after { display: none; }
  .lb-badges { gap: 8px; }
  .lb-tooltip-wrap[tabindex] { min-height: 28px; display: inline-flex; align-items: center; }
}
</style>
