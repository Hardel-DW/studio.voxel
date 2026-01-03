import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { useI18n, type Locale } from "@/lib/i18n";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const supportedLocales: Locale[] = ["en-us", "fr-fr"];

const getLanguageName = (locale: Locale): string => {
    const displayNames = new Intl.DisplayNames([locale], { type: "language" });
    return displayNames.of(locale.split("-")[0]) ?? locale;
};

export default function Internalization() {
    const locale = useI18n((state) => state.locale);
    const navigate = useNavigate();

    const handleLanguageChange = (newLang: Locale) => {
        navigate({ params: { lang: newLang } as never });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-zinc-800/30">
                    <span className="uppercase font-medium tracking-wide">{locale.split("-")[0]}</span>
                    <svg className="size-3 opacity-50" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 bg-sidebar">
                {supportedLocales.map((lang) => (
                    <DropdownMenuItem
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn("flex-row justify-between gap-4", lang === locale && "text-white")}>
                        <span>{getLanguageName(lang)}</span>
                        {lang === locale && (
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
