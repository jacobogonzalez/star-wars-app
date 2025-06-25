<script setup lang="ts">

interface Props {
  headers: Array<{ title: string; key: string; sortable?: boolean }>;
  items: any[]; // These are the already filtered and sorted items
  loading: boolean;
  search?: string; // This will be used for the v-text-field
}

const props = withDefaults(defineProps<Props>(), {
  search: '',
});

const emit = defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'row-click', item: any): void;
}>();

const handleRowClick = (event: Event, { item }: { item: any }) => {
  emit('row-click', item);
};
</script>

<template>
  <v-card width="100%">
    <v-card-text>
      <v-text-field
        :model-value="props.search"
        @update:model-value="value => emit('update:search', value as string)"
        label="Buscar..."
        single-line
        hide-details
        variant="solo-filled"
        class="mb-4"
      ></v-text-field>

      <v-data-table
        width="100%"
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="url"
        @click:row="handleRowClick"
        :items-per-page="10" >
        <template v-slot:no-data>
          <div class="text-center pa-5">No hay resultados disponibles.</div>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Any specific styles */
</style>