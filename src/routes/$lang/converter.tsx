import { createFileRoute } from "@tanstack/react-router";
import CompoundLayout from "@/components/layout/CompoundLayout";
import DatapackDropzone from "@/components/pages/DatapackDropzone";
import PageLoading from "@/components/pages/PageLoading";
import { LinkButton } from "@/components/ui/Button";
import { DashedPattern } from "@/components/ui/DashedPattern";
import ShiningStars from "@/components/ui/ShiningStars";
import Star from "@/components/ui/Star";
import Walkthrough from "@/components/ui/Walkthrough";
import { useDictionary } from "@/lib/hook/useNext18n";
import type { Locale } from "@/lib/i18n/i18nServer";

export const Route = createFileRoute("/$lang/converter")({
    component: ConverterPage,
    pendingComponent: PageLoading
});

function ConverterPage() {
    const { lang } = Route.useParams();
    const dictionary = useDictionary();

    const walkthroughSteps = [
        {
            title: dictionary.converter.step1.title,
            description: dictionary.converter.step1.description
        },
        {
            title: dictionary.converter.step2.title,
            description: dictionary.converter.step2.description
        }
    ];

    return (
        <CompoundLayout dictionary={dictionary} lang={lang as Locale}>
            <div className="fixed inset-0 -z-10">
                <ShiningStars />
            </div>
            <div className="absolute rounded-full w-3/4 h-1/2 bg-linear-to-r from-[#830335] to-[#311e7696] opacity-20 blur-[10rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <section className="pt-36 md:pt-60 relative flex flex-col items-center justify-center pb-72">
                <div className="w-3/4 mx-auto">
                    <div className="mb-16">
                        <h1 className="text-3xl md:text-5xl mb-4 font-semibold">{dictionary.converter.home}</h1>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{dictionary.converter.description}</p>
                        <ul className="list-disc list-inside text-sm text-zinc-400 w-3/4 mb-4">
                            <li>{dictionary.converter.description_list["1"]}</li>
                            <li>{dictionary.converter.description_list["2"]}</li>
                        </ul>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{dictionary.converter.instruction}</p>
                        <Star />
                    </div>

                    <DatapackDropzone>{dictionary.converter.dropzone}</DatapackDropzone>
                </div>
            </section>

            <section className="w-3/4 mx-auto relative grid md:grid-cols-2 items-center gap-x-16 gap-y-24 mt-16 mb-40">
                <div className="absolute w-full inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
                <DashedPattern className="[mask-image:radial-gradient(white,transparent_60%)]" />

                <div className="relative w-full flex justify-center items-center">
                    <img className="absolute opacity-10 select-none" src="/icons/circle.svg" alt="box" />
                    <img
                        loading="eager"
                        width="1200"
                        height="900"
                        src="/images/background/tools/enchant-hero.webp"
                        alt="Enchant Hero Background"
                        className="aspect-auto select-none"
                    />
                </div>
                <div className="h-full w-full mx-auto relative">
                    <div className="size-full flex flex-col justify-center">
                        <small className="text-pink-700 font-bold tracking-wide text-[16px]">{dictionary.generic.section}</small>
                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 text-balance">
                            {dictionary.suggestions.studio.title}
                        </h1>
                        <p className="text-gray-300 mt-4">{dictionary.suggestions.studio.description}</p>

                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <LinkButton href={`/${lang}/tools/studio`} size="xl" variant="primary" className="w-full md:w-auto">
                                {dictionary.generic.start}
                            </LinkButton>
                            <LinkButton href={`/${lang}/tools/studio`} size="xl" variant="ghost" className="w-full md:w-auto">
                                {dictionary.generic.learn_more}
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-3/4 mx-auto relative flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-x-16 gap-y-24 my-40">
                <div className="absolute w-full inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
                <DashedPattern className="[mask-image:radial-gradient(white,transparent_60%)]" />

                <div className="h-full w-full mx-auto relative">
                    <div className="size-full flex flex-col justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 text-balance">
                            {dictionary.suggestions.datapacks.title}
                        </h1>
                        <p className="text-gray-300 mt-4">{dictionary.suggestions.datapacks.description}</p>

                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <LinkButton href={`/${lang}/tools/studio`} size="xl" variant="shimmer" className="w-full md:w-auto">
                                {dictionary.generic.take_a_look}
                            </LinkButton>
                            <LinkButton href={`/${lang}/tools/studio`} size="xl" variant="ghost" className="w-full md:w-auto">
                                {dictionary.generic.learn_more}
                            </LinkButton>
                        </div>
                    </div>
                </div>
                <div className="relative w-full flex justify-center items-center">
                    <img className="absolute opacity-10 select-none" src="/icons/circle.svg" alt="box" />
                    <img
                        loading="eager"
                        width="1200"
                        height="900"
                        src="/images/tools/modrinth.webp"
                        alt="Modrinth"
                        className="aspect-auto select-none"
                    />
                </div>
            </section>

            <Walkthrough steps={walkthroughSteps} />
        </CompoundLayout>
    );
}
