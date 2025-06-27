// tests/setupVuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/lib/styles/main.sass'

export const vuetify = createVuetify({
  components,
  directives,
})
