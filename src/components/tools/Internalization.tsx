import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { useI18nStore } from "@/lib/i18n/i18nStore";
import { cn } from "@/lib/utils";

export default function Internalization() {
    const language = useI18nStore((state) => state.language);
    const setLanguage = useI18nStore((state) => state.setLanguage);
    const names = [
        { lang: "en-us", name: "English" },
        { lang: "fr-fr", name: "Français" }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-zinc-800/30">
                    <span className="uppercase font-medium tracking-wide">{language.split("-")[0]}</span>
                    <svg className="size-3 opacity-50" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 bg-sidebar">
                {names.map((name) => (
                    <DropdownMenuItem
                        key={name.lang}
                        onClick={() => setLanguage(name.lang)}
                        className={cn("flex-row justify-between gap-4", name.lang === language && "text-white")}>
                        <span>{name.name}</span>
                        {name.lang === language && (
                            <svg className="size-4" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
