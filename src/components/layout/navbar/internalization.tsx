import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export default function Internalization() {
    const routerState = useRouterState();
    const pathname = routerState.location.pathname;
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const currentLocale = pathname.split("/")[1];
    const names = [
        { lang: "en-us", name: "English" },
        { lang: "fr-fr", name: "Français" }
    ];

    const currentLangName = names.find((element) => element.lang === currentLocale)?.name || currentLocale;

    return (
        <div className="relative group/langage">
            <button
                type="button"
                className="select-none mr-4 flex items-center gap-2 cursor-pointer hover:text-zinc-400 transition">
                <span data-lang={currentLocale}>{currentLangName}</span>
                <img src="/icons/chevron-down.svg" alt="" className="w-4 h-4 invert" />
            </button>

            <ul
                className="group-focus-within/langage:flex hover:flex hidden absolute top-8 right-0 w-44 bg-black p-2 flex-col gap-2 rounded-xl border border-zinc-800">
                {names.map((element) => (
                    <li key={element.lang}>
                        <a
                            href={`/${element.lang}/${pathWithoutLocale}`}
                            className={cn(
                                "flex items-center justify-between px-4 py-2 transition hover:bg-zinc-900 rounded-md",
                                element.lang === currentLocale ? "font-semibold text-rose-700" : ""
                            )}>
                            {element.name}
                            {element.lang === currentLocale && (
                                <svg
                                    width="11"
                                    height="8"
                                    viewBox="0 0 11 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4">
                                    <path
                                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                    />
                                </svg>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
