import { createFileRoute } from "@tanstack/react-router";
import CompoundLayout from "@/components/layout/CompoundLayout";
import HarmonizeEditor from "@/components/pages/harmonization/HarmonizeEditor";
import PageLoading from "@/components/pages/PageLoading";
import LineSetup from "@/components/ui/line/LineSetup";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/harmonization")({
    component: HarmonizationPage,
    pendingComponent: PageLoading
});

function HarmonizationPage() {
    return (
        <CompoundLayout>
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-zinc-950">
                <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/10 to-blue-900/10" />
                <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/10 to-blue-900/10" />
                <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/10 to-red-900/10" />
                <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/10 to-blue-900/10" />
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
            </div>

            <section className="pt-32 md:pt-48 pb-24 min-h-screen relative flex flex-col items-center">
                <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto flex flex-col gap-12">
                    <div className="text-center space-y-6 relative z-10 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">{t("harmonization.title")}</h1>
                        <p className="text-lg text-zinc-400 leading-relaxed">{t("harmonization.description")}</p>
                    </div>

                    <HarmonizeEditor />
                </div>
            </section>
        </CompoundLayout>
    );
}
