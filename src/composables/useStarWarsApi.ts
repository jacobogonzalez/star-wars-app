import { ref, watch, type Ref } from 'vue'

export type StarWarsEntity = {
  name: string
  created: string
  url: string
  [key: string]: any
}

export function useStarWarsApi(entity: 'people' | 'planets') {
  const rawData = ref<StarWarsEntity[]>([])    // Datos originales de la API
  const results: Ref<StarWarsEntity[]> = ref([])  // Datos filtrados y ordenados
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const search = ref('')
  const sortKey = ref<'name' | 'created'>('name')
  const sortAsc = ref(true)

  // Nuevo estado para detalle
  const selectedItem = ref<StarWarsEntity | null>(null)
  const loadingDetail = ref(false)
  const errorDetail = ref<string | null>(null)

  // Fetch solo una vez al cargar o cambiar entidad
  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const url = `https://swapi.info/api/${entity}`
      const data = await fetch(url).then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      rawData.value = data
    } catch (err: any) {
      error.value = err.message || 'Error al obtener datos'
      rawData.value = []
    } finally {
      loading.value = false
    }
  }

  // Función para filtrar, ordenar y actualizar results
  function updateResults() {
    let filtered = rawData.value.filter(item =>
      item.name.toLowerCase().includes(search.value.toLowerCase())
    )

    filtered = filtered.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      if (!aVal || !bVal) return 0
      return aVal < bVal ? (sortAsc.value ? -1 : 1) : aVal > bVal ? (sortAsc.value ? 1 : -1) : 0
    })

    results.value = filtered
  }

  // Fetch detalle de un ítem por ID (obtenido del URL)
  async function fetchDetail(id: string) {
    loadingDetail.value = true
    errorDetail.value = null
    selectedItem.value = null

    try {
      const url = `https://swapi.info/api/${entity}/${id}`
      const data = await fetch(url).then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })

      selectedItem.value = data
    } catch (err: any) {
      errorDetail.value = err.message || 'Error al obtener detalles'
    } finally {
      loadingDetail.value = false
    }
  }

  // Watch para actualizar resultados cuando cambie búsqueda, orden o rawData
  watch([search, sortKey, sortAsc, rawData], () => {
    page.value = 1 // reset pagina al cambiar filtro u orden
    updateResults()
  }, { immediate: true })

  // Carga inicial y cuando cambie la entidad
  watch(() => entity, fetchData, { immediate: true })

  return {
    rawData,
    results,
    loading,
    error,
    page,
    search,
    sortKey,
    sortAsc,
    updateResults,
    // Añadido para detalle
    selectedItem,
    loadingDetail,
    errorDetail,
    fetchDetail,
  }
}
