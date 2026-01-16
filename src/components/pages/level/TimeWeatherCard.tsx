import { useState } from "react";

export default function TimeWeatherCard() {
    const [difficulty, setDifficulty] = useState(2);
    const [locked, setLocked] = useState(false);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex-1 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="environment" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Environment</label>
                        <span className="text-xs font-mono text-zinc-400">66328 TICKS</span>
                    </div>

                    <div className="space-y-3">
                        <div className="h-12 w-full bg-zinc-950/50 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-1/2 left-[30%] -translate-y-1/2 size-4 rounded-full bg-yellow-100 shadow-[0_0_15px_rgba(253,224,71,0.6)]" />
                            <div className="absolute inset-0 shadow-inner pointer-events-none" />
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 px-1">
                            <span>Sunrise</span>
                            <span>Noon</span>
                            <span>Sunset</span>
                            <span>Midnight</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {["Clear", "Rain", "Thunder"].map((w, i) => (
                            <button
                                key={w}
                                type="button"
                                className={`
                                    py-2 rounded-lg text-xs font-medium border transition-all
                                    ${i === 0
                                        ? "bg-blue-500/10 text-blue-200 border-blue-500/20"
                                        : "bg-zinc-800/30 text-zinc-400 border-transparent hover:bg-zinc-800/50"
                                    }
                                `}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                    <label htmlFor="difficulty" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Difficulty</label>
                    <button
                        type="button"
                        onClick={() => setLocked(!locked)}
                        className={`p-1.5 rounded-lg transition-colors ${locked ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
                        title="Lock Difficulty"
                    >
                        <img src={locked ? "/icons/lock.svg" : "/icons/unlock.svg"} className="size-4 invert" alt="Lock" />
                    </button>
                </div>

                <div className="relative h-10 bg-zinc-950/50 rounded-lg p-1 flex">
                    {["Peaceful", "Easy", "Normal", "Hard"].map((diff, index) => (
                        <button
                            key={diff}
                            type="button"
                            onClick={() => !locked && setDifficulty(index)}
                            className={`
                                flex-1 rounded-md text-xs font-medium transition-all duration-200 z-10
                                ${difficulty === index ? "text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}
                                ${locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                            `}
                        >
                            {diff}
                        </button>
                    ))}
                    <div
                        className="absolute top-1 bottom-1 bg-zinc-700/50 rounded-md transition-all duration-300 ease-out border border-white/10"
                        style={{
                            left: `${(difficulty * 25) + 1}%`,
                            width: '23%'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}