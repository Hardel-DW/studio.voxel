import { createFileRoute, Link } from "@tanstack/react-router";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Box from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import ImageCard from "@/components/ui/ImageCard";
import LineSetup from "@/components/ui/line/LineSetup";
import { t } from "@/lib/i18n";

const baseVoxelPath = import.meta.env.VITE_BASE_VOXEL_PATH;
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
                    <div className="rotate-45 w-[85vw] h-[70vh] bg-radial from-zinc-900/20 to-zinc-500/20 rounded-3xl blur-3xl" />
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
                        to="/$lang/studio"
                        params={{ lang }}
                        title={t("home.configurator.title")}>
                        {t("generic.start_now")}
                    </ImageCard>
                    <ImageCard
                        className="shrink-0 -rotate-3 s:-translate-y-1/2 s:w-1/2 lg:-translate-x-1/4 lg:translate-y-0 lg:w-auto"
                        image="/images/background/marketplace.webp"
                        href={`${baseVoxelPath}/${lang}/marketplace`}
                        title={t("home.marketplace.title")}>
                        {t("generic.start_now")}
                    </ImageCard>
                    <ImageCard
                        className="shrink-0 rotate-6 s:-translate-x-2/3 s:w-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:w-auto"
                        image="/images/background/copilot.webp"
                        href="#"
                        title={t("home.copilot.title")}>
                        {t("generic.soon")}
                    </ImageCard>
                </div>

                <div className="grid gap-12 lg:order-first s:self-end xl:p-12 lg:p-8">
                    <div className="flex flex-col py-8 px-8 sm:px-12 lg:px-16 self-center">
                        <h1 className="text-5xl font-bold">{t("home.title")}</h1>
                        <p className="text-xl mt-4 text-zinc-200">
                            <b>Voxel Labs</b> {t("home.description")}
                        </p>

                        <p className="pt-4 text-base text-zinc-400">
                            <b>Voxel Labs</b> {t("home.subtitle")}
                        </p>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <Link
                                to="/$lang/studio"
                                params={{ lang }}
                                className="bg-white text-lg cursor-pointer text-zinc-800 font-semibold py-3 px-8 rounded-lg hover:bg-zinc-300 hover:text-zinc-800 transition-all">
                                {t("home.button.start")}
                            </Link>

                            <a
                                href={`${baseVoxelPath}/${lang}/blog/enchant-configurator`}
                                className="w-full lg:w-fit text-center border border-zinc-200 text-lg cursor-pointer text-white font-semibold py-3 px-6 rounded-lg hover:bg-zinc-200 hover:text-zinc-800 transition-all">
                                {t("home.button.learn_more")}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my-32 md:my-52 px-8 w-full md:w-3/4 mx-auto grid md:grid-cols-2 gap-8">
                <Box loading="eager" image="/images/features/dev.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold line-clamp-1 pt-8">{t("home.configurator.title")}</h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{t("home.configurator.description")}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" to="/$lang/studio" params={{ lang }} size="sm" variant="shimmer">
                            {t("generic.start_now")}
                        </Button>
                        <Button
                            className="w-full xl:w-fit"
                            href={`${baseVoxelPath}/${lang}/blog/enchant-configurator`}
                            size="sm"
                            variant="transparent">
                            {t("generic.learn_more")}
                        </Button>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/features/title/cycle.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">{t("home.converter.title")}</h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{t("home.converter.description")}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" to="/$lang/converter" params={{ lang }} size="sm" variant="shimmer">
                            {t("generic.start_now")}
                        </Button>
                        <Button className="w-full xl:w-fit" to="/$lang/converter" params={{ lang }} size="sm" variant="transparent">
                            {t("generic.learn_more")}
                        </Button>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/branding/voxel_white.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">{t("home.migration.title")}</h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{t("home.migration.description")}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" to="/$lang/migration" params={{ lang }} size="sm" variant="shimmer">
                            {t("generic.start_now")}
                        </Button>
                        <Button className="w-full xl:w-fit" to="/$lang/migration" params={{ lang }} size="sm" variant="transparent">
                            {t("generic.learn_more")}
                        </Button>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/features/title/question_mark.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">{t("home.copilot.title")}</h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{t("home.copilot.description")}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" href="#" size="sm" variant="shimmer">
                            {t("generic.start_now")}
                        </Button>
                        <Button className="w-full xl:w-fit" href="#" size="sm" variant="transparent">
                            {t("generic.learn_more")}
                        </Button>
                    </div>
                </Box>
            </section>

            <Footer />
        </div>
    );
}
