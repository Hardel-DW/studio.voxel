
import { cn } from "@/lib/utils";

export default function DragonFightView() {
    const activeGateways = [0, 13, 12, 10, 16, 11, 8, 6, 1, 4];
    const isDragonKilled = true;
    const isRespawning = false;

    const getPosition = (index: number, total: number, radius: number) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
        return {
            x: Math.cos(angle) * radius + 50,
            y: Math.sin(angle) * radius + 50
        };
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 aspect-square relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl flex items-center justify-center p-8">
                <div className="relative z-10 size-28 rounded-full border border-white/10 flex items-center justify-center bg-zinc-950/30">
                    {isRespawning ? (
                        <div className="animate-pulse text-zinc-400 font-mono text-xs">RESPAWNING...</div>
                    ) : (
                        <img
                            src="/images/features/entity/enderdragon.webp"
                            className={cn("size-16 object-contain", !isDragonKilled && "grayscale opacity-50")}
                            alt="Ender Dragon"
                        />
                    )}
                </div>

                <div className="absolute inset-0 z-20 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const pos = getPosition(i, 20, 38);
                        const isActive = activeGateways.includes(i);
                        return (
                            <button
                                key={i.toString()}
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                className={cn(
                                    "absolute -translate-x-1/2 -translate-y-1/2 size-7 rounded-lg flex items-center justify-center text-xs font-medium border transition-all pointer-events-auto cursor-pointer",
                                    isActive
                                        ? "bg-zinc-800 border-white/10 text-white"
                                        : "bg-zinc-950/50 border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10"
                                )}
                                title={`Gateway #${i} (${isActive ? "Generated" : "Not Generated"})`}
                                type="button">
                                {i}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Dragon State</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-300">Dragon Killed</span>
                                <span className="text-xs text-zinc-500">Has the dragon been defeated once?</span>
                            </div>
                            <div className={cn("size-2.5 rounded-full", isDragonKilled ? "bg-emerald-500" : "bg-zinc-700")} />
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-300">Previously Killed</span>
                                <span className="text-xs text-zinc-500">Legacy state tracker</span>
                            </div>
                            <div className={cn("size-2.5 rounded-full", isDragonKilled ? "bg-emerald-500" : "bg-zinc-700")} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Gateways</h3>
                        <span className="text-xs font-mono text-zinc-500">{activeGateways.length} / 20</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-6 max-w-2xl">
                        Gateways form a ring around the main island. Resetting them allows regeneration when the dragon is killed again.
                    </p>
                    <div className="mt-auto flex gap-3">
                        <button type="button" className="px-4 py-2 bg-zinc-100 text-zinc-950 text-sm font-medium rounded-xl hover:bg-white transition-colors">
                            Respawn Dragon
                        </button>
                        <button type="button" className="px-4 py-2 bg-zinc-800/50 text-zinc-300 border border-white/5 text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors">
                            Reset Gateways
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
