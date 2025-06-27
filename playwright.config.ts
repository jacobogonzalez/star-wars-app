import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests/e2e',  // donde pondrás los tests
  use: {
    baseURL: 'http://localhost:5173', // URL donde corre tu app localmente
    headless: true, // puedes cambiar a false para ver el navegador
    viewport: { width: 1280, height: 720 },
  },
})