"use client";

import { cn } from "@/lib/utils";

interface Props {
    title: string;
    description: string;
    image: { src: string; alt: string };
    index: number;
    selected?: boolean;
    locked?: boolean;
    onClick?: () => void;
}

export default function SidebarCard(props: Props) {
    const handleEvent = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
        if (props.locked) return;

        e.preventDefault();
        if (e.type === "keydown") {
            const keyboardEvent = e as React.KeyboardEvent<HTMLDivElement>;
            if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") {
                return;
            }
        }
        props.onClick?.();
    };

    return (
        <div
            style={{ "--tw-duration": `${(props.index + 5) * 50}ms` } as React.CSSProperties}
            className={cn("select-none relative group/card transition-all hover:opacity-100 starting:translate-x-50 translate-x-0", {
                "opacity-100": props.selected,
                "opacity-50": !props.selected,
                "hover:opacity-55": props.locked
            })}>
            {props.selected && (
                <div className="absolute inset-0 -z-10 hue-rotate-45 rotate-180 starting:opacity-0 transition-all duration-500 brightness-20">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            )}

            <div onClick={handleEvent} onKeyDown={handleEvent}>
                <div
                    className={cn(
                        "stack overflow-hidden rounded-2xl w-full h-24 relative cursor-pointer transition-all transition-discrete hidden:opacity-0 bg-content",
                        {
                            "border-zinc-900 border-l-2 border-t-2": props.selected,
                            "border-zinc-900 border-2": !props.selected
                        }
                    )}>
                    <div className="absolute inset-0 -z-10 hue-rotate-45 brightness-20">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                    <div className="grid grid-rows-[1fr_auto] p-4">
                        <div className="flex items-center gap-2 h-full w-full justify-between">
                            <div className="flex flex-col items-start">
                                <div
                                    className={cn("text-lg font-bold break-words", {
                                        "text-white": props.selected,
                                        "text-zinc-400": !props.selected
                                    })}>
                                    {props.title}
                                </div>
                                <p className="text-xs text-zinc-400">{props.description}</p>
                            </div>
                            <img
                                src={props.image.src}
                                alt={props.image.alt}
                                className={cn("size-12 rounded-2xl justify-self-end -z-10", {
                                    "opacity-50": props.locked || !props.selected
                                })}
                            />
                        </div>
                    </div>
                    {props.selected && (
                        <img
                            src={props.image.src}
                            alt={props.image.alt}
                            className={cn(
                                "h-full w-16 rounded-2xl object-cover justify-self-end self-center blur-[3rem] opacity-50 -z-50",
                                {
                                    "opacity-50": props.locked || !props.selected
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
            </div>
        </div>
    );
}
