import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),            // Plugin Vue para Vite y Vitest
    tsconfigPaths(),  // Soporte alias de paths TS
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Alias @ apunta a src
    },
  },
  test: {
    globals: true,        // Permite usar describe, it, expect globalmente
    environment: 'jsdom', // Emula navegador para tests
    setupFiles: './src/tests/setup.ts', // Archivo para setup global
    deps: {
      inline: ['vuetify'],       // Procesar vuetify con vite-node (vitest)
      external: [/\.css$/],      // Ignorar archivos CSS (previene error unknown ext)
    },
    // Esto es opcional pero útil para debugging y mejores mensajes:
    watch: false,
    clearMocks: true,
    css: false, // Deshabilita CSS para evitar errores con importaciones CSS
  },
})
