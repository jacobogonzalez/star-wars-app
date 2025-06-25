import { createApp } from 'vue'
import './style.css'
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
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
