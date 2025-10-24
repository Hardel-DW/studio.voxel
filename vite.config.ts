import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import build from '@hono/vite-build/vercel'

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
        tailwindcss(),
        devServer({
            entry: "./api/index.ts",
            exclude: [/^\/(?!api\/).*/, ...defaultOptions.exclude],
            injectClientScript: false
        }),
        build({
            entry: "./api/index.ts"
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@lib/*": fileURLToPath(new URL("./src/lib/*", import.meta.url)),
            "@routes/*": fileURLToPath(new URL("./src/routes/*", import.meta.url)),
            "@api/*": fileURLToPath(new URL("./api/*", import.meta.url))
        }
    }
})