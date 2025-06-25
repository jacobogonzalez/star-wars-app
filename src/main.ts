import { createApp } from 'vue'
import './style.css'
import router from './router'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
})
const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
