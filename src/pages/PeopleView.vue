<script setup lang="ts">
import { ref } from 'vue' // Importa ref para controlar la visibilidad del modal
import { useStarWarsApi, type StarWarsEntity } from '@/composables/useStarWarsApi'
import DataTable from '@/components/DataTable.vue'
import DetailModal from '@/components/DetailsModal.vue' // <-- Importa tu nuevo componente de modal

const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Género', key: 'gender', sortable: true, class: 'd-none d-sm-table-cell' },
  { title: 'Altura (cm)', key: 'height', sortable: true, class: 'd-none d-md-table-cell' },
  { title: 'Peso (kg)', key: 'mass', sortable: true, class: 'd-none d-md-table-cell' },
  { title: 'Fecha de Creación', key: 'created', sortable: true },
];

const {
  results,
  loading,
  error,
  search,
  selectedItem,
  loadingDetail,
  errorDetail,
  fetchDetail,
} = useStarWarsApi('people') // **Important: Remains 'people'**

// --- Nuevo estado para controlar la visibilidad del modal ---
const showDetailModal = ref(false)

function onRowClick(item: StarWarsEntity) {
  fetchDetail(extractIdFromUrl(item.url))
  showDetailModal.value = true // <-- Muestra el modal al hacer clic en la fila
}

function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] || parts[parts.length - 2]
}
</script>

<template>
  <div>
    <h1>People</h1>

    <!-- <div v-if="loading && results.length === 0 && !error">Cargando datos iniciales...</div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="!loading && results.length === 0 && !error">No hay resultados disponibles.</div> -->

    <DataTable
      :headers="headers"
      :items="results"
      :loading="loading"
      :search="search"
      @update:search="(value: any) => search = value"
      @row-click="onRowClick"
    />

    <DetailModal
      v-model:modelValue="showDetailModal"
      :item="selectedItem"
      :loading="loadingDetail"
      :error="errorDetail"
    />
  </div>
</template>