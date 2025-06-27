import { vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/lib/styles/main.sass'

// Stub para CSSStyleSheet, evita errores en jsdom con Vuetify
vi.stubGlobal('CSSStyleSheet', class {})

// Stub para visualViewport, que jsdom no implementa y vuetify requiere
if (!global.visualViewport) {
  global.visualViewport = {
    width: 1024,
    height: 768,
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    onresize: null,
    onscroll: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as VisualViewport
}

export const vuetify = createVuetify({
  components,
  directives,
})
