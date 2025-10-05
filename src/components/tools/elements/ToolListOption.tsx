import { Identifier } from "@voxelio/breeze";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { TranslateTextType } from "@/components/tools/Translate";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import type { ActionOrBuilder, BaseInteractiveComponent, BaseRender } from "@/lib/hook/useInteractiveLogic";
import { useActionHandler, useInteractiveLogic, useRenderer } from "@/lib/hook/useInteractiveLogic";
import { cn } from "@/lib/utils";

export type ToolListOptionType = BaseInteractiveComponent & {
    title: TranslateTextType;
    description: TranslateTextType;
    image?: string;
    values: string[];
    index?: number;
    highlight?: boolean;
    highlightRenderer?: BaseRender;
    disableToggle?: boolean;
    highlightAction?: ActionOrBuilder;
    onSelect?: () => void;
};

export default function ToolListOption(props: ToolListOptionType) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolListOptionType, boolean>({ component: props });
    const highlightAction = useActionHandler(props.highlightAction, { ...props });
    const highlightValue = useRenderer<boolean>(props.highlightRenderer, props.elementId);
    if (value === null) return null;

    const handleSelection = () => {
        if (lock.isLocked) return;
        if (props.disableToggle) {
            props.onSelect?.();
            return;
        }

        handleChange(!value);
    };

    const handleHighlightAction = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (lock.isLocked) return;
        highlightAction.handleChange(true);
    };

    return (
        <RenderGuard condition={props.hide}>
            <button
                type="button"
                className={cn(
                    "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 px-6 py-4 rounded-xl cursor-pointer relative overflow-hidden w-full h-full text-left flex flex-col justify-between",
                    { "bg-black/25 ring-1 ring-zinc-600": value },
                    { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
                )}
                onClick={handleSelection}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelection();
                    }
                }}
                disabled={lock.isLocked}>
                {highlightValue && (
                    <span className="absolute top-2 right-2">
                        <img src="/icons/star.svg" alt="Highlight" className="w-4 h-4 invert" />
                    </span>
                )}
                <div className="flex flex-col flex-1">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-4">
                            {props.image && (
                                <div className="shrink-0">
                                    <img src={props.image} alt="" className="w-8 h-8 object-contain pixelated" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-white line-clamp-1">
                                    <Translate content={props.title} />
                                </span>
                                <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                    <Translate content={props.description} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {props.values.length > 0 && (
                        <>
                            <hr className="border-zinc-700 my-2" />
                            <div className="grid gap-1">
                                {props.values.slice(0, props.values.length <= 4 ? props.values.length : 3).map((val) => (
                                    <span
                                        key={val}
                                        className="text-zinc-400 tracking-tighter text-xs px-2 bg-zinc-900/20 py-0.5 rounded-md border border-zinc-900">
                                        {Identifier.of(val, "minecraft").toResourceName()}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div>
                        {props.values.length > 4 && (
                            <Popover>
                                <PopoverTrigger>
                                    <span className="text-zinc-400 text-xs px-2 pt-2 hover:text-zinc-200 cursor-pointer transition-colors">
                                        Voir plus ({props.values.length - 3})
                                    </span>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-xs">
                                    <div className="grid gap-1">
                                        {props.values.slice(3).map((val) => (
                                            <span
                                                key={val}
                                                className="text-zinc-400 tracking-tighter text-xs px-2 bg-zinc-900/20 py-0.5 rounded-md border border-zinc-900">
                                                {Identifier.of(val, "minecraft").toResourceName()}
                                            </span>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <div>
                        {props.highlightAction && highlightValue && (
                            <Button
                                variant="ghost_border"
                                size="xs"
                                className="rounded-md text-zinc-400 text-xs px-3 py-2"
                                onClick={handleHighlightAction}>
                                Retirer
                            </Button>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${props.index ?? 0 * 75}px)` }}>
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </button>
        </RenderGuard>
    );
}
