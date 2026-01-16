
import { cn } from "@/lib/utils";

interface Dimension {
    id: string;
    type: string;
    generator: string;
    seed: string;
    isCustom?: boolean;
}

export default function DimensionList() {
    const dimensions: Dimension[] = [
        { id: "minecraft:overworld", type: "minecraft:overworld", generator: "noise", seed: "-5688885537487147377" },
        { id: "minecraft:the_nether", type: "minecraft:the_nether", generator: "noise", seed: "Synced" },
        { id: "minecraft:the_end", type: "minecraft:the_end", generator: "noise", seed: "Synced" },
        { id: "fantasy:dream_world", type: "fantasy:sky", generator: "custom", seed: "123456789", isCustom: true },
        { id: "mining:deep_cave", type: "minecraft:caves", generator: "noise", seed: "987654321", isCustom: true },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between px-1">
                <div>
                    <h2 className="text-lg font-medium text-white">World Generation</h2>
                    <p className="text-sm text-zinc-500">Configured dimensions and generator settings.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search dimensions..."
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-600 w-64 placeholder-zinc-600"
                    />
                </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-4">Dimension ID</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-3">Seed</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-white/5">
                    {dimensions.map((dim) => (
                        <div key={dim.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-900/80 transition-colors group">

                            <div className="col-span-4 flex items-center gap-3 overflow-hidden">
                                <div className={cn(
                                    "size-8 rounded flex items-center justify-center shrink-0 border border-white/5",
                                    dim.id.includes("nether") ? "bg-red-900/20 text-red-500" :
                                        dim.id.includes("end") ? "bg-purple-900/20 text-purple-500" :
                                            dim.isCustom ? "bg-blue-900/20 text-blue-500" :
                                                "bg-emerald-900/20 text-emerald-500"
                                )}>
                                    <span className="text-xs font-bold uppercase">{dim.id.charAt(0)}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-zinc-200 truncate font-mono">{dim.id}</span>
                                    {dim.isCustom && <span className="text-[10px] text-blue-400">Datapack Dimension</span>}
                                </div>
                            </div>

                            <div className="col-span-3 text-sm text-zinc-400 font-mono truncate">
                                {dim.type}
                            </div>

                            <div className="col-span-3 text-sm font-mono text-zinc-500 truncate">
                                <span className="bg-zinc-950 px-2 py-1 rounded border border-white/5">
                                    {dim.seed}
                                </span>
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <button type="button" className="cursor-pointer group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg border border-transparent hover:border-red-900/50">
                                    Reset
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-1 text-xs text-zinc-500 text-center pt-4">
                Showing {dimensions.length} dimensions. Generator settings are read-only in this view.
            </div>
        </div>
    );
}