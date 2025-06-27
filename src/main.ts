// Import Vue core
import { createApp } from 'vue'

// Global styles
import './style.css'
import '../src/styles/colors.scss'

// App components and core modules
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Import Vuetify styles and dependencies
import 'vuetify/lib/styles/main.sass'
import '@mdi/font/css/materialdesignicons.css' // MDI icon font

// Vuetify core and configuration
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi' // MDI icon set

// Create Vuetify instance with components, directives, icons, and theme
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#F8F9FA',
          surface: '#FFFFFF',
          primary: '#007BFF',
          onPrimary: '#1B1B1B',
          success: '#00C67B',
          border: '#E1E1E1',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0C0F19',
          surface: '#1C212F',
          primary: '#ffc500',
          onPrimary: '#FFFFFF',
          success: '#00FF91',
          border: '#ffc500',
        },
      },
    },
  },
})

// Create Vue application instance
const app = createApp(App)
const pinia = createPinia()
// Register plugins
app.use(router)
app.use(pinia)
app.use(vuetify)

// Mount the application to the DOM
app.mount('#app')
