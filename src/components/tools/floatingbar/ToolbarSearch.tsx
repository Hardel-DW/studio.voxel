import { TextInput } from "@/components/ui/TextInput";
import type { TranslateTextType } from "@/components/ui/Translate";
import { useTranslate } from "@/lib/hook/useTranslation";

interface ToolbarSearchProps {
    placeholder?: TranslateTextType;
    value?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
}

export function ToolbarSearch({ placeholder, value, onChange, onSubmit }: ToolbarSearchProps) {
    const translatedPlaceholder = useTranslate(typeof placeholder === "string" ? placeholder : "search.placeholder");

    return (
        <div className="flex-1 relative">
            <TextInput
                placeholder={translatedPlaceholder}
                defaultValue={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && onSubmit) {
                        onSubmit(e.currentTarget.value);
                    }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="min-w-64 "
            />
        </div>
    );
}
