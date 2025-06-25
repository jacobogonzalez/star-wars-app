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
      <v-list-item>
        <template #prepend>
          <v-btn
            icon
            variant="text"
            @click="toggleRail"
          >
            <v-icon>{{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
          </v-btn>
        </template>

        <v-list-item-title v-if="!rail">Star Wars</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider />

    <!-- Navigation -->
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home-city"
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
