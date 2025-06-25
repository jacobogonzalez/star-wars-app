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
  <v-dialog v-model="dialogVisible" max-width="600">
    <v-card>
      <v-card-title class="headline">
        {{ props.item?.name || props.item?.title || 'Detalles del elemento' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialogVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <div v-if="loading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">Cargando detalles...</p>
        </div>
        <div v-else-if="error" class="text-center py-4" style="color: red;">
          Error: {{ error }}
        </div>
        <div v-else-if="!props.item" class="text-center py-4">
          No se ha seleccionado ningún elemento o los detalles no están disponibles.
        </div>
        <div v-else>
          <v-list dense>
            <v-list-item v-for="(value, key) in formattedDetails" :key="key">
              <v-list-item-title class="font-weight-bold">{{ key }}:</v-list-item-title>
              <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialogVisible = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Puedes añadir estilos específicos para el modal aquí si es necesario */
</style>