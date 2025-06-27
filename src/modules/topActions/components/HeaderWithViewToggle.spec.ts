import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import HeaderWithViewToggle from './HeaderWithViewToggle.vue'
import { vuetify } from '../../../tests/setupVuetify'

// External mocks
const toggleDarkMode = vi.fn()
const toggleViewMode = vi.fn()

vi.mock('../store/useTopActions.store', () => ({
  useTopActionsStore: () => ({
    isDark: false,
    toggleDarkMode,
    currentViewMode: 'table', // Assuming 'table' is represented by mdi-view-list
    toggleViewMode,
  }),
}))

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

describe('HeaderWithViewToggle', () => {
  it('renders the title correctly', () => {
    const wrapper = mount(HeaderWithViewToggle, {
      props: { title: 'Listado de Planetas' }, // List of Planets
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.text()).toContain('Listado de Planetas')
  })

  it('displays the correct icons for dark mode and current view', () => {
    const wrapper = mount(HeaderWithViewToggle, {
      props: { title: 'My Title' },
      global: {
        plugins: [vuetify],
      },
    })

    const icons = wrapper.findAllComponents({ name: 'VIcon' })
    expect(icons[0].html()).toContain('mdi-weather-sunny') // Assuming initial state is light mode
    expect(icons[1].html()).toContain('mdi-view-list') // Assuming initial view mode is 'table'
  })

  it('calls store functions when buttons are clicked', async () => {
    const wrapper = mount(HeaderWithViewToggle, {
      props: { title: 'Test' },
      global: { plugins: [vuetify] },
    })

    const buttons = wrapper.findAllComponents({ name: 'VBtn' })
    await buttons[0].trigger('click') // Click the dark mode toggle
    await buttons[1].trigger('click') // Click the view mode toggle

    expect(toggleDarkMode).toHaveBeenCalled()
    expect(toggleViewMode).toHaveBeenCalled()
  })
})