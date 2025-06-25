<template>
  <div class="pa-4">
 <div class="d-flex align-center justify-end mb-4" style="gap: 0.5rem; flex-wrap: wrap;">
  <v-select
    v-model="localSortCombined"
    :items="combinedSortOptions"
    label="Ordenar por"
    hide-details
    dense
    style="max-width: 250px;"
    variant="outlined"
    density="compact"
  />
  
  <v-text-field
    v-model="localSearch"
    label="Buscar..."
    single-line
    hide-details
    variant="outlined"
    dense
    style="max-width: 250px;"
    append-inner-icon="mdi-magnify"
    density="compact"
  />
</div>

    <!-- Lista -->
    <v-list two-line>
      <v-skeleton-loader
        v-if="loading"
        type="list-item@5"
      />
      <v-list-item
        v-for="item in items"
        :key="item.name"
        @click="$emit('row-click', item)"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.created }}</v-list-item-subtitle>
      </v-list-item>
      <v-alert v-if="!loading && items.length === 0" type="info" border="start" variant="tonal">
        No hay resultados.
      </v-alert>
    </v-list>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  items: any[]
  search: string
  loading: boolean
  sortBy: string
  sortDesc: boolean
}>()

const emit = defineEmits([
  'update:search',
  'update:sortBy',
  'update:sortDesc',
  'row-click',
])

// Local bindings to debounce or isolate input
const localSearch = ref(props.search)
const localSortBy = ref(props.sortBy)
const localSortDesc = ref(props.sortDesc)
const localSortCombined = ref('name:asc')

// Para separar el campo y la dirección cuando se actualiza:
watch(localSortCombined, val => {
  const [sortBy, sortDir] = val.split(':')
  emit('update:sortBy', sortBy)
  emit('update:sortDesc', sortDir === 'desc')
})
watch(localSearch, val => emit('update:search', val))
watch(localSortBy, val => emit('update:sortBy', val))
watch(localSortDesc, val => emit('update:sortDesc', val))

// Opciones de ordenamiento visibles
const combinedSortOptions = [
  { title: 'Nombre Ascendente', value: 'name:asc' },
  { title: 'Nombre Descendente', value: 'name:desc' },
  { title: 'Fecha Ascendente', value: 'created:asc' },
  { title: 'Fecha Descendente', value: 'created:desc' },
];
</script>
