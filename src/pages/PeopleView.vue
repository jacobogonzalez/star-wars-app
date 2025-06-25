<script setup lang="ts">
import { computed } from 'vue'
import { useStarWarsApi, type StarWarsEntity } from '@/composables/useStarWarsApi'

const {
  page, search, sortKey, sortAsc, loading, error, results,
  selectedItem, loadingDetail, errorDetail, fetchDetail,
} = useStarWarsApi('people')

const itemsPerPage = 10

const pagedResults = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return results.value.slice(start, start + itemsPerPage)
})

function onSelect(item: StarWarsEntity) {
  fetchDetail(extractIdFromUrl(item.url))
}

// Extrae el id del final de la URL
function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] || parts[parts.length - 2]
}
</script>

<template>
  <div>
    <h1>People</h1>

    <input v-model="search" placeholder="Buscar por nombre..." />

    <select v-model="sortKey">
      <option value="name">Nombre</option>
      <option value="created">Creado</option>
    </select>

    <button @click="sortAsc = !sortAsc">
      Orden {{ sortAsc ? 'Ascendente' : 'Descendente' }}
    </button>

    <div v-if="loading">Cargando...</div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="!loading && results.length === 0">No hay resultados</div>

    <ul v-if="pagedResults.length > 0">
      <li
        v-for="item in pagedResults"
        :key="item.url"
        @click="onSelect(item)"
        style="cursor: pointer; user-select: none; padding: 0.3rem;"
      >
        {{ item.name }} - {{ item.created }}
      </li>
    </ul>

    <div style="margin-top: 1rem;">
      <button :disabled="page === 1" @click="page--">Anterior</button>
      <span>Página {{ page }} de {{ Math.ceil(results.length / itemsPerPage) }}</span>
      <button :disabled="page * itemsPerPage >= results.length" @click="page++">Siguiente</button>
    </div>

    <div v-if="loadingDetail" style="margin-top: 1rem;">Cargando detalles...</div>
    <div v-if="errorDetail" style="color: red; margin-top: 1rem;">Error: {{ errorDetail }}</div>

    <div v-if="selectedItem" style="margin-top: 1rem; border: 1px solid #ccc; padding: 1rem;">
      <h2>Detalles</h2>
      <pre>{{ selectedItem }}</pre>
    </div>
  </div>
</template>
