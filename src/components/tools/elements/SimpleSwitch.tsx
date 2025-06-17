import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";

export default function SimpleSwitch(props: BaseInteractiveComponent) {
    const { value, handleChange } = useInteractiveLogic<BaseInteractiveComponent, boolean>({ component: props }, props.elementId);
    if (value === null) return null;

    return (
        <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <input type="checkbox" checked={value} onChange={(e) => handleChange(e.target.checked)} className="sr-only" />
        </label>
    );
}
