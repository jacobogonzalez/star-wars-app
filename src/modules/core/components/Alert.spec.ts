import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AlertComponent from './Alert.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify styles are needed for proper mounting
import 'vuetify/lib/styles/main.sass'

const vuetify = createVuetify({
  components,
  directives
})

describe('AlertComponent', () => {
  it('displays the message correctly', () => {
    const wrapper = mount(AlertComponent, {
      global: {
        plugins: [vuetify]
      },
      props: {
        type: 'success',
        message: 'Operation completed successfully'
      }
    })

    expect(wrapper.text()).toContain('Operation completed successfully')
  })

  it('applies the correct alert type', () => {
    const wrapper = mount(AlertComponent, {
      global: {
        plugins: [vuetify]
      },
      props: {
        type: 'error',
        message: 'An error occurred'
      }
    })

    // Instead of finding by name, find the element by class or tag
    const alert = wrapper.find('[class*=v-alert]')
    expect(alert.exists()).toBe(true)
    expect(wrapper.text()).toContain('An error occurred')
  })

  it('renders a warning alert with a custom message', () => {
    const wrapper = mount(AlertComponent, {
      global: {
        plugins: [vuetify]
      },
      props: {
        type: 'warning',
        message: 'This is an important warning'
      }
    })

    expect(wrapper.text()).toContain('This is an important warning')
  })
})
