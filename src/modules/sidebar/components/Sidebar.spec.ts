import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sidebar from './Sidebar.vue'
import { vuetify } from '../../../tests/setupVuetify'
import { createRouter, createMemoryHistory } from 'vue-router'

// Mock ResizeObserver (Vuetify lo usa internamente)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Mock del store Pinia
vi.mock('../store/useSidebar.store', () => ({
  useSidebarStore: () => ({
    isRail: false,
    toggleRail: vi.fn(),
  }),
}))

// Router de prueba (real, no mock)
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/people', component: { template: '<div>People Page</div>' } },
    { path: '/planets', component: { template: '<div>Planets Page</div>' } },
  ],
})

beforeEach(async () => {
  // Nos aseguramos de iniciar en /planets en cada test
  await router.push('/planets')
  await router.isReady()
})

describe('Sidebar', () => {
  it('renderiza correctamente y muestra los ítems', async () => {
    const wrapper = mount({
      components: { Sidebar },
      template: '<v-app><Sidebar /></v-app>',
    }, {
      global: {
        plugins: [vuetify, router],
      },
    })

    expect(wrapper.text()).toContain('People')
    expect(wrapper.text()).toContain('Planets')
    expect(wrapper.find('img[alt="Star Wars Logo"]').exists()).toBe(true)
  })

  it('aplica color primario al item activo según la ruta', async () => {
    const wrapper = mount({
      components: { Sidebar },
      template: '<v-app><Sidebar /></v-app>',
    }, {
      global: {
        plugins: [vuetify, router],
      },
    })

    const activeItems = wrapper.findAll('[class*="v-list-item--active"]')
    expect(activeItems.length).toBeGreaterThan(0)
    expect(activeItems[0].text()).toContain('Planets')
  })
})
