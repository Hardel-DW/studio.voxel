import { useLevelStore } from "@/lib/store/LevelStore";
import { cn } from "@/lib/utils";

const formatLastPlayed = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
};

export default function GeneralCard() {
    const levelName = useLevelStore((s) => s.data?.levelName ?? "Unknown World");
    const version = useLevelStore((s) => s.data?.version.name ?? "Unknown");
    const lastPlayed = useLevelStore((s) => s.data?.lastPlayed ?? 0);
    const gameType = useLevelStore((s) => s.data?.gameType ?? 0);

    const modes = ["Survival", "Creative", "Adventure", "Spectator"];

    return (
        <div className="h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors duration-700" />

            <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <label htmlFor="levelName" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        Level Name
                    </label>
                    <input
                        id="levelName"
                        type="text"
                        defaultValue={levelName}
                        className="w-full bg-transparent text-5xl md:text-6xl font-bold text-white placeholder-zinc-700 focus:outline-none focus:ring-0 border-none p-0 font-minecraft tracking-tight"
                        readOnly
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-sm text-zinc-300">
                        <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span>{version}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-sm text-zinc-300">
                        <img src="/icons/clock.svg" className="size-3.5 opacity-60 invert" alt="Time" />
                        <span>Last Played: {formatLastPlayed(lastPlayed)}</span>
                    </div>
                </div>
            </div>

            <div className="pt-8 relative z-10">
                <label htmlFor="gameMode" className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 block">
                    Game Mode
                </label>
                <div className="grid grid-cols-4 gap-3">
                    {modes.map((mode, i) => (
                        <button
                            id={mode}
                            key={mode}
                            type="button"
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-300",
                                i === gameType
                                    ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]"
                                    : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:border-white/10"
                            )}>
                            <span className="text-sm font-semibold">{mode}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
