import { createApp } from 'vue'
import './style.css'
import '../src/styles/colors.scss'
import router from './router'

// Vuetify
import 'vuetify/lib/styles/main.sass'
import '@mdi/font/css/materialdesignicons.css'  // <-- importa los iconos MDI
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi' // <-- importa iconset MDI

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',    // usa MDI como set de iconos por defecto
    aliases,
    sets: {
      mdi,
    },
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

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
