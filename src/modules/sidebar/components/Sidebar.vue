<template>
  <v-navigation-drawer v-model="drawer" :rail="sidebarStore.isRail" rail-width="72" permanent app>
    <v-list>
      <v-list-item class="pl-1">
        <template #prepend>
          <v-btn icon variant="text" @click="sidebarStore.toggleRail">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list-item-title class="text-center" v-if="!sidebarStore.isRail">
          <img src="/images/star-wars-4.svg" alt="Star Wars Logo" height="50" />
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-list density="compact" nav>
      <v-list-item
        :active="$route.path === '/people' ? true: false"
        :color="$route.path === '/people' ? 'primary' : undefined"
        prepend-icon="mdi-account-circle"
        title="People"
        @click="$router.push('/')"
      />
      <v-divider></v-divider>
      <v-list-item
        :active="$route.path === '/planets' ? true: false"
        :color="$route.path === '/planets' ? 'primary' : undefined"
        prepend-icon="mdi-earth"
        title="Planets"
        @click="$router.push('/planets')"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useSidebarStore } from '../store/useSidebar.store'; // Adjust path as needed
// import { useRoute } from 'vue-router';

// Reactive data properties
const drawer = ref(true); // Controls the visibility of the navigation drawer

// Initialize the Pinia store
const sidebarStore = useSidebarStore();

// Get access to the current route object from Vue Router
// const route = useRoute();
</script>