/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import Providers from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/Toast";
import type { ReactNode } from "react";
import appCss from "@/globals.css?url";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { title: "Voxel" },
            { charSet: "UTF-8" },
            { rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { name: "theme-color", content: "#000000" },
            { name: "description", content: "Voxel is a personal project, created with passion. The goal is to share my knowledge and help you develop your own content." },
            { name: "keywords", content: "voxel, voxelio, voxel.studio, voxel.studio, Minecraft, Datapacks, Tools, Hardel" },
            { name: "author", content: "Hardel" },
            { name: "robots", content: "index, follow" },
            { name: "googlebot", content: "index, follow" },
            { name: "google", content: "notranslate" },
            { property: "og:type", content: "website" },
            { property: "og:url", content: "https://studio.voxel.hardel.io/" },
            { property: "og:title", content: "Voxel" },
            { property: "og:description", content: "Voxel is a personal project, created with passion. The goal is to share my knowledge and help you develop your own content." },
            { property: "og:image", content: "/opengraph.webp" },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:site_name", content: "Voxel" },
            { property: "twitter:card", content: "summary_large_image" },
            { property: "twitter:url", content: "https://studio.voxel.hardel.io/" },
            { property: "twitter:title", content: "Voxel" },
            { property: "twitter:description", content: "Voxel is a personal project, created with passion. The goal is to share my knowledge and help you develop your own content." },
            { property: "twitter:image", content: "/opengraph.webp" },
        ],
        links: [{ rel: 'stylesheet', href: appCss }],
        scripts: [{ src: "https://unpkg.com/react-scan/dist/auto.global.js", crossOrigin: "anonymous" }],
    }),
    component: RootComponent
});

function RootComponent() {
    return (
        <RootDocument>
            <Providers>
                <Outlet />
                <Toaster />
            </Providers>
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <Scripts />
            </body>
        </html>
    )
}