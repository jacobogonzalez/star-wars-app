<template>
  <div class="pa-4">
    <!-- Búsqueda -->
    <v-text-field
      v-model="localSearch"
      label="Buscar"
      append-icon="mdi-magnify"
      hide-details
      class="mb-4"
    />

    <!-- Ordenar por -->
    <v-row dense class="mb-2">
      <v-col cols="6">
        <v-select
          v-model="localSortBy"
          :items="sortOptions"
          label="Ordenar por"
          hide-details
        />
      </v-col>
      <v-col cols="6" class="d-flex align-center">
        <v-btn
          @click="localSortDesc = !localSortDesc"
          size="small"
          variant="tonal"
        >
          <v-icon start>
            {{ localSortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
          </v-icon>
          {{ localSortDesc ? 'Descendente' : 'Ascendente' }}
        </v-btn>
      </v-col>
    </v-row>

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

watch(localSearch, val => emit('update:search', val))
watch(localSortBy, val => emit('update:sortBy', val))
watch(localSortDesc, val => emit('update:sortDesc', val))

// Opciones de ordenamiento visibles
const sortOptions = [
  { title: 'Nombre', value: 'name' },
  { title: 'Fecha de creación', value: 'created' },
  // Puedes añadir más si tu composable lo permite
]
</script>
