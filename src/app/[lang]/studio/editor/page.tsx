import ConfiguratorPanel from "@/components/tools/ConfiguratorPanel";
import NoConfigFound from "@/components/tools/NoConfigFound";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Voxel Studio",
    description: "Configure your datapack and mods with a simple and intuitive interface",
    openGraph: {
        images: "/images/og/configurator.webp"
    },
    twitter: {
        card: "summary_large_image",
        images: "/images/og/configurator.webp"
    }
};

export default function Home() {
    return (
        <main className="contents">
            <div className="size-full pt-4 pb-8">
                <div className="flex absolute inset-0 p-4 justify-between items-center select-none h-fit gap-x-4">
                    <label htmlFor="sidebar-toggle" className="w-6 h-6 cursor-pointer">
                        <img src="/icons/menu.svg" alt="Menu" className="invert opacity-75" />
                    </label>
                    <h1 className="text-sm text-zinc-400 truncate">Voxel Studio</h1>
                    <a href="/" className="select-none size-fit">
                        <img src="/icons/logo.svg" alt="Voxel" className="w-6 h-6 opacity-75" />
                    </a>
                </div>
                <div id="content" className="px-8 lg:px-0 pt-12 h-full transition w-full md:w-[95%] justify-self-center">
                    <ConfiguratorPanel />
                    <NoConfigFound />
                </div>
            </div>
        </main>
    );
}
