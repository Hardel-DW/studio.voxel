import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import reactScan from './src/lib/scan'

export default defineConfig({
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