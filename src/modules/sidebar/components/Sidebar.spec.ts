import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sidebar from './Sidebar.vue'
import { vuetify } from '../../../tests/setupVuetify'
import { createRouter, createMemoryHistory } from 'vue-router'

// Mock ResizeObserver (Vuetify uses it internally)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Mock the Pinia store
vi.mock('../store/useSidebar.store', () => ({
  useSidebarStore: () => ({
    isRail: false,
    toggleRail: vi.fn(),
  }),
}))

// Test router (real, not a mock)
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/people', component: { template: '<div>People Page</div>' } },
    { path: '/planets', component: { template: '<div>Planets Page</div>' } },
  ],
})

beforeEach(async () => {
  // Ensure we start at /planets for each test
  await router.push('/planets')
  await router.isReady()
})

describe('Sidebar', () => {
  it('renders correctly and displays the items', async () => {
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

  it('applies primary color to the active item based on the route', async () => {
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