import { createRouter, createWebHistory } from 'vue-router'
import PeoplesView from '../modules/peoples/views/PeoplesView.vue'
import PlanetsView from '../modules/planets/views/PlanetsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/people',
  },
  {
    path: '/people',
    name: 'People',
    component: PeoplesView,
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
