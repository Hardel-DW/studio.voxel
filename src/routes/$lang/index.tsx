import { createFileRoute } from "@tanstack/react-router";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Box from "@/components/ui/Box";
import { LinkButton } from "@/components/ui/Button";
import ImageCard from "@/components/ui/ImageCard";
import LineSetup from "@/components/ui/line/LineSetup";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";

export const Route = createFileRoute("/$lang/")({
    component: Page,
    head: () => ({
        meta: [
            {
                title: "Home · Voxel"
            }
        ]
    })
});

function Page() {
    const { lang } = Route.useParams();
    const dictionary = useServerDictionary();

    return (
        <div className="relative">
            <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/20 to-blue-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />
            <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/20 to-red-900/20" />
            <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />

            <Navbar />
            <LineSetup />

            <section className="min-h-screen flex flex-col justify-center s:justify-start lg:grid lg:grid-cols-2 gap-8 lg:gap-12 relative">
                <div className="-z-10 absolute inset-0">
                    <div className="rotate-45 w-[85vw] h-[70vh] bg-radial from-zinc-900/20 to-stone-500/20 rounded-3xl blur-3xl" />
                </div>
                <div className="-z-10 absolute inset-0">
                    <svg className="size-full stroke-white/10 mask-[radial-gradient(white,transparent_50%)] [stroke-dasharray:5_6] [stroke-dashoffset:10] lg:stroke-4">
                        <title>Grid</title>
                        <defs>
                            <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                                <path d="M64 0H0V64" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" strokeWidth="0" />
                    </svg>
                </div>

                <div className="hidden s:flex w-full s:items-center s:justify-center s:overflow-x-hidden s:h-full s:flex-1 lg:flex-col lg:justify-evenly lg:p-12 lg:gap-8 lg:overflow-visible lg:h-auto lg:flex-initial">
                    <ImageCard
                        className="shrink-0 rotate-6 translate-y-1/2 s:translate-x-2/3 s:w-1/2 lg:translate-x-1/4 lg:w-auto"
                        image="/images/background/tools/configurator.webp"
                        href={`/${lang}/studio`}
                        title={dictionary.home.configurator.title}
                        button={dictionary.generic.start_now}
                    />
                    <ImageCard
                        className="shrink-0 -rotate-3 s:-translate-y-1/2 s:w-1/2 lg:-translate-x-1/4 lg:translate-y-0 lg:w-auto"
                        image="/images/background/marketplace.webp"
                        href={`https://voxel.hardel.io/${lang}/marketplace`}
                        title={dictionary.home.marketplace.title}
                        button={dictionary.generic.start_now}
                    />
                    <ImageCard
                        className="shrink-0 rotate-6 s:-translate-x-2/3 s:w-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:w-auto"
                        image="/images/background/copilot.webp"
                        href="#"
                        title={dictionary.home.copilot.title}
                        button={dictionary.generic.soon}
                    />
                </div>

                <div className="grid gap-12 lg:order-first s:self-end xl:p-12 lg:p-8">
                    <div className="flex flex-col py-8 px-8 sm:px-12 lg:px-16 self-center">
                        <h1 className="text-5xl font-bold">{dictionary.home.title}</h1>
                        <p className="text-xl mt-4 text-zinc-200">
                            <b>Voxel Labs</b> {dictionary.home.description}
                        </p>

                        <p className="pt-4 text-base text-zinc-400">
                            <b>Voxel Labs</b> {dictionary.home.subtitle}
                        </p>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <a
                                href={`/${lang}/studio`}
                                className="bg-white text-lg cursor-pointer text-zinc-800 font-semibold py-3 px-8 rounded-lg hover:bg-zinc-300 hover:text-zinc-800 transition-all">
                                {dictionary.home.button.start}
                            </a>

                            <a
                                href={`https://voxel.hardel.io/${lang}/blog/enchant-configurator`}
                                className="w-full lg:w-fit text-center border border-zinc-200 text-lg cursor-pointer text-white font-semibold py-3 px-6 rounded-lg hover:bg-zinc-200 hover:text-zinc-800 transition-all">
                                {dictionary.home.button.learn_more}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my-32 md:my-52 px-8 w-full md:w-3/4 mx-auto grid md:grid-cols-2 gap-8">
                <Box loading="eager" image="/images/features/dev.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold line-clamp-1 pt-8">{dictionary.home.configurator.title}</h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.configurator.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <LinkButton className="w-full xl:w-fit" href={`/${lang}/studio`} size="sm" variant="shimmer">
                            {dictionary.generic.start_now}
                        </LinkButton>
                        <LinkButton className="w-full xl:w-fit" href={`/${lang}/blog/enchant-configurator`} size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </LinkButton>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/features/title/cycle.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">
                        {dictionary.home.converter.title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.converter.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <LinkButton className="w-full xl:w-fit" href={`/${lang}/converter`} size="sm" variant="shimmer">
                            {dictionary.generic.start_now}
                        </LinkButton>
                        <LinkButton className="w-full xl:w-fit" href={`/${lang}/converter`} size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </LinkButton>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/branding/voxel_white.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">
                        {dictionary.home.migration.title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.migration.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <LinkButton className="w-full xl:w-fit" href={`/${lang}/migration`} size="sm" variant="shimmer">
                            {dictionary.generic.start_now}
                        </LinkButton>
                        <LinkButton className="w-full xl:w-fit" href={`/${lang}/migration`} size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </LinkButton>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/features/title/question_mark.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">
                        {dictionary.home.copilot.title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.copilot.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <LinkButton className="w-full xl:w-fit" href="#" size="sm" variant="shimmer">
                            {dictionary.generic.start_now}
                        </LinkButton>
                        <LinkButton className="w-full xl:w-fit" href="#" size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </LinkButton>
                    </div>
                </Box>
            </section>

            <Footer />
        </div>
    );
}
