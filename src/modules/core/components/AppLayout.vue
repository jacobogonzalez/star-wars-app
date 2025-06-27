<template>
  <v-app>
    <Sidebar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Sidebar from '../../sidebar/components/Sidebar.vue'
</script>
