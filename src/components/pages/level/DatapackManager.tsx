
export default function DatapackManager() {
    const enabled = ["vanilla", "file/test"];
    const disabled = ["minecart_improvements", "redstone_experiments", "trade_rebalance"];

    return (
        <div className="h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">Datapacks</h3>
                    <p className="text-xs text-zinc-500">Manage data loading order and state.</p>
                </div>
                <button type="button" className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full shadow hover:bg-zinc-200 transition-colors">
                    Upload Pack
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[300px]">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Enabled
                        </span>
                        <span className="text-xs text-zinc-600">{enabled.length} active</span>
                    </div>

                    <div className="flex-1 space-y-2">
                        {enabled.map((pack) => (
                            <div
                                key={pack}
                                className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-grab active:cursor-grabbing"
                            >
                                <div className="size-8 rounded bg-zinc-950 flex items-center justify-center text-xs font-bold text-zinc-600 font-minecraft">
                                    ZIP
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-200 truncate">{pack}</p>
                                </div>
                                <button type="button" className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                                    <img src="/icons/close.svg" className="size-4 invert opacity-50" alt="Disable" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-zinc-700" />
                            Disabled
                        </span>
                        <span className="text-xs text-zinc-600">{disabled.length} available</span>
                    </div>

                    <div className="flex-1 space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                        {disabled.map((pack) => (
                            <div
                                key={pack}
                                className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer"
                            >
                                <div className="size-8 rounded bg-zinc-950/50 flex items-center justify-center text-xs font-bold text-zinc-700 font-minecraft">
                                    DAT
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-400 truncate">{pack}</p>
                                </div>
                                <button type="button" className="opacity-0 group-hover:opacity-100 p-1 hover:bg-emerald-500/20 rounded transition-all">
                                    <img src="/icons/check.svg" className="size-4 invert opacity-50" alt="Enable" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}