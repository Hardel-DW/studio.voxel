import { calculateItemCountRange, type LootItem } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";

interface RewardItemProps extends LootItem {
    probability?: number;
    onDelete?: (id: string) => void;
}

export default function RewardItem(props: RewardItemProps) {
    const countRange = calculateItemCountRange(props.functions);
    const probabilityPercentage = props.probability ? (props.probability * 100).toFixed(1) : null;

    return (
        <li className="relative overflow-hidden text-zinc-400 tracking-tighter text-xs bg-zinc-900/20 rounded-md border border-zinc-900 p-4 h-fit flex items-center justify-between gap-x-8">
            <div className="flex items-center gap-x-4">
                <TextureRenderer id={props.name} />
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-white">
                        {props.name
                            .replace(/^[^:]+:/, "")
                            .split("_")
                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                    </h2>
                    <p className="text-sm text-zinc-400">{props.name}</p>
                </div>
            </div>

            <div className="flex items-center gap-x-4 text-right">
                <div className="text-right">
                    <p className="text-white font-bold text-lg">
                        {countRange.min === countRange.max ? `×${countRange.min}` : `×${countRange.min}-${countRange.max}`}
                    </p>
                    {probabilityPercentage && <p className="text-xs text-zinc-400">{probabilityPercentage}% chance</p>}
                </div>
            </div>

            <div className="absolute inset-0 -z-10 brightness-30 hue-rotate-15">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </li>
    );
}

/**
 *  {props.onDelete && (
                    <button
                        type="button"
                        onClick={() => props.onDelete?.(props.id)}
                        className="text-zinc-400 cursor-pointer hover:text-red-400 transition-colors p-1"
                        title="Delete item"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
 */
