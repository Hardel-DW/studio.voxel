import Translate from "@/components/tools/Translate";
import type { BaseInteractiveComponent } from "@/components/tools/types/component";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { cn } from "@/lib/utils";

type OverviewCaseProps = BaseInteractiveComponent & {
    title: string;
    image: string;
};

export default function OverviewCase(props: OverviewCaseProps) {
    const { value, lock, handleChange } = useInteractiveLogic<OverviewCaseProps, boolean>({ component: props }, props.elementId);
    if (value === null) return null;

    return (
        <div
            onClick={() => handleChange(!value)}
            className={cn(
                "flex items-center hover:ring-1 relative ring-zinc-800 justify-center p-2 bg-black/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer h-24",
                { "bg-zinc-950/25 ring-1 ring-zinc-800": value },
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}>
            {value && !lock.isLocked && (
                <div className="absolute p-1 top-0 right-0">
                    <img src="/icons/check.svg" alt="checkbox" className="w-4 h-4 invert-50" />
                </div>
            )}

            {lock.isLocked && (
                <div className="absolute p-1 top-0 right-0">
                    <img src="/icons/tools/lock.svg" alt="checkbox" className="w-4 h-4 invert-50" />
                </div>
            )}
            <img src={props.image} alt={props.title} className="pixelated h-full p-4" />
        </div>
    );
}
