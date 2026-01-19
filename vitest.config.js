import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        projects: [
            {
                extends: true,
                test: {
                    name: 'api',
                    include: ['api/tests/**/*.test.js'],
                    environment: 'node',
                },
            },
            {
                extends: true,
                test: {
                    name: 'react',
                    include: ['src/tests/**/*.test.{js,jsx}'],
                    environment: 'jsdom',
                    setupFiles: ['./src/tests/setupTests.js'],
                },
            },
        ],
    },
});
