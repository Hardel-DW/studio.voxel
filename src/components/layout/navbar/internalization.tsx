import { useRouterState } from "@tanstack/react-router";
import { type Locale, supportedLocales } from "@/lib/i18n/i18n";
import { cn } from "@/lib/utils";

export default function Internalization() {
    const routerState = useRouterState();
    const pathname = routerState.location.pathname;
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const currentLocale = pathname.split("/")[1] as Locale;
    const currentLocaleName = (locale: Locale) => {
        const name = new Intl.DisplayNames(locale, { type: "language" }).of(locale) || locale;
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const names: Array<{ lang: Locale; name: string }> = supportedLocales.map((locale) => ({
        lang: locale,
        name: currentLocaleName(locale)
    }));

    return (
        <div className="relative group/langage">
            <button type="button" className="select-none mr-4 flex items-center gap-2 cursor-pointer hover:text-zinc-400 transition">
                <span data-lang={currentLocale}>{currentLocaleName(currentLocale)}</span>
                <img src="/icons/chevron-down.svg" alt="Chevron down" className="w-4 h-4 invert" />
            </button>

            <ul className="group-focus-within/langage:flex hover:flex hidden absolute top-8 right-0 w-56 bg-black p-2 flex-col gap-2 rounded-xl border border-zinc-800">
                {names.map((element) => (
                    <li key={element.lang}>
                        <a
                            href={`/${element.lang}/${pathWithoutLocale}`}
                            className={cn(
                                "flex items-center justify-between px-4 py-2 transition hover:bg-zinc-900 rounded-md",
                                element.lang === currentLocale ? "font-semibold text-rose-700" : ""
                            )}>
                            {element.name}
                            {element.lang === currentLocale && <img src="/icons/valid.svg" alt="Check" className="w-4 h-4" />}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
