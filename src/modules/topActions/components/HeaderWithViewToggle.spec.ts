import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import HeaderWithViewToggle from './HeaderWithViewToggle.vue'
import { vuetify } from '../../../tests/setupVuetify'

// Mocks externos
const toggleDarkMode = vi.fn()
const toggleViewMode = vi.fn()

vi.mock('../store/useTopActions.store', () => ({
  useTopActionsStore: () => ({
    isDark: false,
    toggleDarkMode,
    currentViewMode: 'table',
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
  it('renderiza el título correctamente', () => {
    const wrapper = mount(HeaderWithViewToggle, {
      props: { title: 'Listado de Planetas' },
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.text()).toContain('Listado de Planetas')
  })

  it('muestra los íconos correctos para modo oscuro y vista actual', () => {
    const wrapper = mount(HeaderWithViewToggle, {
      props: { title: 'Mi Título' },
      global: {
        plugins: [vuetify],
      },
    })

    const icons = wrapper.findAllComponents({ name: 'VIcon' })
    expect(icons[0].html()).toContain('mdi-weather-sunny')
    expect(icons[1].html()).toContain('mdi-view-list')
  })

  it('llama a las funciones del store al hacer click en los botones', async () => {
    const wrapper = mount(HeaderWithViewToggle, {
      props: { title: 'Test' },
      global: { plugins: [vuetify] },
    })

    const buttons = wrapper.findAllComponents({ name: 'VBtn' })
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(toggleDarkMode).toHaveBeenCalled()
    expect(toggleViewMode).toHaveBeenCalled()
  })
})
