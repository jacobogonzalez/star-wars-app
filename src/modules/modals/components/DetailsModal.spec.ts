import { mount } from '@vue/test-utils'
import { expect, it, afterEach } from 'vitest'
import DetailsModal from './DetailsModal.vue'
import { vuetify } from '../../../tests/setupVuetify'

it('renders with Vuetify context', async () => {
  // Mount the component to the real DOM
  const wrapper = mount(DetailsModal, {
    attachTo: document.body,
    props: {
      modelValue: true,
      item: { name: 'Test' }
    },
    global: {
      plugins: [vuetify]
    }
  })

  // Wait for Vue to update the DOM
  await wrapper.vm.$nextTick()

  // Since the content is teleported, we check the entire body
  expect(document.body.innerHTML).toContain('Test')

  wrapper.unmount()
})

afterEach(() => {
  // Clean up the DOM after each test to avoid conflicts
  document.body.innerHTML = ''
})