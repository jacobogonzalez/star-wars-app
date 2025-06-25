<script setup lang="ts">
import { computed } from 'vue' // 'computed' might not be strictly necessary here after changes, but keeping it doesn't hurt.
import { useStarWarsApi, type StarWarsEntity } from '@/composables/useStarWarsApi'
import DataTable from '@/components/DataTable.vue' // Adjust the path if necessary

// Define the headers for the Vuetify table specific to Planets
const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Período Rotacional', key: 'rotation_period', sortable: true },
  { title: 'Período Orbital', key: 'orbital_period', sortable: true },
  { title: 'Diámetro', key: 'diameter', sortable: true },
  { title: 'Clima', key: 'climate', sortable: true },
  { title: 'Gravedad', key: 'gravity', sortable: true },
  { title: 'Terreno', key: 'terrain', sortable: true },
  { title: 'Superficie Acuática', key: 'surface_water', sortable: true },
  { title: 'Población', key: 'population', sortable: true },
  { title: 'Fecha de Creación', key: 'created', sortable: true }, // Keep if relevant for planets
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
} = useStarWarsApi('planets') // **Important: Changed to 'planets'**

// The `pagedResults` computed property and manual pagination buttons are no longer needed
// because DataTable handles client-side pagination.

function onRowClick(item: StarWarsEntity) {
  // `item` will be the full StarWarsEntity object (planet data)
  fetchDetail(extractIdFromUrl(item.url))
}

function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  // This logic is generic and works for both people and planets
  return parts[parts.length - 1] || parts[parts.length - 2]
}
</script>

<template>
  <div>
    <h1>Planets</h1>

    <div v-if="loading && results.length === 0 && !error">Cargando datos iniciales...</div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="!loading && results.length === 0 && !error">No hay resultados disponibles.</div>


    <DataTable
      v-if="results.length > 0 || loading" :headers="headers"
      :items="results"
      :loading="loading"
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