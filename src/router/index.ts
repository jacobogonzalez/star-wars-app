import { createRouter, createWebHistory } from 'vue-router'
import PeopleView from '@/pages/PeopleView.vue'
import PlanetsView from '@/pages/PlanetsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/people',
  },
  {
    path: '/people',
    name: 'People',
    component: PeopleView,
  },
  {
    path: '/planets',
    name: 'Planets',
    component: PlanetsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
