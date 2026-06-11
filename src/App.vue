<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <h1 class="header-title">World Cup Pool Party</h1>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <nav class="tab-bar">
      <router-link to="/"         class="tab" active-class="tab--active">
        <span class="tab-icon">🏆</span>
        <span class="tab-label">Standings</span>
      </router-link>
      <router-link to="/matches"  class="tab" active-class="tab--active">
        <span class="tab-icon">📅</span>
        <span class="tab-label">Matches</span>
      </router-link>
      <router-link to="/my-teams" class="tab" active-class="tab--active">
        <span class="tab-icon">👤</span>
        <span class="tab-label">My Teams</span>
      </router-link>
      <router-link to="/teams"    class="tab" active-class="tab--active">
        <span class="tab-icon">🌍</span>
        <span class="tab-label">Teams</span>
      </router-link>
      <router-link to="/rules"    class="tab" active-class="tab--active">
        <span class="tab-icon">📋</span>
        <span class="tab-label">Rules</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
</script>

<style>
:root {
  --bg:        #080612;
  --surface:   #100c20;
  --surface2:  #1a1436;
  --border:    #2e2060;
  --accent:    #ff2d78;
  --accent-dim:#8c1040;
  --cyan:      #00e5ff;
  --purple:    #bd5fff;
  --text:      #f0e8ff;
  --text-dim:  #c8baee;
  --green:     #00ff9f;
  --red:       #ff3366;
  --blue:      #00e5ff;
  --tab-h:     60px;
  --header-h:  56px;
  --radius:    10px;

  --glow-pink: 0 0 8px rgba(255,45,120,0.5), 0 0 24px rgba(255,45,120,0.2);
  --glow-cyan: 0 0 8px rgba(0,229,255,0.5), 0 0 24px rgba(0,229,255,0.2);
}

body {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  background: var(--bg);
  background-image:
    linear-gradient(rgba(189,95,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(189,95,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

.app { display: flex; flex-direction: column; height: 100dvh; }

/* ── Header ─────────────────────────────────────────────────────── */
.app-header {
  background: linear-gradient(180deg, #130e28 0%, #0e0a20 100%);
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(90deg, var(--accent), var(--cyan)) 1;
  flex-shrink: 0;
}
.header-inner {
  display: flex; align-items: center;
  padding: 0 16px; height: var(--header-h);
}
.header-title {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 15px; font-weight: 800;
  letter-spacing: .06em; text-transform: uppercase;
  background: linear-gradient(90deg, var(--accent) 0%, var(--cyan) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Main scroll area ────────────────────────────────────────────── */
.app-main { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }

/* ── Tab bar ─────────────────────────────────────────────────────── */
.tab-bar {
  display: flex; flex-shrink: 0; height: var(--tab-h);
  background: linear-gradient(0deg, #130e28 0%, #0e0a20 100%);
  border-top: 1px solid transparent;
  border-image: linear-gradient(90deg, var(--accent), var(--cyan)) 1;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px;
  color: var(--text-dim); transition: color .2s, text-shadow .2s;
}
.tab--active {
  color: var(--accent);
  text-shadow: var(--glow-pink);
}
.tab-icon { font-size: 18px; line-height: 1; }
.tab-label { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

/* ── View shell ──────────────────────────────────────────────────── */
.view { padding: 16px; }
.view-title {
  font-family: 'Orbitron', system-ui, sans-serif;
  font-size: 10px; font-weight: 700; color: var(--text-dim);
  letter-spacing: .12em; text-transform: uppercase; margin-bottom: 12px;
}

/* ── Cards ───────────────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

/* ── Tier pills ──────────────────────────────────────────────────── */
.pill {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
  padding: 2px 8px; border-radius: 99px;
}
.pill-t1 { background: rgba(255,45,120,0.15); color: #ff6fa0; border: 1px solid rgba(255,45,120,0.35); }
.pill-t2 { background: rgba(0,229,255,0.12); color: #00e5ff; border: 1px solid rgba(0,229,255,0.3); }
.pill-t3 { background: rgba(0,255,159,0.1);  color: #00ff9f; border: 1px solid rgba(0,255,159,0.25); }
.pill-t4 { background: rgba(189,95,255,0.12); color: #bd5fff; border: 1px solid rgba(189,95,255,0.3); }
.pill-chosen { background: rgba(0,229,255,0.1); color: #00e5ff; border: 1px solid rgba(0,229,255,0.25); }
</style>
