import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        tanstackRouter({
            routesDirectory: "./src/routes",
            generatedRouteTree: "./src/routeTree.gen.ts",
            autoCodeSplitting: true
        }),
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler'],
                ],
            },
        }),
        tailwindcss()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@lib/*": fileURLToPath(new URL("./src/lib/*", import.meta.url)),
            "@routes/*": fileURLToPath(new URL("./src/routes/*", import.meta.url))
        }
    }
})