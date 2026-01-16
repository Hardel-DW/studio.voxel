import { useTranslate } from "@/lib/i18n";
import { useLevelStore } from "@/lib/store/LevelStore";
import { cn } from "@/lib/utils";

type Weather = "clear" | "rain" | "thunder";

const getWeather = (raining: boolean, thundering: boolean): Weather => {
    if (thundering) return "thunder";
    if (raining) return "rain";
    return "clear";
};

export default function TimeWeatherCard() {
    const t = useTranslate();
    const time = useLevelStore((s) => s.data?.time ?? 0);
    const raining = useLevelStore((s) => s.data?.raining ?? false);
    const thundering = useLevelStore((s) => s.data?.thundering ?? false);
    const difficulty = useLevelStore((s) => s.data?.difficulty ?? 2);
    const locked = useLevelStore((s) => s.data?.difficultyLocked ?? false);
    const set = useLevelStore((s) => s.set);

    const weather = getWeather(raining, thundering);

    const handleDifficultyChange = (newDifficulty: number) => {
        if (locked) return;
        set("difficulty", newDifficulty);
    };

    const handleLockToggle = () => {
        set("difficultyLocked", !locked);
    };

    const handleWeatherChange = (newWeather: Weather) => {
        set("raining", newWeather === "rain" || newWeather === "thunder");
        set("thundering", newWeather === "thunder");
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex-1 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="environment" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            {t("level.environment.title")}
                        </label>
                        <span className="text-xs font-mono text-zinc-400">{time.toLocaleString()} {t("level.environment.ticks")}</span>
                    </div>

                    <div className="space-y-3">
                        <div className="h-12 w-full bg-zinc-950/50 rounded-xl border border-white/5 relative overflow-hidden">
                            <div
                                className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-yellow-100 shadow-[0_0_15px_rgba(253,224,71,0.6)]"
                                style={{ left: `${((time % 24000) / 24000) * 100}%` }}
                            />
                            <div className="absolute inset-0 shadow-inner pointer-events-none" />
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 px-1">
                            <span>{t("level.environment.sunrise")}</span>
                            <span>{t("level.environment.noon")}</span>
                            <span>{t("level.environment.sunset")}</span>
                            <span>{t("level.environment.midnight")}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {(["clear", "rain", "thunder"] as const).map((w) => (
                            <button
                                key={w}
                                type="button"
                                onClick={() => handleWeatherChange(w)}
                                className={cn(
                                    "py-2 rounded-lg text-xs font-medium border transition-all capitalize",
                                    weather === w
                                        ? "bg-blue-500/10 text-blue-200 border-blue-500/20"
                                        : "bg-zinc-800/30 text-zinc-400 border-transparent hover:bg-zinc-800/50"
                                )}>
                                {t(`level.environment.weather.${w}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                    <label htmlFor="difficulty" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        {t("level.difficulty.title")}
                    </label>
                    <button
                        type="button"
                        onClick={handleLockToggle}
                        className={`p-1.5 rounded-lg transition-colors ${locked ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
                        title={t("level.difficulty.lock")}>
                        <img src={locked ? "/icons/lock.svg" : "/icons/unlock.svg"} className="size-4 invert" alt="Lock" />
                    </button>
                </div>

                <div className="relative h-10 bg-zinc-950/50 rounded-lg p-1 flex">
                    {[
                        t("level.difficulty.peaceful"),
                        t("level.difficulty.easy"),
                        t("level.difficulty.normal"),
                        t("level.difficulty.hard")
                    ].map((diff, index) => (
                        <button
                            key={diff}
                            type="button"
                            onClick={() => handleDifficultyChange(index)}
                            className={cn(
                                "flex-1 rounded-md text-xs font-medium transition-all duration-200 z-10",
                                difficulty === index ? "text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300",
                                locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            )}>
                            {diff}
                        </button>
                    ))}
                    <div
                        className="absolute top-1 bottom-1 bg-zinc-700/50 rounded-md transition-all duration-300 ease-out border border-white/10"
                        style={{
                            left: `${difficulty * 25 + 1}%`,
                            width: "23%"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
