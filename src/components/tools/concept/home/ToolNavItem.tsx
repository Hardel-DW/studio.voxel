import { useLocation, useParams, useRouter } from "@tanstack/react-router";
import type { CONCEPT_KEY } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";

interface ToolNavItemProps {
    title: string;
    description: string;
    image: string;
    href: string;
    alignRight?: boolean;
    comingSoon?: boolean;
    elementsCount?: number;
    index: number;
}

export function ToolNavItem({ title, description, image, href, alignRight, comingSoon, elementsCount, index }: ToolNavItemProps) {
    const router = useRouter();
    const location = useLocation();
    const { lang } = useParams({ from: "/$lang" });
    const handleClick = () => {
        const targetRoute = useConfiguratorStore.getState().setConcept(href as CONCEPT_KEY, location.pathname);
        router.navigate({ to: targetRoute, params: { lang } });
    };

    return (
        <button
            type="button"
            className={cn(
                "overflow-hidden bg-black/25 backdrop-blur-sm flex items-center relative justify-between w-full group rounded-xl p-4 transition-all duration-300 cursor-pointer ring-2 ring-zinc-900",
                comingSoon ? "opacity-60 relative" : "hover:ring-stone-900 hover:bg-black/45",
                alignRight && "ml-auto flex-row-reverse"
            )}
            onClick={handleClick}
            disabled={comingSoon}>
            <div
                className="absolute inset-0 -z-10 brightness-20 hue-rotate-90 blur-lg"
                style={{ transform: `translateX(${-200 + index * 100}px)` }}>
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
            </div>

            <div className={cn("flex items-center gap-4", alignRight && "flex-row-reverse")}>
                <div
                    className={cn(
                        "w-12 h-12 flex-shrink-0",
                        !comingSoon && "transition-transform duration-300 group-hover:scale-110",
                        !comingSoon && (alignRight ? "group-hover:-rotate-2" : "group-hover:rotate-2")
                    )}>
                    <img src={image} alt="Tool" className={cn("w-full h-full pixelated", comingSoon && "grayscale")} />
                </div>
                <div className={cn("text-left", alignRight && "text-right")}>
                    <div className={cn("flex items-center gap-2 mb-1", alignRight && "flex-row-reverse")}>
                        <h3 className="text-xl font-semibold text-white">
                            <Translate content={title} />
                        </h3>
                        {elementsCount !== undefined && !comingSoon && (
                            <span className="bg-zinc-900/50 text-zinc-400 border border-zinc-800 text-xs px-2 py-1 rounded-full font-medium">
                                {elementsCount} <Translate content="elements" />
                            </span>
                        )}
                        {comingSoon && (
                            <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 text-xs rounded-full">
                                <Translate content="tools.coming_soon" />
                            </span>
                        )}
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        <Translate content={description} />
                    </p>
                </div>
            </div>

            {!comingSoon && (
                <div
                    className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all duration-300 transform",
                        alignRight ? "translate-x-4 group-hover:translate-x-0" : "-translate-x-4 group-hover:translate-x-0"
                    )}>
                    <svg className="w-12 h-12 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={alignRight ? "M7 17l-4-4m0 0l4-4m-4 4h18" : "M17 8l4 4m0 0l-4 4m4-4H3"}
                        />
                    </svg>
                </div>
            )}
        </button>
    );
}
