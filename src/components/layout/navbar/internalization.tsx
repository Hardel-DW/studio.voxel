import { useNavigate } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { type Locale, supportedLocales, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Internalization() {
    const locale = useI18n((state) => state.locale);
    const isLoading = useI18n((state) => state.isLoading);
    const navigate = useNavigate();

    const handleLanguageChange = (newLang: Locale) => {
        navigate({ params: { lang: newLang } as never });
    };

    const currentLocaleName = (locale: Locale) => {
        const name = new Intl.DisplayNames(locale, { type: "language" }).of(locale) || locale;
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button type="button" className="select-none mr-4 flex items-center gap-2 cursor-pointer hover:text-zinc-400 transition">
                    <span data-lang={locale}>{currentLocaleName(locale)}</span>
                    <img src="/icons/chevron-down.svg" alt="Chevron down" className="w-4 h-4 invert" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-48 bg-black border-zinc-800">
                {isLoading ? (
                    <div className="px-4 py-2 text-sm text-zinc-400 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                ) : (
                    supportedLocales.map((lang) => (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={cn("flex-row justify-between", lang === locale && "font-semibold text-rose-700")}>
                            <span>{currentLocaleName(lang)}</span>
                            {lang === locale && <img src="/icons/valid.svg" alt="Check" className="w-4 h-4" />}
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
