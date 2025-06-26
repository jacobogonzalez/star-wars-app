<template>
  <v-card width="100%" max-height="500px">
    <v-card-text>
      <div class="d-flex justify-end mb-4">
        <v-text-field
          :model-value="props.search"
          @update:model-value="value => emit('update:search', value as string)"
          label="Search..."
          single-line
          hide-details
          variant="outlined"
          dense
          style="max-width: 250px;"
          append-inner-icon="mdi-magnify"
          density="compact"
        ></v-text-field>
      </div>

      <v-data-table
        width="100%"
        height="360px"
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="url"
        @click:row="handleRowClick"
        :items-per-page="10"
      >
        <template v-slot:no-data>
          <div class="text-center pa-5">No results available.</div>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Define the structure for a header item, including title, key, and optional sortable property.
interface Props {
  headers: Array<{ title: string; key: string; sortable?: boolean }>;
  items: any[]; // These are the already filtered and sorted items provided to the table.
  loading: boolean; // Boolean indicating if data is currently being loaded.
  search?: string; // Optional search string, used for the v-text-field.
}

// Define the component's props and set a default value for 'search'.
const props = withDefaults(defineProps<Props>(), {
  search: '', // Default search string is empty.
});

// Define the custom events that this component can emit.
const emit = defineEmits<{
  (e: 'update:search', value: string): void; // Emits when the search input value changes.
  (e: 'row-click', item: any): void; // Emits when a table row is clicked, passing the clicked item.
}>();

// Handler for the row click event from v-data-table.
const handleRowClick = (_event: Event, { item }: { item: any }) => {
  // Emit the 'row-click' event with the clicked item.
  emit('row-click', item);
};
</script>

<style scoped>
/* Any specific styles for this component can be added here */
</style>