<template>
  <div class="view">
    <section class="rules-section card">
      <h2 class="rules-h">Team Selection</h2>
      <p class="rules-p">Each player <strong>freely picks all of their teams</strong>. No more than 2 Tier 1 teams. Duplicate picks are allowed across players.</p>
    </section>

    <section class="rules-section card">
      <h2 class="rules-h">Match Points</h2>
      <div class="rules-table">
        <div class="rules-row" v-for="r in matchPoints" :key="r.event">
          <span class="rules-event">{{ r.event }}</span>
          <span class="rules-pts">{{ r.pts }}</span>
        </div>
      </div>
    </section>

    <section class="rules-section card">
      <h2 class="rules-h">Knockout Multipliers</h2>
      <p class="rules-p rules-p--sub">All points earned in knockout rounds are multiplied.</p>
      <div class="rules-table">
        <div class="rules-row" v-for="r in multipliers" :key="r.stage">
          <span class="rules-event">{{ r.stage }}</span>
          <span class="rules-pts mult">×{{ r.mult }}</span>
        </div>
      </div>
    </section>

    <section class="rules-section card">
      <h2 class="rules-h">Tiebreakers</h2>
      <div class="tb-list">
        <div v-for="(t, i) in tiebreakers" :key="i" class="tb-row">
          <span class="tb-num">{{ i + 1 }}</span>
          <span class="tb-text">{{ t }}</span>
        </div>
      </div>
    </section>

    <section class="rules-section card">
      <h2 class="rules-h">Bonus Events</h2>
      <div class="rules-table">
        <div class="rules-row" v-for="b in bonuses" :key="b.event">
          <span class="rules-event">{{ b.event }}</span>
          <span class="rules-pts">+{{ b.pts }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const matchPoints = [
  { event: 'Win',        pts: '+3' },
  { event: 'Draw',       pts: '+1' },
  { event: 'Goal scored',pts: '+1 each' },
  { event: 'Clean sheet',pts: '+1' },
]
const multipliers = [
  { stage: 'Round of 32 / Round of 16', mult: 1.5 },
  { stage: 'Quarterfinal',              mult: 2   },
  { stage: 'Semifinal',                 mult: 3   },
  { stage: 'Final',                     mult: 4   },
]
const bonuses = [
  { event: 'Scored first',    pts: 1 },
  { event: 'Comeback win',    pts: 2 },
  { event: 'Won on penalties',pts: 2 },
]
const tiebreakers = [
  'Most total goals scored across all 6 teams',
  'Furthest single team advancement',
  'Best sealed pre-tournament predictions',
  'Rock-paper-scissors',
]
</script>

<style scoped>
.rules-section {
  margin-bottom: 12px; padding: 16px;
}
.rules-h {
  font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 10px;
}
.rules-p { font-size: 13px; color: #ffffff; line-height: 1.5; margin-bottom: 8px; }
.rules-p--sub { font-size: 12px; margin-top: -4px; }
.rules-p:last-child { margin-bottom: 0; }

.rules-table { display: flex; flex-direction: column; gap: 0; }
.rules-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;
}
.rules-row:last-child { border-bottom: none; padding-bottom: 0; }
.rules-event { color: #ffffff; }
.rules-pts { font-weight: 700; color: var(--green); }
.rules-pts.mult { color: var(--accent); }

.rules-list { padding-left: 18px; margin-top: 6px; }
.rules-list li { font-size: 13px; color: #ffffff; line-height: 1.7; }

.tb-list { display: flex; flex-direction: column; gap: 10px; }
.tb-row { display: flex; align-items: flex-start; gap: 12px; }
.tb-num {
  width: 22px; height: 22px; border-radius: 50%; background: var(--surface2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: var(--accent); flex-shrink: 0;
}
.tb-text { font-size: 13px; color: #ffffff; line-height: 1.4; }
</style>
