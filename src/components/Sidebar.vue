<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    rail-width="72"
    permanent
    app
  >
    <!-- Header -->
    <v-list>
      <v-list-item class="pl-1">
        <template #prepend>
          <v-btn
            icon
            variant="text"
            @click="toggleRail"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list-item-title class="text-center" v-if="!rail"><img src="/images/star-wars-4.svg" alt="Star Wars Logo" height="50" /></v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider />

    <!-- Navigation -->
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-account-circle"
        title="People"
        @click="$router.push('/')"
      />
      <v-list-item
        prepend-icon="mdi-earth"
        title="Planets"
        @click="$router.push('/planets')"
      />
    </v-list>

  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  data() {
    return {
      drawer: true,
      rail: false,
    }
  },
  methods: {
    toggleRail() {
      this.rail = !this.rail
    },
  },
}
</script>
