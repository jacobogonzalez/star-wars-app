import { render, fireEvent } from '@testing-library/vue'
import PlanetsView from '../PlanetsView.vue'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

global.fetch = vi.fn()

const mockData = [
  { name: 'Tatooine', created: '2020-01-01', url: 'url1' },
  { name: 'Alderaan', created: '2019-01-01', url: 'url2' },
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

describe('PlanetsView', () => {
  it('renders planets list', async () => {
    const { getByPlaceholderText, getByText } = render(PlanetsView)

    expect(getByText((text) => text.includes('Tatooine'))).toBeInTheDocument()
    expect(getByText((text) => text.includes('Alderaan'))).toBeInTheDocument()

    // Aquí corregimos el placeholder para que coincida con el real
    const input = getByPlaceholderText('Buscar planeta por nombre...')
    await fireEvent.update(input, 'Tatooine')

    expect(input).toHaveValue('Tatooine')
  })
})
