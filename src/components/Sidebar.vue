<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
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

    <!-- Pushes footer to bottom -->
    <v-spacer />

    <!-- Footer toggle -->
    <v-divider />
    <div class="pa-2">
      <v-switch
        v-model="isDark"
        :label="!rail ? 'Dark Mode' : ''"
        hide-details
        inset
        @change="toggleTheme"
      />
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: (val) => (theme.global.name.value = val ? 'dark' : 'light'),
})

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}
</script>

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
