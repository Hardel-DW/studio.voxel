import { createFileRoute } from "@tanstack/react-router";
import CompoundLayout from "@/components/layout/CompoundLayout";
import ConverterEditor from "@/components/pages/converter/ConverterEditor";
import PageLoading from "@/components/pages/PageLoading";
import ShiningStars from "@/components/ui/ShiningStars";
import Star from "@/components/ui/Star";
import Walkthrough from "@/components/ui/Walkthrough";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/converter")({
    component: ConverterPage,
    pendingComponent: PageLoading
});

function ConverterPage() {
    const t = useTranslate();

    const walkthroughSteps = [
        {
            title: t("converter.step1.title"),
            description: t("converter.step1.description")
        },
        {
            title: t("converter.step2.title"),
            description: t("converter.step2.description")
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
                            {t("converter.home")}
                        </h1>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{t("converter.description")}</p>
                        <ul className="list-disc list-inside text-sm text-zinc-400 w-3/4 mb-4">
                            <li>{t("converter.description_list.1")}</li>
                            <li>{t("converter.description_list.2")}</li>
                        </ul>
                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">{t("converter.instruction")}</p>
                        <Star />
                    </div>

                    <ConverterEditor />
                </div>
            </section>

            <Walkthrough steps={walkthroughSteps} />
        </CompoundLayout>
    );
}
