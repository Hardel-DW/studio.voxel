import RenderGuard from "@/components/tools/elements/RenderGuard";
import Range from "@/components/ui/Range";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";

// Type defined locally
export type ToolRangeType = BaseInteractiveComponent & {
    label: string;
    min: number;
    max: number;
    step: number;
};

export default function ToolRange(props: ToolRangeType & { index?: number }) {
    const t = useTranslate();
    const { value, lock, handleChange } = useInteractiveLogic<ToolRangeType, number>({ component: props });
    const labelText = t(props.label);
    const lockText = t(lock.text);

    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <Range
                value={value}
                min={props.min}
                max={props.max}
                step={props.step}
                disabled={lock.isLocked}
                label={lock.isLocked ? lockText : labelText}
                onChangeEnd={handleChange}
            />
        </RenderGuard>
    );
}
