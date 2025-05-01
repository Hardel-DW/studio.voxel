"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";

interface Tab {
    label: React.ReactNode | string;
    value: string;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tab: string) => void;
    disabled?: boolean;
    className?: string;
}

export default function Tabs({ tabs, defaultTab, onChange, className, disabled }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const updateIndicator = useCallback((button: HTMLButtonElement) => {
        if (indicatorRef.current && containerRef.current) {
            const rect = button.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            indicatorRef.current.style.width = `${rect.width}px`;
            indicatorRef.current.style.transform = `translateX(${rect.left - containerRect.left}px)`;
        }
    }, []);

    const handleTabChange = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
        const button = event.currentTarget;

        if (disabled) return;

        setActiveTab(value);
        onChange?.(value);
        updateIndicator(button);
    };

    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);

    useEffect(() => {
        if (!containerRef.current) return;

        const button = buttonRefs.current[activeTab];
        if (!button) return;
        updateIndicator(button);

        const observer = new ResizeObserver(() => updateIndicator(button));
        observer.observe(button);

        return () => observer.disconnect();
    }, [activeTab, updateIndicator]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "h-fit relative w-fit justify-center text-sm rounded-2xl border border-zinc-800 p-1 text-zinc-400 flex bg-transparent overflow-hidden disabled:opacity-50",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}>
            <div className="absolute inset-0 -z-10 hue-rotate-45 brightness-20">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
            {tabs.map((tab) => {
                const isActive = tab.value === activeTab;
                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={(e) => handleTabChange(e, tab.value)}
                        ref={(node) => {
                            buttonRefs.current[tab.value] = node;
                            if (isActive && node) requestAnimationFrame(() => updateIndicator(node));
                        }}
                        className={cn(
                            "text-zinc-500 flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition-all cursor-pointer disabled:pointer-events-none hover:text-white",
                            disabled && "cursor-not-allowed",
                            isActive ? "text-white" : "text-muted-foreground hover:text-foreground/80"
                        )}>
                        {tab.label}
                    </button>
                );
            })}
            <div
                ref={indicatorRef}
                className="absolute left-0 top-1 rounded-xl bg-white/10 z-0 transition-all duration-300 ease-out"
                style={{
                    height: "calc(100% - 8px)"
                }}
            />
        </div>
    );
}
