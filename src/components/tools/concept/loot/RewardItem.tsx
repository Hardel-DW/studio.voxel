import { calculateItemCountRange, type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { ToolbarButton } from "@/components/tools/floatingbar/ToolbarButton";
import { useClickOutside } from "@/lib/hook/useClickOutside";

interface RewardItemProps extends FlattenedLootItem {
    normalizedProbability?: number;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}

export default function RewardItem(props: RewardItemProps) {
    const countRange = calculateItemCountRange(props.functions);
    const probabilityPercentage = props.normalizedProbability ? (props.normalizedProbability * 100).toFixed(1) : null;
    const { expand, collapse, isExpanded } = useDynamicIsland();
    const clickOutsideRef = useClickOutside(() => {
        if (isExpanded) collapse();
    });

    const handleClick = () => {
        if (!props.id) return;

        expand(
            <div ref={clickOutsideRef} className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-300">
                    <TextureRenderer id={props.name} className="w-6 h-6" />
                    <span className="text-sm font-medium">{Identifier.toDisplay(props.name)}</span>
                </div>
                <div className="flex items-center gap-2">
                    {props.onEdit && (
                        <ToolbarButton
                            icon="/icons/tools/overview/edit.svg"
                            tooltip="loot:main.item.edit"
                            onClick={() => {
                                if (props.id && props.onEdit) {
                                    props.onEdit(props.id);
                                    collapse();
                                }
                            }}
                        />
                    )}
                    {props.onDelete && (
                        <ToolbarButton
                            icon="/icons/tools/overview/delete.svg"
                            tooltip="loot:main.item.delete"
                            onClick={() => {
                                if (props.id && props.onDelete) {
                                    props.onDelete(props.id);
                                    collapse();
                                }
                            }}
                        />
                    )}
                    <ToolbarButton icon="/icons/tools/overview/close.svg" tooltip="loot:main.item.close" onClick={collapse} />
                </div>
            </div>
        );
    };

    return (
        <li
            onClick={handleClick}
            className="relative overflow-hidden text-zinc-400 tracking-tighter text-xs bg-zinc-900/20 rounded-md border border-zinc-900 p-4 h-fit flex items-center justify-between gap-x-8 cursor-pointer hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-x-4">
                <TextureRenderer id={props.name} className="size-10" />
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-white">{Identifier.of(props.name, "not_a_registry").toResourceName()}</h2>
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
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
        </li>
    );
}
