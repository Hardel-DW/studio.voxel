import { createFileRoute } from "@tanstack/react-router";
import CompoundLayout from "@/components/layout/CompoundLayout";
import HarmonizeEditor from "@/components/pages/HarmonizeEditor";
import PageLoading from "@/components/pages/PageLoading";
import ShiningStars from "@/components/ui/ShiningStars";
import Star from "@/components/ui/Star";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";

export const Route = createFileRoute("/$lang/harmonization")({
    component: HarmonizationPage,
    pendingComponent: PageLoading
});

function HarmonizationPage() {
    const dictionary = useServerDictionary();

    return (
        <CompoundLayout>
            <div className="fixed inset-0 -z-10">
                <ShiningStars />
            </div>
            <div className="absolute rounded-full w-3/4 h-1/2 bg-linear-to-r from-[#830335] to-[#311e7696] opacity-20 blur-[10rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <section className="pt-36 md:pt-60 relative flex flex-col items-center justify-center pb-72">
                <div className="w-3/4 mx-auto">
                    <div className="mb-16">
                        <h1 className="text-3xl md:text-5xl mb-4 font-semibold">{dictionary.harmonization.title}</h1>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{dictionary.harmonization.description}</p>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{dictionary.harmonization.small}</p>
                        <Star />
                    </div>

                    <HarmonizeEditor />
                </div>
            </section>
        </CompoundLayout>
    );
}
