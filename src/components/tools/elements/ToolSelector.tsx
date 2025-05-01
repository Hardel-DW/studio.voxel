import Tabs from "@/components/ui/Tabs";
import type { ToolSelectorType } from "@voxelio/breeze/core";
import type { InteractiveComponentProps } from "./InteractiveComponent";
import Translate from "@/components/tools/Translate";

export default function ToolSelector({ component, interactiveProps }: InteractiveComponentProps<string, ToolSelectorType>) {
    const { value, lock, handleChange } = interactiveProps;

    const list = component.options.map((option) => ({
        label: <Translate content={option.label} />,
        value: option.value
    }));

    return (
        <div className="bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-800 hover:ring-1 backdrop-blur-2xl cursor-pointer relative overflow-hidden transition-all  p-6 rounded-xl">
            <div className="flex flex-col gap-4 h-full px-6">
                <div className="flex justify-between items-center w-full gap-4">
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-white line-clamp-1">
                                <Translate content={component.title} schema={true} />
                            </span>
                        </div>
                        {lock.isLocked ? (
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                <Translate content={lock.text} schema={true} />
                            </span>
                        ) : (
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                <Translate content={component.description} schema={true} />
                            </span>
                        )}
                    </div>

                    <Tabs tabs={list} defaultTab={value} onChange={(option) => handleChange(option)} disabled={lock.isLocked} />
                </div>
            </div>
            <div className="absolute inset-0 -z-10 brightness-15">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    );
}
