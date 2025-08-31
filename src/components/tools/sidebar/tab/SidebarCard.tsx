import { Link, useLocation, useParams, useRouter } from "@tanstack/react-router";
import type { CONCEPT_KEY } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";

interface Props {
    title: string;
    children: React.ReactNode;
    image: { src: string; alt: string };
    index: number;
    locked?: boolean;
    registry: CONCEPT_KEY;
    overview: string;
}

export default function SidebarCard(props: Props) {
    const params = useParams({ from: "/$lang/studio/editor" });
    const isSelected = useConfiguratorStore((state) => state.selectedConcept === props.registry);
    const setSelectedConcept = useConfiguratorStore((state) => state.setSelectedConcept);
    const getLastVisitedRoute = useConfiguratorStore((state) => state.getLastVisitedRoute);
    const setLastVisitedRoute = useConfiguratorStore((state) => state.setLastVisitedRoute);
    const setCurrentElementId = useConfiguratorStore((state) => state.setCurrentElementId);
    const router = useRouter();
    const location = useLocation();

    const handleConceptClick = () => {
        const currentSelected = useConfiguratorStore.getState().selectedConcept;
        const currentElementId = useConfiguratorStore.getState().currentElementId;
        if (currentSelected && currentSelected !== props.registry) {
            setLastVisitedRoute(currentSelected as CONCEPT_KEY, location.pathname, currentElementId ?? null);
        }

        setSelectedConcept(props.registry);

        const lastVisited = getLastVisitedRoute(props.registry);
        const targetRoute = lastVisited?.route ?? props.overview;
        const targetElementId = lastVisited?.elementId ?? null;

        setCurrentElementId(targetElementId);
        router.navigate({ to: targetRoute, params: { lang: params.lang } });
    };

    const handleEvent = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        if (props.locked || isSelected) return;

        e.preventDefault();
        if (e.type === "keydown") {
            const keyboardEvent = e as React.KeyboardEvent<HTMLButtonElement>;
            if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") {
                return;
            }
        }
        handleConceptClick();
    };

    return (
        <div
            style={{ "--tw-duration": `${(props.index + 5) * 50}ms` } as React.CSSProperties}
            className={cn("select-none relative group/card transition-all hover:opacity-100 starting:translate-x-50 translate-x-0", {
                "opacity-100": isSelected,
                "opacity-50": !isSelected,
                "hover:opacity-55": props.locked
            })}>
            {isSelected && (
                <div className="absolute inset-0 -z-10 hue-rotate-45 rotate-180 starting:opacity-0 transition-all duration-500 brightness-20">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            )}

            <button
                type="button"
                onClick={handleEvent}
                onKeyDown={handleEvent}
                className="flex flex-col rounded-2xl border-zinc-900 border-2 w-full">
                <div
                    className={cn(
                        "stack overflow-hiddenw-full h-24 relative cursor-pointer transition-all transition-discrete hidden:opacity-0 bg-content flex-1",
                        {
                            "border-zinc-900": isSelected
                        }
                    )}>
                    <div className="absolute inset-0 -z-10 hue-rotate-45 brightness-20">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                    <div className="p-4 h-full">
                        <div className="flex items-center gap-2 h-full w-full justify-between">
                            <div className="flex flex-col items-start">
                                <div
                                    className={cn("text-lg font-bold break-words", {
                                        "text-white": isSelected,
                                        "text-zinc-400": !isSelected
                                    })}>
                                    {props.title}
                                </div>
                                <p className="text-xs text-zinc-400">{props.children}</p>
                            </div>
                            <img
                                src={props.image.src}
                                alt={props.image.alt}
                                className={cn("size-12 rounded-2xl justify-self-end -z-10", {
                                    "opacity-50": props.locked || !isSelected
                                })}
                            />
                        </div>
                    </div>
                    {isSelected && (
                        <img
                            src={props.image.src}
                            alt={props.image.alt}
                            className={cn(
                                "h-full w-16 rounded-2xl object-cover justify-self-end self-center blur-[3rem] opacity-50 -z-50",
                                {
                                    "opacity-50": props.locked || !isSelected
                                }
                            )}
                        />
                    )}
                    {props.locked && (
                        <>
                            <div className="absolute inset-0 -z-10 hue-rotate-45 brightness-50">
                                <img src="/images/shine.avif" alt="Shine" />
                            </div>

                            <div className="absolute left-0 right-0 h-1/2 top-1/2 -translate-y-1/2 -z-10 bg-linear-to-t blur-xl from-black to-fuchsia-950/75 rounded-2xl" />
                            <div className="size-full flex justify-center items-center rounded-2xl stack">
                                <div className="text-3xl uppercase tracking-wider font-bold text-white">Bientôt</div>
                            </div>
                        </>
                    )}
                </div>
                {isSelected && (
                    <div className="px-4 py-2">
                        <Link
                            to={props.overview}
                            params={{ lang: params.lang }}
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full rounded-2xl cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/20 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors text-center">
                            <Translate content="overview" />
                        </Link>
                    </div>
                )}
            </button>
        </div>
    );
}
