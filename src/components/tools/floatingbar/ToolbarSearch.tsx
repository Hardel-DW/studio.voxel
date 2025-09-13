import type { TranslateTextType } from "@/components/tools/Translate";
import { useTranslateKey } from "@/lib/hook/useTranslation";

interface ToolbarSearchProps {
    placeholder?: TranslateTextType;
    value?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
}

export function ToolbarSearch({ placeholder, value, onChange, onSubmit }: ToolbarSearchProps) {
    const translatedPlaceholder = useTranslateKey(typeof placeholder === "string" ? placeholder : "search.placeholder");

    return (
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
            <input
                type="custom"
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
