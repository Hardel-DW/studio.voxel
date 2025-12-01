import Range from "@/components/ui/Range";
import { useServerDictionary } from "@/lib/hook/useServerDictionary";
import { sortPaletteByHue, type RGB } from "@/lib/utils/color";

interface HarmonizeControlsProps {
    similarityThreshold?: number;
    setSimilarityThreshold?: (value: number) => void;
    palette?: RGB[];
    onDeleteColor?: (color: RGB) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function HarmonizeControls({
    similarityThreshold = 30,
    setSimilarityThreshold,
    palette = [],
    onDeleteColor,
    isLoading = false,
    disabled = false
}: HarmonizeControlsProps) {
    const dictionary = useServerDictionary();
    const sortedAndGroupedPalette = palette.length ? sortPaletteByHue(palette) : [];

    return (
        <div className={`space-y-6 p-6 bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            {/* Threshold Control */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="threshold" className="text-sm font-medium text-zinc-200">
                            {dictionary.harmonization.similarity}
                        </label>
                        <p className="text-xs text-zinc-500">Merge similar colors</p>
                    </div>
                    <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/5 min-w-[3ch] text-center">
                        {similarityThreshold}
                    </span>
                </div>
                <Range
                    id="threshold"
                    min={0}
                    max={150}
                    value={similarityThreshold}
                    step={1}
                    onChange={setSimilarityThreshold}
                    className="w-full"
                    disabled={isLoading || disabled}
                />
            </div>

            <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Palette Display */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-zinc-200">{dictionary.harmonization.colors}</p>
                    <span className="text-xs text-zinc-500 bg-black/20 px-2 py-0.5 rounded-full border border-white/5">{palette.length} active</span>
                </div>

                <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent p-1">
                    {sortedAndGroupedPalette.map((color, index) => (
                        <div
                            key={`${color.join("-")}-${index}`}
                            className="group relative aspect-square rounded-lg cursor-pointer overflow-hidden ring-1 ring-inset ring-black/10 transition-all hover:scale-110 hover:z-10 hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:ring-white/30"
                            style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                        >
                            {onDeleteColor && (
                                <button
                                    type="button"
                                    onClick={() => onDeleteColor(color)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[1px] cursor-pointer"
                                    title="Remove color"
                                >
                                    <img
                                        src="/icons/close.svg"
                                        className="w-4 h-4 invert opacity-80 hover:opacity-100 scale-75 group-hover:scale-100 transition-transform"
                                        alt="Remove"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                    {/* Placeholders for empty state to show grid structure */}
                    {disabled && Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i.toString()}
                            className="aspect-square rounded-lg bg-zinc-800/30 border border-white/5"
                        />
                    ))}
                </div>
                {palette.length === 0 && !disabled && (
                    <div className="text-center py-6 border-2 border-dashed border-zinc-800/50 rounded-xl bg-zinc-900/20">
                        <p className="text-xs text-zinc-600">
                            No colors extracted
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
