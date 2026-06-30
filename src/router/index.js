import { createRouter, createWebHashHistory } from 'vue-router'

import Leaderboard from '../views/Leaderboard.vue'
import Matches from '../views/Matches.vue'
import MyTeams from '../views/MyTeams.vue'
import Rules from '../views/Rules.vue'
import Teams from '../views/Teams.vue'
import Bracket from '../views/Bracket.vue'

const routes = [
  { path: '/',        component: Leaderboard, meta: { tab: 'leaderboard' } },
  { path: '/matches', component: Matches,     meta: { tab: 'matches' } },
  { path: '/my-teams',component: MyTeams,     meta: { tab: 'my-teams' } },
  { path: '/bracket', component: Bracket,     meta: { tab: 'bracket' } },
  { path: '/teams',   component: Teams,       meta: { tab: 'teams' } },
  { path: '/rules',   component: Rules,       meta: { tab: 'rules' } },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
