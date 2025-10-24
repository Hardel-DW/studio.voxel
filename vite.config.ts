import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        tanstackStart(),
        tailwindcss(),
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