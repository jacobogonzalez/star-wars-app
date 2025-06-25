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

    <div>
  <v-skeleton-loader
    v-if="loading"
    type="card@5"
    class="mb-4"
  />
  
  <v-row v-else dense>
    <v-col
      v-for="item in items"
      :key="item.name"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card
        class="ma-2"
        outlined
        elevation="2"
        hover
        ripple
        @click="$emit('row-click', item)"
        style="cursor: pointer;"
      >
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-subtitle class="grey--text text--darken-1">
          {{ item.created }}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>

  <v-alert
    v-if="!loading && items.length === 0"
    type="info"
    border="start"
    variant="tonal"
    class="mt-4"
  >
    No hay resultados.
  </v-alert>
</div>
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
