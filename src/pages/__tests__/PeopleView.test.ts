import { render, fireEvent } from '@testing-library/vue'
import PeopleView from '../PeopleView.vue'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

global.fetch = vi.fn()

const mockData = [
  { name: 'Luke Skywalker', created: '2020-01-01', url: 'url1' },
  { name: 'Darth Vader', created: '2019-01-01', url: 'url2' },
]

vi.mock('@/composables/useStarWarsApi', () => ({
  useStarWarsApi: () => {
    const results = ref(mockData)
    const loading = ref(false)
    const error = ref(null)
    const page = ref(1)
    const search = ref('')
    const sortKey = ref('name')
    const sortAsc = ref(true)
    const totalCount = ref(mockData.length)

    return {
      results,
      loading,
      error,
      page,
      search,
      sortKey,
      sortAsc,
      totalCount,
    }
  },
}))

describe('PeopleView', () => {
  it('renders people list', async () => {
    const { getByPlaceholderText, getByText } = render(PeopleView)

    // Usa una función matcher para evitar errores por texto compuesto
    expect(getByText((text) => text.includes('Luke Skywalker'))).toBeTruthy()
    expect(getByText((text) => text.includes('Darth Vader'))).toBeTruthy()

    const input = getByPlaceholderText('Buscar por nombre...')
    await fireEvent.update(input, 'Luke')

    expect(input).toHaveValue('Luke')
  })
})
