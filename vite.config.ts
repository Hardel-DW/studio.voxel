import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
    plugins: [
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
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@lib/*": fileURLToPath(new URL("./src/lib/*", import.meta.url)),
            "@routes/*": fileURLToPath(new URL("./src/routes/*", import.meta.url))
        }
    }
})