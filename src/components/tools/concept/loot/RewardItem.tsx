import { calculateItemCountRange, type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";

interface RewardItemProps extends FlattenedLootItem {
    normalizedProbability?: number;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}

export default function RewardItem(props: RewardItemProps) {
    const countRange = calculateItemCountRange(props.functions);
    const probabilityPercentage = props.normalizedProbability ? (props.normalizedProbability * 100).toFixed(1) : null;
    const handleDelete = () => props.id && props.onDelete?.(props.id);
    const handleEdit = () => props.id && props.onEdit?.(props.id);

    return (
        <li
            onClick={handleEdit}
            className="group/reward relative overflow-hidden text-zinc-400 tracking-tighter text-xs bg-zinc-900/20 rounded-md border border-zinc-900 p-2 pl-4 h-fit flex items-center justify-between gap-x-8 cursor-pointer hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-x-4">
                <TextureRenderer id={props.name} className="size-10" />
                <div className="flex flex-col">
                    <h2 className="text-base font-extralight text-zinc-200 font-seven -tracking-wide">
                        {Identifier.toDisplay(props.name)}
                    </h2>
                    <p className="text-xs text-zinc-400">{props.name}</p>
                </div>
            </div>

            <div className="flex items-center gap-x-4">
                <button onClick={handleDelete} type="button" className="p-1.5 cursor-pointer hidden group-hover/reward:block">
                    <svg
                        className="size-4 hover:text-red-500 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6" />
                    </svg>
                </button>
                <div className="flex items-center gap-x-4 text-right bg-zinc-900/70 rounded-md px-4 py-1">
                    <div className="text-right">
                        <p className="text-white font-bold text-lg">
                            {countRange.min === countRange.max ? `×${countRange.min}` : `×${countRange.min}-${countRange.max}`}
                        </p>
                        {probabilityPercentage && <p className="text-xs text-zinc-400">{probabilityPercentage}% chance</p>}
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10 brightness-30 hue-rotate-15">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
        </li>
    );
}
