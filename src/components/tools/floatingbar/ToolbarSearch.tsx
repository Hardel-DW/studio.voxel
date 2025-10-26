import type { TranslateTextType } from "@/components/tools/Translate";
import { TextInput } from "@/components/ui/TextInput";
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
                className="min-w-64 pl-8 pr-4 py-2 select-none user-select-none bg-zinc-800/30 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:bg-zinc-700/20 transition-all"
            />
        </div>
    );
}
