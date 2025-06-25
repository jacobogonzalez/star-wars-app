<script setup lang="ts">
import { ref, watch, computed } from 'vue';

// Define la interfaz para el objeto que el modal va a mostrar.
// Puede ser una StarWarsEntity o cualquier objeto con propiedades.
interface DetailItem {
  name?: string; // Asumiendo que muchos ítems tienen un 'name'
  title?: string; // Para entidades como Films o Starships que pueden tener 'title'
  [key: string]: any; // Para permitir cualquier otra propiedad dinámica
}

// Props del componente
interface Props {
  modelValue: boolean; // Usado para v-model:modelValue, controla la visibilidad del modal
  item: DetailItem | null; // El objeto con los detalles a mostrar
  loading?: boolean; // Para indicar si los detalles están cargando
  error?: string | null; // Para mostrar errores
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

// Emits del componente
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void; // Para cerrar el modal
}>();

// Control interno de la visibilidad del diálogo
// Usamos un computed property para enlazar con modelValue
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Función para formatear las propiedades del objeto para una mejor visualización.
// Excluye 'url' y cualquier otra propiedad que no quieras mostrar.
const formattedDetails = computed(() => {
  if (!props.item) return {};

  const details: { [key: string]: any } = {};
  for (const key in props.item) {
    // Excluir propiedades que son URLs o no son relevantes para mostrar directamente
    if (key !== 'url' && key !== 'films' && key !== 'vehicles' && key !== 'starships' && key !== 'species' && key !== 'homeworld' && key !== 'residents' && key !== 'pilots' && key !== 'characters' && key !== 'planets') {
      let value = props.item[key];

      // Capitalizar la primera letra de la clave para una mejor presentación
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

      // Puedes añadir lógica de formateo aquí para tipos específicos de datos
      if (typeof value === 'string' && value.startsWith('http')) {
        // Si el valor es una URL, quizás no quieras mostrarla o mostrarla de otra forma
        value = 'Ver enlazado'; // O simplemente no incluir esta clave-valor
      }

      details[formattedKey] = value;
    }
  }
  return details;
});

</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="750" persistent>
    <v-card elevation="12" class="rounded-lg d-flex flex-column" style="height: 80vh; max-height: 80vh;">
      <v-card-title class="headline font-weight-bold d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
        {{ props.item?.name || props.item?.title || 'Detalles del elemento' }}
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="dialogVisible = false" aria-label="Cerrar diálogo">
          <v-icon color="grey darken-1">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Contenido scrollable -->
      <v-card-text class="pa-6" style="flex: 1 1 auto; overflow-y: auto;">
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <p class="mt-4 subtitle-1 font-italic text--secondary">Cargando detalles...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <v-icon large color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
          <p class="subtitle-1 font-weight-medium" style="color: #b00020;">Error: {{ error }}</p>
        </div>

        <div v-else-if="!props.item" class="text-center py-8 text--secondary">
          <v-icon large class="mb-2">mdi-information-outline</v-icon>
          <p class="subtitle-1 font-weight-medium">No se ha seleccionado ningún elemento o los detalles no están disponibles.</p>
        </div>

        <v-container v-else fluid class="pa-0">
          <v-row dense>
            <v-col
              v-for="(value, key, index) in formattedDetails"
              :key="'detail-' + index"
              cols="12" sm="6" md="4"
            >
              <v-card outlined rounded class="pa-4">
                <div class="font-weight-bold text-primary mb-2" style="font-size: 0.9rem;">
                  {{ key }}
                </div>
                <div class="text-body-2" style="white-space: pre-wrap;">
                  {{ value }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Footer fijo -->
      <v-card-actions class="px-6 py-3" style="flex-shrink: 0;">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" @click="dialogVisible = false" elevation="2">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Puedes añadir estilos específicos para el modal aquí si es necesario */
</style>