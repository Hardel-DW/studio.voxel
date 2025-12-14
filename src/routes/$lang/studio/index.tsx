import { createFileRoute, Link } from "@tanstack/react-router";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import StudioLoading from "@/components/pages/studio/StudioLoading";
import DatapackUploader from "@/components/tools/DatapackUploader";
import RepositoryOpener from "@/components/tools/RepositoryOpener";
import RestoreLastSession from "@/components/tools/RestoreLastSession";
import VanillaImportButton from "@/components/tools/VanillaImportButton";
import { t } from "@/lib/i18n/i18n";

export const Route = createFileRoute("/$lang/studio/")({
    component: StudioLayout,
    pendingComponent: StudioLoading
});

const questions = (lang: string) => {
    const translate = t(lang);
    return [
        {
            question: translate("studio.questions.values.0.question"),
            answer: translate("studio.questions.values.0.answer")
        },
        {
            question: translate("studio.questions.values.1.question"),
            answer: translate("studio.questions.values.1.answer")
        },
        {
            question: translate("studio.questions.values.2.question"),
            answer: translate("studio.questions.values.2.answer")
        },
        {
            question: translate("studio.questions.values.3.question"),
            answer: translate("studio.questions.values.3.answer")
        },
        {
            question: translate("studio.questions.values.4.question"),
            answer: translate("studio.questions.values.4.answer")
        },
        {
            question: translate("studio.questions.values.5.question"),
            answer: translate("studio.questions.values.5.answer")
        }
    ];
};

const DISABLE_MAINTENANCE = false;

function StudioLayout() {
    const { lang } = Route.useParams();
    const translate = t(lang);

    return (
        <main className="w-full">
            <Link to="/$lang/studio/editor" params={{ lang }} className="hidden" aria-hidden="true" />
            <Navbar />
            <section className="w-11/12 md:w-3/4 mx-auto flex flex-col justify-evenly xl:grid grid-cols-2 items-center relative gap-8 min-h-screen">
                <div className="h-full w-[95%] md:w-full relative">
                    <div className="xl:invisible visible absolute flex justify-center items-center size-full -z-10">
                        <div className="absolute inset-0 top-1/2 -translate-y-1/2 shadow-2xl bg-linear-to-r from-pink-900 to-blue-900 opacity-50 rounded-full blur-[5rem]" />
                    </div>

                    <div className="size-full flex flex-col justify-center">
                        <small className="text-zinc-400 font-bold tracking-wide text-[16px]">{translate("studio.section")}</small>
                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 text-balance">{translate("studio.title")}</h1>
                        <p className="text-gray-300 mt-4">{translate("studio.description")}</p>

                        <div className="flex items-center flex-col sm:flex-row gap-4 mt-8">
                            {DISABLE_MAINTENANCE ? (
                                <div>
                                    <p className="text-zinc-400 text-sm">{translate("studio.maintenance.description")}</p>
                                    <p className="text-zinc-500 text-xs">
                                        {translate("studio.maintenance.date", {
                                            date: new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date("2025-12-15"))
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <VanillaImportButton />
                                    <RestoreLastSession className="shimmer-zinc-950 text-zinc-200 border border-zinc-800" />
                                    <a
                                        href="https://voxel.hardel.io/en-us/update/studio"
                                        className="inline-flex h-10 items-center justify-center rounded-md px-4 font-medium text-slate-400 transition-colors hover:text-zinc-300 text-sm">
                                        {translate("studio.latest_update")} &rarr;
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative w-full flex justify-center items-center">
                    <div className="w-full max-w-md">
                        {DISABLE_MAINTENANCE ? (
                            <div className="gap-6 p-12 min-h-[300px] flex flex-col items-center justify-center w-full rounded-3xl border-2 border-dashed border-zinc-700/50 bg-zinc-900/20 backdrop-blur-sm">
                                <div className="size-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-10 opacity-50 text-zinc-400">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-zinc-200 font-medium text-xl">{translate("studio.maintenance.title")}</p>
                                    <p className="text-sm text-zinc-500">{translate("studio.maintenance.description")}</p>
                                    <p className="text-xs text-zinc-600">
                                        {translate("studio.maintenance.date", {
                                            date: new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date("2025-12-15"))
                                        })}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <DatapackUploader />
                                <RepositoryOpener />
                            </>
                        )}
                    </div>
                    <img className="absolute -z-10 opacity-10 select-none" src="/icons/circle.svg" alt="box" />
                </div>
            </section>

            <section className="my-32 min-h-[50dvh] w-11/12 md:w-3/4 mx-auto">
                <div className="max-w-5xl mx-auto relative">
                    <div className="absolute size-full bg-linear-to-r from-pink-950 to-blue-950 opacity-10 rounded-full shadow-2xl blur-[5rem]" />
                    <div className="mb-16 w-fit relative z-20">
                        <h1 className="text-4xl font-bold text-balance">{translate("studio.faq")}</h1>
                        <div className="h-1 w-1/2 bg-linear-to-r from-rose-900 to-fuchsia-900 rounded-full mt-4" />
                    </div>
                    <div className="grid divide-y divide-zinc-700 z-20">
                        {questions(lang).map((item: { question: string; answer: string }) => (
                            <div className="py-5" key={item.question}>
                                <details className="group relative">
                                    <summary className="flex justify-between items-center gap-x-10 font-medium cursor-pointer list-none group-open:before:absolute group-open:before:inset-0 group-open:before:cursor-pointer">
                                        <span className="select-none text-zinc-200 text-base">{item.question}</span>
                                        <span className="select-none transition group-open:rotate-180 shrink-0">
                                            <img loading="eager" src="/icons/chevron-down.svg" alt="arrow" className="size-6 invert" />
                                        </span>
                                    </summary>
                                    <p className="select-none text-zinc-400 mt-4 group-open:animate-fadein">{item.answer}</p>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
