import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import devServer from '@hono/vite-dev-server'
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
            entry: "./src/server.ts",
            exclude: [
                /^\/(?!api\/).*/,
                /.*\.css$/,
                /.*\.ts$/,
                /.*\.tsx$/,
                /\?t\=\d+$/,
                /[?&]tsr-split=[^&]*(&t=[^&]*)?$/, // Support for TanStack Router code splitting
                /^\/static\/.+/,
                /^\/node_modules\/.*/,
                /.*\.js$/,
                /.*\.jsx$/,],
            injectClientScript: false
        }),
        build({ entry: "./src/server.ts" })
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