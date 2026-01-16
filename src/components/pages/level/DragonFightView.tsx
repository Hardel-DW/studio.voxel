import { useTranslate } from "@/lib/i18n";
import { useLevelStore } from "@/lib/store/LevelStore";
import { cn } from "@/lib/utils";

const getPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
        x: Math.cos(angle) * radius + 50,
        y: Math.sin(angle) * radius + 50
    };
};

export default function DragonFightView() {
    const t = useTranslate();
    const dragonKilled = useLevelStore((s) => s.data?.dragonKilled ?? false);
    const previouslyKilled = useLevelStore((s) => s.data?.previouslyKilled ?? false);
    const gateways = useLevelStore((s) => s.data?.gateways ?? []);
    const set = useLevelStore((s) => s.set);

    const handleToggleDragonKilled = () => set("dragonKilled", !dragonKilled);
    const handleTogglePreviouslyKilled = () => set("previouslyKilled", !previouslyKilled);

    const handleToggleGateway = (index: number) => {
        const exists = gateways.includes(index);
        set("gateways", exists ? gateways.filter((g) => g !== index) : [...gateways, index]);
    };

    const handleResetGateways = () => set("gateways", []);

    const handleRespawnDragon = () => {
        set("previouslyKilled", dragonKilled);
        set("dragonKilled", false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 aspect-square relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl flex items-center justify-center p-8">
                <div className="relative z-10 size-28 rounded-full border border-white/10 flex items-center justify-center bg-zinc-950/30">
                    <img
                        src="/images/features/entity/enderdragon.webp"
                        className={cn("size-16 object-contain", !dragonKilled && "grayscale opacity-50")}
                        alt="Ender Dragon"
                    />
                </div>

                <div className="absolute inset-0 z-20 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const pos = getPosition(i, 20, 38);
                        const isActive = gateways.includes(i);
                        return (
                            <button
                                key={i.toString()}
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                onClick={() => handleToggleGateway(i)}
                                className={cn(
                                    "absolute -translate-x-1/2 -translate-y-1/2 size-7 rounded-lg flex items-center justify-center text-xs font-medium border transition-all pointer-events-auto cursor-pointer",
                                    isActive
                                        ? "bg-zinc-800 border-white/10 text-white"
                                        : "bg-zinc-950/50 border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10"
                                )}
                                title={`${t("level.dragon.gateway")} #${i} (${isActive ? t("level.dragon.generated") : t("level.dragon.not_generated")})`}
                                type="button">
                                {i}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">{t("level.dragon.state")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={handleToggleDragonKilled}
                            className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex items-center justify-between hover:bg-zinc-950/50 transition-colors">
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-medium text-zinc-300">{t("level.dragon.killed.title")}</span>
                                <span className="text-xs text-zinc-500">{t("level.dragon.killed.description")}</span>
                            </div>
                            <div className={cn("size-2.5 rounded-full", dragonKilled ? "bg-emerald-500" : "bg-zinc-700")} />
                        </button>
                        <button
                            type="button"
                            onClick={handleTogglePreviouslyKilled}
                            className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex items-center justify-between hover:bg-zinc-950/50 transition-colors">
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-medium text-zinc-300">{t("level.dragon.previously_killed.title")}</span>
                                <span className="text-xs text-zinc-500">{t("level.dragon.previously_killed.description")}</span>
                            </div>
                            <div className={cn("size-2.5 rounded-full", previouslyKilled ? "bg-emerald-500" : "bg-zinc-700")} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{t("level.dragon.gateways.title")}</h3>
                        <span className="text-xs font-mono text-zinc-500">{gateways.length} / 20</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-6 max-w-2xl">
                        {t("level.dragon.gateways.description")}
                    </p>
                    <div className="mt-auto flex gap-3">
                        <button
                            type="button"
                            onClick={handleRespawnDragon}
                            className="px-4 py-2 bg-zinc-100 text-zinc-950 text-sm font-medium rounded-xl hover:bg-white transition-colors">
                            {t("level.dragon.respawn")}
                        </button>
                        <button
                            type="button"
                            onClick={handleResetGateways}
                            className="px-4 py-2 bg-zinc-800/50 text-zinc-300 border border-white/5 text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors">
                            {t("level.dragon.reset_gateways")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
