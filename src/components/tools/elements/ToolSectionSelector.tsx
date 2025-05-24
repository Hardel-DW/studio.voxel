"use client";

import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";
import type React from "react";
import type { BaseComponent, TranslateTextType } from "../types/component";
import RenderGuard from "./RenderGuard";

export type ToolSectionSelectorSection = BaseComponent & {
    id: string;
    title: TranslateTextType;
    children: React.ReactNode;
    elements: {
        id: string;
        title: TranslateTextType;
    }[];
    value: string;
    setValue: (value: string) => void;
};

export default function ToolSectionSelector(props: ToolSectionSelectorSection) {
    return (
        <RenderGuard condition={props.hide}>
            <div className="not-first:mt-16 h-full">
                <div className="flex flex-col ring-0 transition-all h-full">
                    <div className="py-2 px-2 gap-4 flex flex-wrap justify-between items-center cursor-pointer shrink-0">
                        <div className="relative">
                            <h2 className="text-2xl font-semibold">
                                <Translate content={props.title} schema={true} />
                            </h2>
                            <hr className="!m-0 absolute -bottom-2 left-0 right-0" />
                        </div>
                        {props.elements && (
                            <div className="flex gap-x-2 py-2 px-2 items-center rounded-2xl p-1 bg-black/50 border-t-2 border-l-2 border-stone-900 shrink-0 relative overflow-hidden">
                                {props.elements.map((element) => (
                                    <button
                                        type="button"
                                        className={cn("px-4 py-2 rounded-xl text-left", {
                                            "bg-rose-900 text-white": props.value === element.id,
                                            "hover:bg-zinc-700": props.value !== element.id
                                        })}
                                        key={element.id}
                                        onClick={() => props.setValue(element.id)}>
                                        <p className="font-semibold line-clamp-1 text-xs md:text-sm">
                                            <Translate content={element.title} schema={true} />
                                        </p>
                                    </button>
                                ))}

                                <div className="absolute inset-0 -z-10 brightness-30">
                                    <img src="/images/shine.avif" alt="Shine" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="transition-height duration-100 ease-in-out h-full">
                        <div className="pt-4 gap-4 flex items flex-col h-full">{props.children}</div>
                    </div>
                </div>
            </div>
        </RenderGuard>
    );
}
