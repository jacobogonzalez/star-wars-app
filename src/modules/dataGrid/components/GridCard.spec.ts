// src\modules\dataGrid\components\GridCard.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import GridCard from './GridCard.vue'
import { vuetify } from '../../../tests/setupVuetify'

describe('GridCard', () => {
  const planet = {
    name: 'Tatooine',
    created: '1977-05-25',
    diameter: 10465,
    climate: 'arid',
    films: ['A New Hope', 'Return of the Jedi'],
  }

  const person = {
    name: 'Luke Skywalker',
    created: '1977-05-25',
    gender: 'male',
    height: 172,
    films: ['A New Hope', 'Empire Strikes Back', 'Return of the Jedi'],
  }

  it('renders planet info when item has diameter', () => {
    const wrapper = mount(GridCard, {
      props: { item: planet },
      global: {
      plugins: [vuetify]
    }
    })

    expect(wrapper.text()).toContain('Tatooine')
    expect(wrapper.text()).toContain('1977-05-25')
    expect(wrapper.text()).toContain('Climate:')
    expect(wrapper.text()).toContain('arid')
    expect(wrapper.text()).toContain('Diameter:')
    expect(wrapper.text()).toContain('10465 km')
    expect(wrapper.text()).toContain('Films:')
    expect(wrapper.text()).toContain('2')
  })

  it('renders person info when item does not have diameter', () => {
    const wrapper = mount(GridCard, {
      props: { item: person },
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.text()).toContain('Luke Skywalker')
    expect(wrapper.text()).toContain('1977-05-25')
    expect(wrapper.text()).toContain('Gender:')
    expect(wrapper.text()).toContain('male')
    expect(wrapper.text()).toContain('Height:')
    expect(wrapper.text()).toContain('172 cm')
    expect(wrapper.text()).toContain('Films:')
    expect(wrapper.text()).toContain('3')
  })
})
