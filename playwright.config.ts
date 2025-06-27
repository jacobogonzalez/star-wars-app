import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  // Directory where tests are located
   testDir: './e2e',

  // Other configurations...
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html', // Or 'list', 'dot', etc. for CI if you prefer
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:5173', // Your dev server URL

    trace: 'on-first-retry', // Record trace for failed tests
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web server to run tests against
  webServer: {
    command: 'npm run dev', // Command to start your dev server
    url: 'http://localhost:5173', // URL your dev server runs on
    reuseExistingServer: !process.env.CI, // Do NOT reuse server in CI
    timeout: 120 * 1000,
    // waitUntil: 'started', // This is the default and usually sufficient
  },
});