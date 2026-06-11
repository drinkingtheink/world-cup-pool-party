<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <span class="header-logo">⚽</span>
        <h1 class="header-title">WC Pool <span class="header-year">2026</span></h1>
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
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:         #0d0f14;
  --surface:    #161a23;
  --surface2:   #1e2330;
  --border:     #2a3044;
  --accent:     #c9a84c;
  --accent-dim: #8a6e2f;
  --text:       #e8eaf0;
  --text-dim:   #8892a4;
  --green:      #3ecf6c;
  --red:        #e05252;
  --blue:       #4fa3e0;
  --tab-h:      60px;
  --header-h:   52px;
  --radius:     10px;
}

html, body { height: 100%; overflow: hidden; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
#app { height: 100%; }
.app { display: flex; flex-direction: column; height: 100dvh; }
a { color: inherit; text-decoration: none; }

.app-header { background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; }
.header-inner { display: flex; align-items: center; gap: 8px; padding: 0 16px; height: var(--header-h); }
.header-logo { font-size: 20px; }
.header-title { flex: 1; font-size: 17px; font-weight: 700; letter-spacing: .02em; }
.header-year { color: var(--accent); }

.app-main { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }

.tab-bar { display: flex; flex-shrink: 0; height: var(--tab-h); background: var(--surface); border-top: 1px solid var(--border); padding-bottom: env(safe-area-inset-bottom); }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: var(--text-dim); transition: color .15s; }
.tab--active { color: var(--accent); }
.tab-icon { font-size: 18px; line-height: 1; }
.tab-label { font-size: 10px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }

.view { padding: 16px; }
.view-title { font-size: 12px; font-weight: 700; color: var(--text-dim); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.pill { display: inline-flex; align-items: center; font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 2px 7px; border-radius: 99px; }
.pill-t1 { background: #4a3a1a; color: #f0c060; }
.pill-t2 { background: #1a2f3a; color: #60b0e0; }
.pill-t3 { background: #1a3328; color: #60d0a0; }
.pill-t4 { background: #2e1a2e; color: #c080e0; }
.pill-chosen { background: #2a3a1a; color: #90d050; }
</style>
