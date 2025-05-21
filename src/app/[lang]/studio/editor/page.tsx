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
    return <></>;
}
