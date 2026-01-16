import { cn } from "@/lib/utils";


export default function DragonFightCard() {
    const gateways = [13, 12, 0, 10, 16, 11, 8, 6, 1, 4, 2, 5, 18, 3, 7, 9, 19, 17, 14, 15];
    const isKilled = false;

    return (
        <div className="h-full bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-500/10 rounded-3xl p-6 relative overflow-hidden flex flex-col">
            <div className="absolute -top-24 -right-24 size-64 bg-purple-600/20 blur-[80px] rounded-full" />

            <div className="relative z-10 mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Dragon Fight</h3>
                    <p className="text-xs text-purple-300/60">Manage the End main event.</p>
                </div>
                <div className="size-10 rounded-full bg-purple-950 border border-purple-500/30 flex items-center justify-center">
                    <img src="/icons/dragon_head.svg" className="size-6 invert opacity-80" alt="Dragon" />
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20">
                    <span className="text-sm font-medium text-purple-100">Dragon Status</span>
                    <button
                        type="button"
                        className={`
                            px-4 py-1.5 rounded-full text-xs font-bold border transition-all
                            ${isKilled
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
                            }
                        `}
                    >
                        {isKilled ? "DEFEATED" : "ALIVE"}
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label htmlFor="gateways" className="text-xs font-bold text-purple-400/60 uppercase tracking-widest">Gateways</label>
                        <button type="button" className="text-[10px] text-purple-400 hover:text-white transition-colors">Reset All</button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 20 }).map((_, i) => {
                            const isActive = gateways.includes(i);
                            return (
                                <div
                                    key={`gateway-${i.toString()}`}
                                    className={cn(
                                        "aspect-square rounded-md border flex items-center justify-center text-[10px] font-mono transition-all",
                                        isActive ? "bg-purple-500 text-white border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]" : "bg-black/20 text-white/10 border-white/5"
                                    )}
                                >
                                    {isActive && i}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}