import { useTranslate } from "@/lib/i18n";
import { useLevelStore } from "@/lib/store/LevelStore";

export default function DatapackView() {
    const t = useTranslate();
    const enabled = useLevelStore((s) => s.data?.enabledPacks ?? []);
    const disabled = useLevelStore((s) => s.data?.disabledPacks ?? []);
    const set = useLevelStore((s) => s.set);

    const movePack = (pack: string, toEnabled: boolean) => {
        if (toEnabled) {
            set(
                "disabledPacks",
                disabled.filter((p) => p !== pack)
            );
            set("enabledPacks", [...enabled, pack]);
        } else {
            set(
                "enabledPacks",
                enabled.filter((p) => p !== pack)
            );
            set("disabledPacks", [...disabled, pack]);
        }
    };

    return (
        <div className="h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-white">{t("level.datapacks.enabled.title")}</h3>
                        <p className="text-xs text-zinc-500">{t("level.datapacks.enabled.description")}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {t("level.datapacks.active")}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {enabled.map((pack, i) => (
                        <button
                            type="button"
                            key={pack}
                            onClick={() => movePack(pack, false)}
                            className="group w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer">
                            <span className="text-xs font-mono text-zinc-600 w-4 text-center">{i + 1}</span>
                            <div className="size-8 bg-zinc-950/50 rounded-lg border border-white/5 flex items-center justify-center">
                                <img src="/images/vanilla.webp" className="size-4" alt="Box" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-zinc-200 font-medium">{pack}</div>
                            </div>
                            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all">
                                {t("level.datapacks.disable")}
                            </span>
                        </button>
                    ))}
                    {enabled.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">{t("level.datapacks.no_enabled")}</div>
                    )}
                </div>
            </div>

            <div className="flex flex-col bg-zinc-900/30 backdrop-blur-xl border border-white/5 border-dashed rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-400">{t("level.datapacks.available.title")}</h3>
                        <p className="text-xs text-zinc-600">{t("level.datapacks.available.description")}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {disabled.map((pack) => (
                        <button
                            type="button"
                            key={pack}
                            onClick={() => movePack(pack, true)}
                            className="group w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors opacity-75 hover:opacity-100 cursor-pointer">
                            <div className="size-8 bg-zinc-950/50 rounded-lg border border-white/5 flex items-center justify-center">
                                <img src="/images/vanilla.webp" className="size-4" alt="Box" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-zinc-400 font-medium">{pack}</div>
                            </div>
                            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all">
                                {t("level.datapacks.enable")}
                            </span>
                        </button>
                    ))}
                    {disabled.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
                            {t("level.datapacks.no_disabled")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
