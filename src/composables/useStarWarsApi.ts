// src/composables/useStarWarsApi.ts
import { ref, watch, computed, type Ref } from 'vue' // Importa 'computed'

export type StarWarsEntity = {
  name: string
  created: string
  url: string
  [key: string]: any
}

export function useStarWarsApi(entity: 'people' | 'planets') {
  const rawData = ref<StarWarsEntity[]>([])     // Datos originales de la API
  const filteredAndSortedResults: Ref<StarWarsEntity[]> = ref([]) // Datos filtrados y ordenados
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // page, search, sortKey, sortAsc ahora son "input" para el composable si se usan para refiltrar/reordenar
  // pero ya NO gestionan la paginación de la tabla directamente aquí.
  const search = ref('')
  const sortKey = ref<'name' | 'created' | string>('name') // Haz string para flexibilidad
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

  // Función para filtrar y ordenar y actualizar filteredAndSortedResults
  function applyFiltersAndSort() {
    let currentResults = [...rawData.value]; // Trabaja con una copia

    // 1. Filtrar
    if (search.value) {
      currentResults = currentResults.filter(item =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
      );
    }

    // 2. Ordenar
    if (sortKey.value) {
      currentResults = currentResults.sort((a, b) => {
        const aVal = a[sortKey.value];
        const bVal = b[sortKey.value];

        // Manejo de valores nulos/indefinidos
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return sortAsc.value ? 1 : -1;
        if (bVal === undefined) return sortAsc.value ? -1 : 1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        // Asumiendo que si no son strings, son comparables directamente (números, etc.)
        return sortAsc.value ? (aVal > bVal ? 1 : -1) : (bVal > aVal ? 1 : -1);
      });
    }

    filteredAndSortedResults.value = currentResults;
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

  // Watch para aplicar filtros y ordenación cuando cambie búsqueda, orden o rawData
  watch([search, sortKey, sortAsc, rawData], applyFiltersAndSort, { immediate: true })

  // Carga inicial y cuando cambie la entidad
  watch(() => entity, fetchData, { immediate: true })

  // totalResults es crucial para v-data-table, es el número de elementos después de filtrar/ordenar
  const totalResults = computed(() => filteredAndSortedResults.value.length);

  return {
    // rawData, // No es necesario exponer rawData directamente al componente
    results: filteredAndSortedResults, // Ahora 'results' es la lista ya filtrada y ordenada
    totalResults, // Exponemos el total para la paginación de la tabla
    loading,
    error,
    // page ya no es necesario aquí para la paginación de la tabla,
    // v-data-table la gestionará internamente.
    search,
    sortKey,
    sortAsc,
    // updateResults ya no es necesario exponerla, se llama internamente por el watch
    // Añadido para detalle
    selectedItem,
    loadingDetail,
    errorDetail,
    fetchDetail,
  }
}