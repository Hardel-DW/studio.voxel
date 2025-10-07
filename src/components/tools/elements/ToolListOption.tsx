import { Identifier } from "@voxelio/breeze";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import { useConfiguratorStore } from "@/components/tools/Store";
import type { TranslateTextType } from "@/components/tools/Translate";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useElementLocks } from "@/lib/hook/useBreezeElement";
import type { ActionOrBuilder, BaseRender } from "@/lib/hook/useInteractiveLogic";
import { useActionHandler, useRenderer } from "@/lib/hook/useInteractiveLogic";
import type { Condition, Lock } from "@/lib/utils/lock";
import { cn } from "@/lib/utils";

export type ToolListOptionAction = {
    title: TranslateTextType;
    subtitle?: TranslateTextType;
    description: TranslateTextType;
    action: ActionOrBuilder;
    renderer?: BaseRender;
    type?: "toggle" | "action";
};

export type ToolListOptionType = {
    title: TranslateTextType;
    description: TranslateTextType;
    image?: string;
    values: string[];
    index?: number;
    hide?: Condition;
    lock?: Lock[];
    elementId?: string;
    actions?: ToolListOptionAction[];
};

function ActionItem(props: ToolListOptionAction & { elementId?: string; lock: { isLocked: boolean } }) {
    const actionHandler = useActionHandler(props.action, { elementId: props.elementId });
    const isChecked = useRenderer<boolean>(props.renderer, props.elementId);

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.lock.isLocked) return;
        actionHandler.handleChange(!isChecked);
    };

    return (
        <label
            htmlFor="action-switch"
            className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-zinc-900/50 cursor-pointer transition-colors"
            onClick={handleAction}>
            <div className="flex flex-col flex-1">
                <div className="text-sm text-zinc-200 flex items-center gap-2">
                    <span className="text-sm text-zinc-200">
                        <Translate content={props.title} />
                    </span>
                    {props.subtitle && (
                        <span className="text-[10px] text-zinc-500 bg-zinc-900/20 px-1 py-0.5 rounded-md border border-zinc-900">
                            <Translate content={props.subtitle} />
                        </span>
                    )}
                </div>
                <span className="text-xs text-zinc-500">
                    <Translate content={props.description} />
                </span>
            </div>
            <Switch id="action-switch" isChecked={isChecked ?? false} setIsChecked={() => { }} disabled={props.lock.isLocked} />
        </label>
    );
}

export default function ToolListOption(props: ToolListOptionType) {
    const currentElementId = useConfiguratorStore((state) => props.elementId ?? state.currentElementId);
    const lock = useElementLocks(props.lock, currentElementId);
    const isInList = useRenderer<boolean>(props.actions?.[1]?.renderer, props.elementId);
    const targetValue = useRenderer<boolean>(props.actions?.[0]?.renderer, props.elementId);

    return (
        <RenderGuard condition={props.hide}>
            <div className={cn(
                "bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 px-6 py-4 rounded-xl relative overflow-hidden w-full h-full text-left flex flex-col justify-between",
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}>
                {isInList && (
                    <span className="absolute top-2 right-2">
                        <img src="/icons/star.svg" alt="In list" className="w-4 h-4 invert" />
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
                        {props.actions && props.actions.length > 0 && (
                            <Popover>
                                <PopoverTrigger>
                                    <Button
                                        variant="ghost_border"
                                        size="xs"
                                        className="rounded-md text-zinc-400 text-xs px-3 py-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}>
                                        Actions
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-80">
                                    <div className="space-y-2">
                                        <ActionItem {...props.actions[0]} elementId={props.elementId} lock={lock} key={`target-${targetValue}`} />
                                        <ActionItem {...props.actions[1]} elementId={props.elementId} lock={lock} key={`membership-${isInList}`} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 brightness-25" style={{ transform: `translateX(${props.index ?? 0 * 75}px)` }}>
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </div>
        </RenderGuard>
    );
}
