import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import LineSetup from "@/components/ui/line/LineSetup";
import { type Locale, getDictionary } from "@/lib/i18n/i18nSercer";
export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <div className="relative">
            <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-[10rem] bg-gradient-to-br from-red-900/20 to-blue-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-[4rem] bg-gradient-to-br from-pink-900/20 to-blue-900/20" />
            <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-[10rem] bg-gradient-to-br from-purple-900/20 to-red-900/20" />
            <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-[4rem] bg-gradient-to-br from-pink-900/20 to-blue-900/20" />

            <Navbar dictionary={dictionary} lang={lang} />
            <LineSetup />

            <section className="h-screen grid grid-cols-2 gap-12">
                <div className="-z-10 absolute inset-0 overflow-hidden">
                    <div className="rotate-45 w-[85vw] h-[70vh] bg-radial from-zinc-900/20 to-stone-500/20 rounded-3xl blur-[10rem]" />
                </div>

                <div className="-z-10 absolute inset-0 overflow-hidden">
                    <svg className="size-full stroke-white/10 [mask-image:radial-gradient(white,transparent_50%)] [stroke-dasharray:5_6] [stroke-dashoffset:10] lg:stroke-[4]">
                        <defs>
                            <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                                <path d="M64 0H0V64" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" strokeWidth="0" />
                    </svg>
                </div>

                <div className="grid gap-12 grid-rows-2">
                    <div className="flex items-center justify-center" />

                    <div className="flex flex-col py-8 px-20 self-center">
                        <h1 className="text-5xl font-bold">Prend le contrôle</h1>
                        <p className="text-xl mt-4 text-zinc-200">
                            <b>Voxel Labs</b> est un projets qui offre des outils de personnalisation pour les contenus Minecraft avec des
                            interfaces intuitives, pour le tout public.
                        </p>

                        <p className="pt-4 text-base text-zinc-400">
                            <b>Voxel Labs</b> est pour tous, joueurs, créateurs, développeurs...
                        </p>

                        <div className="mt-12 flex flex-wrap gap-x-6">
                            <button
                                type="button"
                                className="bg-white text-lg cursor-pointer text-zinc-800 font-semibold py-3 px-8 rounded-lg hover:bg-zinc-300 hover:text-zinc-800 transition-all">
                                Commencer
                            </button>

                            <button
                                type="button"
                                className="border border-zinc-200 text-lg cursor-pointer text-white font-semibold py-3 px-6 rounded-lg hover:bg-zinc-200 hover:text-zinc-800 transition-all">
                                En savoir plus
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-12 flex flex-col justify-evenly">
                    {[
                        { id: "top", shadow: "shadow-red-950/15", translate: "translate-y-12 translate-x-1/3", rotate: "rotate-12" },
                        { id: "middle", shadow: "shadow-blue-950/15", translate: "", rotate: "-rotate-6" },
                        { id: "bottom", shadow: "shadow-pink-950/15", translate: "-translate-y-12 translate-x-3/4", rotate: "rotate-12" }
                    ].map((style) => (
                        <img
                            key={style.id}
                            className={`animate-levitate cursor-pointer hover:scale-130 transition-all duration-300 shadow-2xl ${style.shadow} w-96 scale-125 aspect-video rounded-2xl border-2 border-zinc-900 ${style.translate} ${style.rotate}`}
                            alt="Futur"
                            src="/images/background/tools/configurator.webp"
                        />
                    ))}
                </div>
            </section>

            <section className="my-32 md:my-52 px-8 w-full md:w-3/4 mx-auto grid md:grid-cols-2 gap-8">
                <Box loading="eager" image="/images/features/dev.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold line-clamp-1 pt-8">{dictionary.home.configurator.title}</h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.configurator.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" href={`/${lang}/tools/studio`} size="sm" variant="white-shimmer">
                            {dictionary.generic.start_now}
                        </Button>
                        <Button className="w-full xl:w-fit" href={`/${lang}/blog/enchant-configurator`} size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </Button>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/features/title/cycle.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">
                        {dictionary.home.converter.title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.converter.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" href="/resources/asset" size="sm" variant="white-shimmer">
                            {dictionary.generic.start_now}
                        </Button>
                        <Button className="w-full xl:w-fit" href="/resources/asset" size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </Button>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/branding/voxel_white.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">
                        {dictionary.home.migration.title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.migration.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" href="/resources/asset" size="sm" variant="white-shimmer">
                            {dictionary.generic.start_now}
                        </Button>
                        <Button className="w-full xl:w-fit" href="/resources/asset" size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </Button>
                    </div>
                </Box>
                <Box loading="lazy" image="/images/features/title/question_mark.webp">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-left line-clamp-1 pt-8">
                        {dictionary.home.copilot.title}
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base mt-2 line-clamp-3">{dictionary.home.copilot.description}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <Button className="w-full xl:w-fit" href={`/${lang}/datapacks/neoenchant`} size="sm" variant="white-shimmer">
                            {dictionary.generic.start_now}
                        </Button>
                        <Button className="w-full xl:w-fit" href={`/${lang}/datapacks/neoenchant`} size="sm" variant="transparent">
                            {dictionary.generic.learn_more}
                        </Button>
                    </div>
                </Box>
            </section>

            <Footer dictionary={dictionary} lang={lang} />
        </div>
    );
}
