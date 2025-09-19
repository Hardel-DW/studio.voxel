import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { TranslateTextType } from "@/components/tools/Translate";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/hook/useTranslation";
import Range from "@/components/ui/Range";

// Type defined locally
export type ToolRangeType = BaseInteractiveComponent & {
    type: "Range";
    label: TranslateTextType;
    min: number;
    max: number;
    step: number;
};

export default function ToolRange(props: ToolRangeType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolRangeType, number>({ component: props });
    const labelText = useTranslate(props.label);
    const lockText = useTranslate(lock.text);

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
