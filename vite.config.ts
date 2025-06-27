import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),                // Enables Vue support
    tsconfigPaths(),      // Resolves paths based on tsconfig.json
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' points to the 'src' directory
    },
  },
  test: {
    globals: true,                      // Use global test APIs (e.g., describe, it)
    environment: 'jsdom',              // Simulates a browser environment
    include: [                         // Files to include in testing
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
      'src/modules/dataTable/**/*.spec.ts',
    ],
    setupFiles: './src/tests/setup.ts', // Setup file run before tests
    coverage: {
      reporter: ['text', 'html'],       // Report formats: text for console, html for visual report
      include: ['src/**/*.ts', 'src/**/*.vue'], // Files to include in coverage
      exclude: ['node_modules/', 'tests/'],     // Files to exclude from coverage
    },
    deps: {
      inline: ['vuetify'],              // Inline Vuetify dependencies for better compatibility
      external: [/\.css$/],             // Treat CSS files as external dependencies
    },
    watch: false,       // Disable watch mode for tests
    clearMocks: true,   // Automatically clear mock calls and instances between tests
    css: false,         // Disable CSS handling during tests
  },
})
