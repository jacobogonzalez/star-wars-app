<script setup lang="ts">
import { computed } from 'vue'
import { useStarWarsApi, type StarWarsEntity } from '@/composables/useStarWarsApi'
import DataTable from '@/components/DataTable.vue' // Ajusta la ruta si es necesario

const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Género', key: 'gender', sortable: true },
  { title: 'Altura (cm)', key: 'height', sortable: true },
  { title: 'Peso (kg)', key: 'mass', sortable: true },
  { title: 'Fecha de Creación', key: 'created', sortable: true },
];

const {
  results,          // Now holds the filtered and sorted data
  totalResults,     // Total count of filtered and sorted items
  loading,
  error,
  search,           // Will be updated by DataTable's search field
  sortKey,          // DataTable's sorting will update these
  sortAsc,          // DataTable's sorting will update these
  selectedItem,
  loadingDetail,
  errorDetail,
  fetchDetail,
} = useStarWarsApi('people')

// This computed property is no longer needed because DataTable handles pagination
// const pagedResults = computed(() => {
//   const start = (page.value - 1) * itemsPerPage
//   return results.value.slice(start, start + itemsPerPage)
// })

function onRowClick(item: StarWarsEntity) {
  fetchDetail(extractIdFromUrl(item.url))
}

function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] || parts[parts.length - 2]
}
</script>

<template>
  <div>
    <h1>People</h1>

    <div v-if="loading && results.length === 0">Cargando datos iniciales...</div>
    <div v-if="error">Error: {{ error }}</div>
    <!-- <div v-if="!loading && results.length === 0 && !error">No hay resultados disponibles.</div> -->


    <DataTable
      v-if="!loading"
      :headers="headers"
      :items="results"       :loading="loading"
      :search="search"
      @update:search="(value: any) => search = value"
      @row-click="onRowClick"
    />

    <div v-if="loadingDetail" style="margin-top: 1rem;">Cargando detalles...</div>
    <div v-if="errorDetail" style="color: red; margin-top: 1rem;">Error: {{ errorDetail }}</div>

    <div v-if="selectedItem" style="margin-top: 1rem; border: 1px solid #ccc; padding: 1rem;">
      <h2>Detalles de {{ selectedItem.name }}</h2>
      <pre>{{ selectedItem }}</pre>
    </div>
  </div>
</template>