import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import reactScan from './src/lib/scan'

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        reactScan(),
        tailwindcss(),
        tanstackRouter({ target: 'react', autoCodeSplitting: true }),
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler'],
                ],
            },
        }),
    ],
    resolve: {
        tsconfigPaths: true
    }
})