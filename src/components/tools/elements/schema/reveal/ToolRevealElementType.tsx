"use client";

import { LinkButton } from "@/components/ui/Button";
import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";
import { memo } from "react";
import type { ToolRevealCardData } from "./ToolReveal";

interface ToolRevealElementProps {
    element: ToolRevealCardData;
    isSelected: boolean;
    onSelect: () => void;
}

const ToolRevealElement = memo(function ToolRevealElement({ element, isSelected, onSelect }: ToolRevealElementProps) {
    const handleClick = () => onSelect();

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleClick}
            className="transition-all stack group cursor-pointer rounded-2xl border border-zinc-800">
            <div className="relative z-50 self-start justify-self-end p-4">
                <LinkButton
                    variant="white-shimmer"
                    href={element.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn({
                        "opacity-50 hover:opacity-50": element.soon
                    })}>
                    <Translate content={element.soon ? "generic.soon" : "generic.more"} />
                </LinkButton>
            </div>
            <div className="bg-shadow-bottom rounded-2xl relative z-10" />
            <div
                className={cn("h-48 w-full rounded-2xl bg-cover bg-center transition", {
                    "grayscale opacity-50 group-hover:opacity-60": !isSelected,
                    "opacity-100": isSelected
                })}
                style={{ backgroundImage: `url(${element.image})` }}
            />
            <div className="self-end justify-self-end pb-4 pr-4 w-16 z-20">
                <img className="self-center" src={element.logo} alt={typeof element.title === "string" ? element.title : "TranslateText"} />
            </div>
            <div
                className={cn("p-4 self-end relative z-20", {
                    "opacity-50": !isSelected
                })}>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold uppercase tracking-wider">
                        <Translate content={element.title} schema={true} />
                    </h1>
                    <p className="text-zinc-400 font-semibold text-xs">
                        <Translate content={element.description} schema={true} />
                    </p>
                </div>
            </div>
        </div>
    );
});

export default ToolRevealElement;
