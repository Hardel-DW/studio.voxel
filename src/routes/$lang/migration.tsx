import { createFileRoute } from "@tanstack/react-router";
import CompoundLayout from "@/components/layout/CompoundLayout";
import MigrationEditor from "@/components/pages/migration/MigrationEditor";
import PageLoading from "@/components/pages/PageLoading";
import { LinkButton } from "@/components/ui/Button";
import { DashedPattern } from "@/components/ui/DashedPattern";
import LineSetup from "@/components/ui/line/LineSetup";
import ShiningStars from "@/components/ui/ShiningStars";
import Star from "@/components/ui/Star";
import Walkthrough from "@/components/ui/Walkthrough";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";

export const Route = createFileRoute("/$lang/migration")({
    component: MigrationPage,
    pendingComponent: PageLoading
});

function MigrationPage() {
    const { lang } = Route.useParams();
    const dictionary = useServerDictionary();

    const walkthroughSteps = [
        {
            title: dictionary.migration.step1.title,
            description: dictionary.migration.step1.description
        },
        {
            title: dictionary.migration.step2.title,
            description: dictionary.migration.step2.description
        },
        {
            title: dictionary.migration.step3.title,
            description: dictionary.migration.step3.description
        }
    ];

    return (
        <CompoundLayout>
            {/* Modern Background */}
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-zinc-950">
                <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-[10rem] bg-linear-to-br from-red-900/10 to-blue-900/10" />
                <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-[4rem] bg-linear-to-br from-pink-900/10 to-blue-900/10" />
                <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-[10rem] bg-linear-to-br from-purple-900/10 to-red-900/10" />
                <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-[4rem] bg-linear-to-br from-pink-900/10 to-blue-900/10" />
                <LineSetup />

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
                            {dictionary.migration.home}
                        </h1>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{dictionary.migration.home_description}</p>
                        <ul className="list-disc list-inside text-sm text-zinc-400 w-3/4 mb-4">
                            <li>{dictionary.migration.about.list.first}</li>
                            <li>{dictionary.migration.about.list.second}</li>
                            <li>{dictionary.migration.about.list.third}</li>
                        </ul>
                        <Star />
                    </div>

                    <MigrationEditor />
                </div>
            </section>

            <section className="w-3/4 mx-auto relative grid md:grid-cols-2 items-center gap-x-16 gap-y-24 mt-16 mb-40">
                <div className="absolute w-full inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
                <DashedPattern className="mask-[radial-gradient(white,transparent_60%)]" />

                <div className="relative w-full flex justify-center items-center">
                    <img className="absolute opacity-10 select-none" src="/icons/circle.svg" alt="box" />
                    <img
                        loading="eager"
                        width="1200"
                        height="900"
                        src="/images/background/tools/enchant-hero.webp"
                        alt="404"
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
                            <LinkButton href={`/${lang}/studio`} size="xl" variant="primary" className="w-full md:w-auto">
                                {dictionary.generic.start}
                            </LinkButton>
                            <LinkButton href={`/${lang}/studio`} size="xl" variant="ghost" className="w-full md:w-auto">
                                {dictionary.generic.learn_more}
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-3/4 mx-auto relative flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-x-16 gap-y-24 my-40">
                <div className="absolute w-full inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
                <DashedPattern className="mask-[radial-gradient(white,transparent_60%)]" />

                <div className="h-full w-full mx-auto relative">
                    <div className="size-full flex flex-col justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 text-balance">
                            {dictionary.suggestions.converter.title}
                        </h1>
                        <p className="text-gray-300 mt-4">{dictionary.suggestions.converter.description}</p>

                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <LinkButton href={`/${lang}/studio`} size="xl" variant="shimmer" className="w-full md:w-auto">
                                {dictionary.generic.take_a_look}
                            </LinkButton>
                            <LinkButton href={`/${lang}/studio`} size="xl" variant="ghost" className="w-full md:w-auto">
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
                        alt="404"
                        className="aspect-auto select-none"
                    />
                </div>
            </section>

            <Walkthrough steps={walkthroughSteps} />
        </CompoundLayout>
    );
}
