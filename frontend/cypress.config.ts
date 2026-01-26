import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false, // Set to false for minimal setup, or create support/e2e.ts
    },
});
