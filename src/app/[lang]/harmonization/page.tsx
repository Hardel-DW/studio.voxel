import Star from "@/components/ui/Star";
import HarmonizeClientLogic from "./HarmonizeEditor";
import CompoundLayout from "@/components/layout/CompoundLayout";
import { getDictionary, type Locale } from "@/lib/i18n/i18nServer";

export default async function HarmonizationPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <CompoundLayout dictionary={dictionary} lang={lang}>
            <section className="mt-32 relative w-3/4 mx-auto">
                <div className="w-full text-center mt-12 mb-12">
                    <h2 className="text-5xl font-bold mb-4">{dictionary.harmonization.title}</h2>
                    <Star />
                </div>

                <div className="mb-12 px-12">
                    <p className="text-zinc-300 tracking-wide">{dictionary.harmonization.description}</p>
                    <p className="text-zinc-400 text-xs mt-2 tracking-wide">{dictionary.harmonization.small}</p>
                </div>

                <div className="mb-8 w-full">
                    <div id="imageGallery" className="flex gap-4 overflow-x-auto pb-4 min-h-25 items-center">
                        <p id="noImagesText" className="text-zinc-400 text-center w-full">
                            {dictionary.harmonization.no_images}
                        </p>
                    </div>
                </div>

                <HarmonizeClientLogic />
            </section>
        </CompoundLayout>
    );
}
