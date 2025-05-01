import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "../../globals.css";
import { getDictionary, type Locale } from "@/lib/i18n/i18nSercer";
import { DictionaryProvider } from "@/components/layout/DictionaryProvider";

const rubik = Rubik({
    variable: "--font-rubik"
});

const title = "Voxel";
const description =
    "Voxel is a personal project, created with passion. The goal is to share my knowledge and help you develop your own content.";
const images = "/opengraph.webp";

export const viewport: Viewport = {
    themeColor: "#000000"
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
    title,
    description,
    keywords: ["voxel", "voxelio", "voxel.studio", "voxel.studio", "Minecraft", "Datapacks", "Tools", "Hardel"],
    authors: [{ name: "Hardel" }],
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images
    },
    openGraph: {
        images
    },
    icons: {
        icon: "/favicon.svg"
    }
};

export async function generateStaticParams() {
    return [{ lang: "en-us" }, { lang: "fr-fr" }];
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <html lang={lang}>
            <body className={`${rubik.variable} antialiased`}>
                <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
            </body>
        </html>
    );
}
