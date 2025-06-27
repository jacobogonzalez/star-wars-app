import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/modules/dataTable/**/*.spec.ts'],
    setupFiles: './src/tests/setup.ts',
     coverage: {
      reporter: ['text', 'html'], // formatos de reporte, 'text' para consola, 'html' para un reporte visual
      include: ['src/**/*.ts', 'src/**/*.vue'], // ajusta según tu estructura
      exclude: ['node_modules/', 'tests/'], 
    },
    deps: {
      inline: ['vuetify'],     // <- aquí debe ir inline
      external: [/\.css$/],
    },
    watch: false,
    clearMocks: true,
    css: false,
  },
})
