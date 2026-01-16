import { useLevelStore } from "@/lib/store/LevelStore";

export default function DatapackView() {
    const enabled = useLevelStore((s) => s.data?.enabledPacks ?? []);
    const disabled = useLevelStore((s) => s.data?.disabledPacks ?? []);
    const set = useLevelStore((s) => s.set);

    const movePack = (pack: string, toEnabled: boolean) => {
        if (toEnabled) {
            set("disabledPacks", disabled.filter((p) => p !== pack));
            set("enabledPacks", [...enabled, pack]);
        } else {
            set("enabledPacks", enabled.filter((p) => p !== pack));
            set("disabledPacks", [...disabled, pack]);
        }
    };

    return (
        <div className="h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-white">Enabled Packs</h3>
                        <p className="text-xs text-zinc-500">Loaded in order (top to bottom)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Active
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {enabled.map((pack, i) => (
                        <div key={pack} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                            <span className="text-xs font-mono text-zinc-600 w-4 text-center">{i + 1}</span>
                            <div className="size-8 bg-zinc-950/50 rounded-lg border border-white/5 flex items-center justify-center">
                                <img src="/icons/box.svg" className="size-4 invert opacity-20" alt="Box" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-zinc-200 font-medium">{pack}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => movePack(pack, false)}
                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                <span className="sr-only">Disable</span>
                                →
                            </button>
                        </div>
                    ))}
                    {enabled.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
                            No enabled packs
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col bg-zinc-900/30 backdrop-blur-xl border border-white/5 border-dashed rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-400">Available Packs</h3>
                        <p className="text-xs text-zinc-600">Click arrow to enable</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {disabled.map((pack) => (
                        <div key={pack} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors opacity-75 hover:opacity-100">
                            <button
                                type="button"
                                onClick={() => movePack(pack, true)}
                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                ←
                            </button>
                            <div className="size-8 bg-zinc-950/50 rounded-lg border border-white/5 flex items-center justify-center">
                                <div className="size-2 rounded-full bg-zinc-800" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-zinc-400 font-medium">{pack}</div>
                            </div>
                        </div>
                    ))}
                    {disabled.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
                            No disabled packs
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
