<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStarWarsApi, type StarWarsEntity } from '../composables/useStarWarsApi'
import DataTable from '../components/DataTable.vue'
import DataList from '../components/DataList.vue'
import DetailModal from '../components/DetailsModal.vue'
import HeaderWithViewToggle from '../components/HeaderWithViewToggle.vue'

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
  { title: 'Fecha de Creación', key: 'created', sortable: true },
]

const {
  results,
  loading,
  error,
  search,
  sortKey,
  sortAsc,
  selectedItem,
  loadingDetail,
  errorDetail,
  fetchDetail,
} = useStarWarsApi('planets')

// Modal
const showDetailModal = ref(false)
function onRowClick(item: StarWarsEntity) {
  fetchDetail(extractIdFromUrl(item.url))
  showDetailModal.value = true
}
function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] || parts[parts.length - 2]
}

// 🔁 Alternar entre tabla y lista
const viewMode = ref<'table' | 'list'>('table')

// 📄 Paginación
const itemsPerPage = 10
const page = ref(1)
const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return results.value.slice(start, start + itemsPerPage)
})
const pageCount = computed(() => Math.ceil(results.value.length / itemsPerPage))
</script>

<template>
  <div class="d-flex flex-column h-100">
    <HeaderWithViewToggle
      title="Planets"
      :viewMode="viewMode"
      @update:viewMode="mode => viewMode = mode"
    />

    <component
      :is="viewMode === 'table' ? DataTable : DataList"
      :items="paginatedItems"
      :headers="headers"
      :loading="loading"
      :search="search"
      :sort-by="sortKey"
      :sort-desc="!sortAsc"
      @update:search="(val: string) => search = val"
      @update:sort-by="(key: string) => sortKey = key"
      @update:sort-desc="(desc: any) => sortAsc = !desc"
      @row-click="onRowClick"
    />

    <v-pagination
    v-if="viewMode === 'list'"
      v-model="page"
      :length="pageCount"
      class="mt-4 align-self-center"
    />

    <DetailModal
      v-model:modelValue="showDetailModal"
      :item="selectedItem"
      :loading="loadingDetail"
      :error="errorDetail"
    />
  </div>
</template>
