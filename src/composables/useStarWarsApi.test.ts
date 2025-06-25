import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useStarWarsApi } from './useStarWarsApi'

global.fetch = vi.fn()

const mockData = [
  { name: 'Luke Skywalker', created: '2020-01-01', url: 'url1' },
  { name: 'Darth Vader', created: '2019-01-01', url: 'url2' },
  { name: 'Leia Organa', created: '2021-01-01', url: 'url3' },
]

describe('useStarWarsApi', () => {
  beforeEach(() => {
    (fetch as any).mockReset()
  })

  it('fetches data and updates results', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    const {
      results,
      search,
      sortKey,
      sortAsc,
      loading,
      error,
      updateResults,
    } = useStarWarsApi('people')

    // Wait for fetch
    await new Promise((r) => setTimeout(r, 0))
    await nextTick()

    // ✅ Validar fetch inicial
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(results.value.length).toBe(3)

    // ✅ Test de filtro
    search.value = 'Luke'
    updateResults()
    expect(results.value.map((p) => p.name)).toEqual(['Luke Skywalker'])

    // ✅ Reset filtro antes de ordenar
    search.value = ''
    updateResults()

    // ✅ Test ordenamiento descendente por fecha de creación
    sortKey.value = 'created'
    sortAsc.value = false
    updateResults()

    expect(results.value.map(p => p.name)).toEqual([
      'Leia Organa',
      'Luke Skywalker',
      'Darth Vader',
    ])
  })

  it('handles fetch error', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    })

    const { error, loading } = useStarWarsApi('people')

    await new Promise((r) => setTimeout(r, 0))
    await nextTick()

    expect(error.value).toMatch(/Error 500/)
    expect(loading.value).toBe(false)
  })
})
