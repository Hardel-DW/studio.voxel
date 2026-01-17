import { useState } from "react";
import { useTranslate } from "@/lib/i18n";
import { type DimensionData, useLevelStore } from "@/lib/store/LevelStore";
import { cn } from "@/lib/utils";
import { TextInput } from "@/components/ui/TextInput";

const VANILLA_DIMENSIONS = new Set(["minecraft:overworld", "minecraft:the_nether", "minecraft:the_end"]);

export default function DimensionList() {
    const t = useTranslate();
    const [search, setSearch] = useState("");
    const dimensions = useLevelStore((s) => s.data?.dimensions ?? []);
    const set = useLevelStore((s) => s.set);
    const filtered = search ? dimensions.filter((d) => d.id.toLowerCase().includes(search.toLowerCase())) : dimensions;
    const handleDelete = (dimensionId: string) => {
        set(
            "dimensions",
            dimensions.filter((d) => d.id !== dimensionId)
        );
    };

    if (dimensions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <p className="text-lg">{t("level.dimensions.empty")}</p>
                <p className="text-sm mt-1">{t("level.dimensions.no_worldgen")}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between px-1">
                <div>
                    <h2 className="text-lg font-medium text-white">{t("level.dimensions.title")}</h2>
                    <p className="text-sm text-zinc-500">{t("level.dimensions.description")}</p>
                </div>
                <div className="flex gap-2">
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("level.dimensions.search")}
                        className="w-64"
                    />
                </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-4">{t("level.dimensions.column.id")}</div>
                    <div className="col-span-3">{t("level.dimensions.column.type")}</div>
                    <div className="col-span-3">{t("level.dimensions.column.generator")}</div>
                    <div className="col-span-2 text-right">{t("level.dimensions.column.actions")}</div>
                </div>

                <div className="divide-y divide-white/5">
                    {filtered.map((dim) => (
                        <DimensionRow key={dim.id} dim={dim} onDelete={handleDelete} />
                    ))}
                </div>
            </div>

            <div className="px-1 text-xs text-zinc-500 text-center pt-4">
                {t("level.dimensions.showing", { filtered: filtered.length, total: dimensions.length })}
            </div>
        </div>
    );
}

function DimensionRow({ dim, onDelete }: { dim: DimensionData; onDelete: (id: string) => void }) {
    const t = useTranslate();
    const isVanilla = VANILLA_DIMENSIONS.has(dim.id);

    return (
        <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-900/80 transition-colors group">
            <div className="col-span-4 flex items-center gap-3 overflow-hidden">
                <img
                    src={isVanilla ? "/images/vanilla.webp" : "/icon.svg"}
                    className={cn(
                        "size-8 rounded flex items-center justify-center shrink-0 border border-white/5 p-1.5",
                        isVanilla ? "bg-emerald-900/20" : "bg-zinc-900/20"
                    )}
                    alt={isVanilla ? "Vanilla dimension" : "Custom dimension"}
                />
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-zinc-200 truncate font-mono">{dim.id}</span>
                    {!isVanilla && <span className="text-[10px] text-zinc-400">{t("level.dimensions.custom")}</span>}
                </div>
            </div>

            <div className="col-span-3 text-sm text-zinc-400 font-mono truncate">{dim.type}</div>

            <div className="col-span-3 text-sm font-mono text-zinc-500 truncate">
                <span className="bg-zinc-950 px-2 py-1 rounded border border-white/5">{dim.generatorType}</span>
            </div>

            <div className="col-span-2 flex justify-end">
                <button
                    type="button"
                    onClick={() => onDelete(dim.id)}
                    className="cursor-pointer group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg border border-transparent hover:border-red-900/50">
                    {t("level.dimensions.delete")}
                </button>
            </div>
        </div>
    );
}
