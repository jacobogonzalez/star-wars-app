<template>
  <v-navigation-drawer v-model="drawer" :rail="sidebarStore.isRail" rail-width="72" permanent app>
    <v-list>
      <v-list-item class="pl-1">
        <template #prepend>
          <v-btn aria-label="Toggle sidebar mode" icon variant="text" @click="sidebarStore.toggleRail">
            <v-tooltip activator="parent" location="bottom">
              Toggle sidebar mode
            </v-tooltip>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list-item-title class="text-center" v-if="!sidebarStore.isRail">
          <img src="/images/star-wars-4.svg" alt="Star Wars Logo" height="50" />
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-list density="compact" nav>
      <v-list-item :active="$route.path === '/people' ? true : false"
        :color="$route.path === '/people' ? 'primary' : undefined" prepend-icon="mdi-account-circle" title="People"
        @click="$router.push('/')" />
      <v-divider></v-divider>
      <v-list-item :active="$route.path === '/planets' ? true : false"
        :color="$route.path === '/planets' ? 'primary' : undefined" prepend-icon="mdi-earth" title="Planets"
        @click="$router.push('/planets')" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useSidebarStore } from '../store/useSidebar.store'; // Adjust path as needed
// import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

// Reactive data properties
const drawer = ref(true); // Controls the visibility of the navigation drawer

// Initialize the Pinia store for sidebar state management
const sidebarStore = useSidebarStore();

// Get Vuetify's reactive breakpoint indicator for medium screens and below
const { mdAndDown } = useDisplay();

/**
 * Checks the current screen size and toggles the sidebar rail mode if needed.
 * @param isMdOrSmaller - True if the screen width is medium or smaller
 */
const checkScreenSize = (isMdOrSmaller: boolean) => {
  if (isMdOrSmaller) {
    // If not already in rail mode, toggle it on for smaller screens
    if (!sidebarStore.isRail) {
      sidebarStore.toggleRail();
    }
  }
};

// Run the check once when the component is mounted to apply initial state
onMounted(() => {
  checkScreenSize(mdAndDown.value);
});

// Watch for changes in the screen size and react accordingly
watch(mdAndDown, (isMdOrSmaller) => {
  checkScreenSize(isMdOrSmaller);
})

</script>