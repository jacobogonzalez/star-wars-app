import { mount } from '@vue/test-utils'
import { expect, it, afterEach } from 'vitest'
import DetailsModal from './DetailsModal.vue'
import { vuetify } from '../../../tests/setupVuetify'  // asegúrate que está exportado bien

it('renders with Vuetify context', async () => {
  // Montamos el componente en el DOM real
  const wrapper = mount(DetailsModal, {
    attachTo: document.body,
    props: {
      modelValue: true,
      item: { name: 'Test' }
    },
    global: {
      plugins: [vuetify]
    }
  })

  // Esperamos a que Vue actualice el DOM
  await wrapper.vm.$nextTick()

  // Como el contenido está teleporteado, comprobamos el body entero
  expect(document.body.innerHTML).toContain('Test')

  wrapper.unmount()
})

afterEach(() => {
  // Limpiar el DOM después de cada test para evitar conflictos
  document.body.innerHTML = ''
})
