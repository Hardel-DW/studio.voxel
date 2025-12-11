import { createFileRoute } from "@tanstack/react-router";
import CompoundLayout from "@/components/layout/CompoundLayout";
import ConverterEditor from "@/components/pages/converter/ConverterEditor";
import PageLoading from "@/components/pages/PageLoading";
import { Button } from "@/components/ui/Button";
import { DashedPattern } from "@/components/ui/DashedPattern";
import ShiningStars from "@/components/ui/ShiningStars";
import Star from "@/components/ui/Star";
import Walkthrough from "@/components/ui/Walkthrough";
import { t } from "@/lib/i18n/i18n";

export const Route = createFileRoute("/$lang/converter")({
    component: ConverterPage,
    pendingComponent: PageLoading
});

function ConverterPage() {
    const { lang } = Route.useParams();
    const translate = t(lang);

    const walkthroughSteps = [
        {
            title: translate("converter.step1.title"),
            description: translate("converter.step1.description")
        },
        {
            title: translate("converter.step2.title"),
            description: translate("converter.step2.description")
        }
    ];

    return (
        <CompoundLayout>
            {/* Modern Background */}
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-zinc-950">
                <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/10 to-blue-900/10" />
                <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/10 to-blue-900/10" />
                <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/10 to-red-900/10" />
                <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/10 to-blue-900/10" />

                <div className="-z-10 absolute inset-0 scale-110">
                    <svg
                        className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2"
                        style={{ transform: "skewY(-12deg)" }}>
                        <title>Grid</title>
                        <defs>
                            <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                                <path d="M64 0H0V64" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <ShiningStars />
            </div>

            <section className="pt-36 md:pt-60 relative flex flex-col items-center justify-center pb-72">
                <div className="w-3/4 mx-auto">
                    <div className="mb-16">
                        <h1 className="text-3xl md:text-5xl mb-4 font-semibold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
                            {translate("converter.home")}
                        </h1>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{translate("converter.description")}</p>
                        <ul className="list-disc list-inside text-sm text-zinc-400 w-3/4 mb-4">
                            <li>{translate("converter.description_list.1")}</li>
                            <li>{translate("converter.description_list.2")}</li>
                        </ul>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{translate("converter.instruction")}</p>
                        <Star />
                    </div>

                    <ConverterEditor />
                </div>
            </section>

            <section className="w-3/4 mx-auto relative grid md:grid-cols-2 items-center gap-x-16 gap-y-24 mt-16 mb-40">
                <div className="absolute w-full inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-3xl" />
                <DashedPattern className="mask-[radial-gradient(white,transparent_60%)]" />

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
                        <small className="text-pink-700 font-bold tracking-wide text-[16px]">{translate("generic.section")}</small>
                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 text-balance">
                            {translate("suggestions.studio.title")}
                        </h1>
                        <p className="text-gray-300 mt-4">{translate("suggestions.studio.description")}</p>

                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <Button href={`/${lang}/tools/studio`} size="xl" variant="primary" className="w-full md:w-auto">
                                {translate("generic.start")}
                            </Button>
                            <Button href={`/${lang}/tools/studio`} size="xl" variant="ghost" className="w-full md:w-auto">
                                {translate("generic.learn_more")}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-3/4 mx-auto relative flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-x-16 gap-y-24 my-40">
                <div className="absolute w-full inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-3xl" />
                <DashedPattern className="mask-[radial-gradient(white,transparent_60%)]" />

                <div className="h-full w-full mx-auto relative">
                    <div className="size-full flex flex-col justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 text-balance">
                            {translate("suggestions.datapacks.title")}
                        </h1>
                        <p className="text-gray-300 mt-4">{translate("suggestions.datapacks.description")}</p>

                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <Button href={`/${lang}/tools/studio`} size="xl" variant="shimmer" className="w-full md:w-auto">
                                {translate("generic.take_a_look")}
                            </Button>
                            <Button href={`/${lang}/tools/studio`} size="xl" variant="ghost" className="w-full md:w-auto">
                                {translate("generic.learn_more")}
                            </Button>
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
