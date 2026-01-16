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
import LineSetup from "@/components/ui/line/LineSetup";
import Star from "@/components/ui/Star";
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
    const [activeTab, setActiveTab] = useState<Tab>("worldgen");
    const hasFile = useLevelStore((s) => s.data !== null);
    const tabs: { id: Tab; label: string }[] = [
        { id: "worldgen", label: "Dimensions & Generator" },
        { id: "datapacks", label: "Datapacks" },
        { id: "dragon", label: "Dragon Fight" }
    ];

    return (
        <CompoundLayout>
            <div className="relative min-h-screen flex items-center overflow-hidden">
                <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/20 to-blue-900/20" />
                <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />
                <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/20 to-red-900/20" />
                <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />

                <LineSetup />

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

                <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
                    <div className="max-w-5/6 mx-auto p-6 lg:p-10 space-y-8">
                        {!hasFile ? (
                            <section className="pt-36 md:pt-60 relative flex flex-col items-center justify-center pb-72">
                                <div className="w-3/4 mx-auto">
                                    <div className="mb-16">
                                        <h1 className="text-3xl md:text-5xl mb-4 font-semibold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
                                            Level Editor (Extreamly Experimental)
                                        </h1>
                                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">Upload a level file to edit it.</p>
                                        <ul className="list-disc list-inside text-sm text-zinc-400 w-3/4 mb-4">
                                            <li>Upload a level file to edit it.</li>
                                            <li>Edit the level file to your liking.</li>
                                        </ul>
                                        <p className="text-sm text-zinc-400 md:w-3/4 w-full mb-4">Click on the level file to edit it.</p>
                                        <Star />
                                    </div>

                                    <LevelUploader />
                                </div>
                            </section>
                        ) : (
                            <>
                                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-7 xl:col-span-8 h-full">
                                        <GeneralCard />
                                    </div>
                                    <div className="lg:col-span-5 xl:col-span-4 h-full">
                                        <TimeWeatherCard />
                                    </div>
                                </section>

                                <div className="sticky top-0 z-10 pt-4 pb-2 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/50">
                                    <nav className="flex items-center gap-1">
                                        {tabs.map((tab) => (
                                            <button
                                                type="button"
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={cn(
                                                    "px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2",
                                                    activeTab === tab.id
                                                        ? "bg-zinc-100 text-zinc-950 shadow-sm"
                                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                                                )}>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <section className="min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300 pb-24">
                                    {activeTab === "worldgen" && <DimensionList />}
                                    {activeTab === "datapacks" && <DatapackView />}
                                    {activeTab === "dragon" && <DragonFightView />}
                                </section>
                            </>
                        )}
                    </div>
                </main>

                <LevelActionBar />
            </div>
        </CompoundLayout>
    );
}
