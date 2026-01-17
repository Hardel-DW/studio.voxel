import { useRef, useState } from "react";
import LevelUploader from "@/components/pages/level/LevelUploader";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TIMELINE_STEPS = [
    { id: "stop", icon: "server" },
    { id: "remove", icon: "folder" },
    { id: "reset", icon: "trash" },
    { id: "upload", icon: "upload", hasUploader: true },
    { id: "replace", icon: "sync" },
    { id: "start", icon: "checkmark" }
] as const;

export default function StepsTimeline() {
    const t = useTranslate();
    const [activeIndex, setActiveIndex] = useState(-1);
    const observersRef = useRef<Map<number, IntersectionObserver>>(new Map());

    const registerStep = (index: number, el: HTMLDivElement | null) => {
        if (!el) return;
        if (observersRef.current.has(index)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActiveIndex((prev) => Math.max(prev, index));
                } else if (entry.boundingClientRect.top > 0) {
                    setActiveIndex((prev) => (prev === index ? index - 1 : prev));
                }
            },
            { threshold: 0.4, rootMargin: "-30% 0px -30% 0px" }
        );

        observer.observe(el);
        observersRef.current.set(index, observer);
    };

    const progress = ((activeIndex + 1) / TIMELINE_STEPS.length) * 100;

    return (
        <div className="relative w-full max-w-4xl mx-auto py-24">
            <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-zinc-800" />
            <div
                className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 w-px bg-linear-to-b from-emerald-500 to-emerald-400 transition-[height] duration-700 ease-out"
                style={{ height: `${progress}%` }}
            />

            <div className="relative space-y-24">
                {TIMELINE_STEPS.map((step, index) => {
                    const isLeft = index % 2 === 0;
                    const isActive = index <= activeIndex;

                    return (
                        <div
                            key={step.id}
                            ref={(el) => registerStep(index, el)}
                            className={cn("relative flex items-start gap-8", isLeft ? "md:flex-row" : "md:flex-row-reverse", "flex-row")}>
                            <div className={cn("hidden md:block flex-1", isLeft ? "text-right pr-12" : "text-left pl-12")}>
                                <div
                                    className={cn(
                                        "inline-block p-6 rounded-2xl border transition-all duration-500",
                                        isActive
                                            ? "bg-zinc-900/60 border-white/10 shadow-lg shadow-black/20"
                                            : "bg-zinc-900/30 border-white/5"
                                    )}>
                                    <span
                                        className={cn(
                                            "text-xs font-bold uppercase tracking-wider transition-colors duration-500",
                                            isActive ? "text-emerald-400" : "text-zinc-600"
                                        )}>
                                        {t("level.timeline.step")} {index + 1}
                                    </span>
                                    <h3
                                        className={cn(
                                            "text-lg font-semibold mb-2 mt-2 transition-colors duration-500",
                                            isActive ? "text-white" : "text-zinc-400"
                                        )}>
                                        {t(`level.timeline.${step.id}.title`)}
                                    </h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                                        {t(`level.timeline.${step.id}.description`)}
                                    </p>
                                    {"hasUploader" in step && step.hasUploader && (
                                        <div className="mt-4">
                                            <LevelUploader variant="compact" className="max-w-xs" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                                <div
                                    className={cn(
                                        "size-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10",
                                        isActive
                                            ? "bg-emerald-950 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                            : "bg-zinc-950 border-zinc-700"
                                    )}>
                                    <img
                                        src={`/icons/${step.icon}.svg`}
                                        alt={step.id}
                                        className={cn("size-5 transition-opacity duration-500", isActive ? "opacity-100" : "opacity-40")}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 md:hidden pl-16">
                                <div
                                    className={cn(
                                        "p-5 rounded-2xl border transition-all duration-500",
                                        isActive ? "bg-zinc-900/60 border-white/10" : "bg-zinc-900/30 border-white/5"
                                    )}>
                                    <span
                                        className={cn(
                                            "text-xs font-bold uppercase tracking-wider transition-colors duration-500",
                                            isActive ? "text-emerald-400" : "text-zinc-600"
                                        )}>
                                        {t("level.timeline.step")} {index + 1}
                                    </span>
                                    <h3
                                        className={cn(
                                            "text-lg font-semibold mb-2 mt-2 transition-colors duration-500",
                                            isActive ? "text-white" : "text-zinc-400"
                                        )}>
                                        {t(`level.timeline.${step.id}.title`)}
                                    </h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">{t(`level.timeline.${step.id}.description`)}</p>
                                    {"hasUploader" in step && step.hasUploader && (
                                        <div className="mt-4">
                                            <LevelUploader variant="compact" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hidden md:block flex-1" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
