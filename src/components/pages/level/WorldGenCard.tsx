import { useTranslate } from "@/lib/i18n";

export default function WorldGenCard() {
    const t = useTranslate();

    const dimensions = [
        {
            id: "minecraft:overworld",
            name: "Overworld",
            seed: "-5688885537487147377",
            type: "Noise / Multi_noise",
            gradient: "from-green-900/20 to-blue-900/20",
            icon: "/images/features/block/grass_block.webp" // Placeholder
        },
        {
            id: "minecraft:the_nether",
            name: "The Nether",
            seed: "Synced",
            type: "Multi_noise",
            gradient: "from-red-900/20 to-orange-900/20",
            icon: "/images/features/block/netherrack.webp" // Placeholder
        },
        {
            id: "minecraft:the_end",
            name: "The End",
            seed: "Synced",
            type: "The End",
            gradient: "from-purple-900/20 to-fuchsia-900/20",
            icon: "/images/features/block/end_stone.webp" // Placeholder
        }
    ];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-linear-to-b from-white to-transparent rounded-full opacity-50" />
                    {t("level.world_generation")}
                </h2>
                <div className="text-xs text-zinc-500 font-mono">
                    GENERATOR: EXPERIMENTAL
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dimensions.map((dim) => (
                    <div
                        key={dim.id}
                        className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-md group hover:border-white/10 transition-colors"
                    >
                        <div className={`absolute inset-0 bg-linear-to-br ${dim.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />

                        <div className="relative p-6 h-full flex flex-col justify-between gap-8">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{dim.name}</h3>
                                    <p className="text-xs font-mono text-zinc-400 break-all">{dim.id}</p>
                                </div>
                                <div className="size-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-inner">
                                    <div className="size-5 rounded bg-current opacity-50" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-zinc-400">
                                        <span>Seed</span>
                                        <span className="font-mono text-zinc-300">{dim.seed}</span>
                                    </div>
                                    <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-white/10" />
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-400">
                                        <span>Type</span>
                                        <span>{dim.type}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        className="w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-200 hover:text-red-100 border border-red-500/20 hover:border-red-500/30 transition-all text-sm font-semibold flex items-center justify-center gap-2 group/btn"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:rotate-180 transition-transform duration-500">
                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                            <path d="M16 16l5-5-5-5" />
                                        </svg>
                                        Reset Dimension
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}