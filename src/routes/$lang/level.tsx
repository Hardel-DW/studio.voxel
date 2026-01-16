import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import CompoundLayout from "@/components/layout/CompoundLayout";
import DatapackView from "@/components/pages/level/DatapackView";
import DimensionList from "@/components/pages/level/DimensionList";
import DragonFightView from "@/components/pages/level/DragonFightView";
import GeneralCard from "@/components/pages/level/GeneralCard";
import LevelActionBar from "@/components/pages/level/LevelActionBar";
import LevelUploader from "@/components/pages/level/LevelUploader";
import TimeWeatherCard from "@/components/pages/level/TimeWeatherCard";
import { Badge } from "@/components/ui/Badge";
import ShiningStars from "@/components/ui/ShiningStars";
import { useTranslate } from "@/lib/i18n";
import { useLevelStore } from "@/lib/store/LevelStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/level")({
    component: Page,
    head: () => ({
        meta: [
            {
                title: "Level Editor · Voxel"
            }
        ]
    })
});

type Tab = "worldgen" | "datapacks" | "dragon";

function Page() {
    const t = useTranslate();
    const [activeTab, setActiveTab] = useState<Tab>("worldgen");
    const hasFile = useLevelStore((s) => s.data !== null);

    const tabs: { id: Tab; label: string }[] = [
        { id: "worldgen", label: t("level.tabs.worldgen") },
        { id: "datapacks", label: t("level.tabs.datapacks") },
        { id: "dragon", label: t("level.tabs.dragon") }
    ];

    return (
        <CompoundLayout>
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

            <div className="relative min-h-screen flex items-center text-zinc-200 selection:bg-white/20">
                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 w-full h-full">
                    {!hasFile ? (
                        <div className="w-full max-w-6xl mx-auto px-6 py-12 lg:py-24 flex flex-col items-center">
                            <div className="w-full px-4 pt-8">
                                <div className="mb-16 w-3/4">
                                    <Badge className="px-4 py-1" hue={120}>{t("level.badge")}</Badge>
                                    <h1 className="text-3xl mt-8 md:text-5xl mb-4 font-semibold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
                                        {t("level.title")}
                                    </h1>
                                    <p className="text-zinc-400 text-base tracking-normal">
                                        {t("level.description")}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 w-full mb-12 items-stretch">

                                <Card className="lg:col-span-4 flex flex-col group relative overflow-hidden">
                                    <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-all" />
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <StepBadge step="01" label={t("level.steps.backup.label")} />
                                        <ServerIcon className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <div className="mt-auto space-y-2 relative z-10">
                                        <h3 className="text-lg font-medium text-zinc-200">{t("level.steps.backup.title")}</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            {t("level.steps.backup.description")}
                                        </p>
                                    </div>
                                </Card>

                                <Card className="lg:col-span-4 flex flex-col group relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-red-500/10 transition-all" />

                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <StepBadge step="02" label={t("level.steps.clean.label")} />
                                        <TrashIcon className="text-zinc-600 group-hover:text-red-400 transition-colors" />
                                    </div>

                                    <div className="mt-auto space-y-3 relative z-10">
                                        <h3 className="text-lg font-medium text-zinc-200">{t("level.steps.clean.title")}</h3>
                                        <div className="w-full bg-black/40 rounded border border-white/5 px-3 py-2 font-mono text-[10px] text-zinc-500 truncate">
                                            /world/DIM_<span className="text-zinc-300">X</span>/<span className="text-red-900/80 bg-red-900/10 px-1 rounded">region</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="lg:col-span-4 flex flex-col group relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <StepBadge step="03" label={t("level.steps.restore.label")} />
                                        <CheckIcon className="text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <div className="mt-auto space-y-2 relative z-10">
                                        <h3 className="text-lg font-medium text-zinc-200">{t("level.steps.restore.title")}</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            {t("level.steps.restore.description")}
                                        </p>
                                    </div>
                                </Card>

                                <Card className="lg:col-span-12 p-8 lg:p-12 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-60 h-40 bg-zinc-600/15 blur-[80px] rounded-full pointer-events-none" />
                                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-40 bg-zinc-500/15 blur-[80px] rounded-full pointer-events-none" />
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-20 bg-zinc-700/15 blur-[60px] rounded-full pointer-events-none" />

                                    <div className="mb-6 space-y-2 relative z-10">
                                        <h3 className="text-2xl font-semibold text-white tracking-tight">{t("level.upload.title")}</h3>
                                        <p className="text-zinc-400 text-sm">
                                            {t("level.upload.description")}
                                        </p>
                                    </div>

                                    <div className="w-full relative z-10">
                                        <LevelUploader />
                                    </div>
                                </Card>

                            </div>
                        </div>
                    ) : (
                        <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-7 xl:col-span-8 h-full">
                                    <GeneralCard />
                                </div>
                                <div className="lg:col-span-5 xl:col-span-4 h-full">
                                    <TimeWeatherCard />
                                </div>
                            </section>

                            <div className="sticky top-0 z-20 pt-4 pb-2 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
                                <nav className="flex items-center gap-1">
                                    {tabs.map((tab) => (
                                        <button
                                            type="button"
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 border border-transparent",
                                                activeTab === tab.id
                                                    ? "bg-white/10 text-white border-white/10 shadow-[0_0_15px_-5px_rgba(255,255,255,0.2)]"
                                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                            )}>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <section className="min-h-[500px] pb-24">
                                {activeTab === "worldgen" && <DimensionList />}
                                {activeTab === "datapacks" && <DatapackView />}
                                {activeTab === "dragon" && <DragonFightView />}
                            </section>
                        </div>
                    )}
                </main>

                <LevelActionBar />
            </div>
        </CompoundLayout>
    );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "bg-zinc-900/40 backdrop-blur-md border border-white/5 p-5 rounded-xl transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:shadow-black/20",
            className
        )}>
            {children}
        </div>
    );
}

function StepBadge({ step, label }: { step: string; label: string }) {
    return (
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
            <span className="text-zinc-600">{step}</span>
            <span className="w-px h-2 bg-zinc-700" />
            <span>{label}</span>
        </div>
    );
}

const ServerIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
)