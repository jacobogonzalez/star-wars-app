<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStarWarsApi, type StarWarsEntity } from '../composables/useStarWarsApi'
import DataTable from '../components/DataTable.vue'
import DataList from '../components/DataList.vue'
import DetailModal from '../components/DetailsModal.vue'

const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Género', key: 'gender', sortable: true },
  { title: 'Altura (cm)', key: 'height', sortable: true },
  { title: 'Peso (kg)', key: 'mass', sortable: true },
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
} = useStarWarsApi('people')

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

// 🔁 Alternar entre vista tabla y lista
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
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5 font-weight-bold">People</h1>
      <v-btn
        icon
        variant="text"
        :title="viewMode === 'table' ? 'Cambiar a lista' : 'Cambiar a tabla'"
        @click="viewMode = viewMode === 'table' ? 'list' : 'table'"
      >
        <v-icon>{{ viewMode === 'table' ? 'mdi-view-list' : 'mdi-table' }}</v-icon>
      </v-btn>
    </div>

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
