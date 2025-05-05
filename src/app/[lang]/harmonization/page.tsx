import Star from "@/components/ui/Star";
import HarmonizeClientLogic from "./HarmonizeEditor";
import CompoundLayout from "@/components/layout/CompoundLayout";
import { getDictionary, type Locale } from "@/lib/i18n/i18nServer";
import ShiningStars from "@/components/ui/ShiningStars";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image harmonization · Voxel",
    description: "Harmonize the colors of an image by reducing the color palette"
};

export default async function HarmonizationPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <CompoundLayout dictionary={dictionary} lang={lang}>
            <div className="fixed inset-0 -z-10">
                <ShiningStars />
            </div>
            <div className="absolute rounded-full w-3/4 h-1/2 bg-linear-to-r from-[#830335] to-[#311e7696] opacity-20 blur-[10rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <section className="mt-32 relative w-3/4 mx-auto">
                <div className="w-full text-center mt-12 mb-12">
                    <h2 className="text-5xl font-bold mb-4">{dictionary.harmonization.title}</h2>
                    <Star />
                </div>

                <div className="mb-12 px-12">
                    <p className="text-zinc-300 tracking-wide">{dictionary.harmonization.description}</p>
                    <p className="text-zinc-400 text-xs mt-2 tracking-wide">{dictionary.harmonization.small}</p>
                </div>

                <HarmonizeClientLogic />
            </section>
        </CompoundLayout>
    );
}
