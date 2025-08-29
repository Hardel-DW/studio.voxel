import type { ReactNode } from "react";
import { createTabsContext } from "@/components/ui/TabsContext";
import { cn } from "@/lib/utils";

const { Provider: TabsProvider, useTabs } = createTabsContext();

export function MenuTabs(props: { children: ReactNode; defaultValue: string; className?: string }) {
    return (
        <TabsProvider defaultValue={props.defaultValue}>
            <div className={cn("flex flex-col", props.className)}>{props.children}</div>
        </TabsProvider>
    );
}

export function MenuTabsList(props: { children: ReactNode; className?: string }) {
    return <div className={cn("flex justify-start gap-x-5", props.className)}>{props.children}</div>;
}

export function MenuTabsTrigger(props: { children: ReactNode; value: string; disabled?: boolean; className?: string }) {
    const { activeTab, setActiveTab } = useTabs();

    return (
        <button
            type="button"
            disabled={props.disabled}
            onClick={() => setActiveTab(props.value)}
            className={cn(
                "text-zinc-500 whitespace-nowrap rounded-xl px-3 py-1.5",
                "font-medium transition-all cursor-pointer",
                "disabled:pointer-events-none hover:text-white",
                "text-md py-2 px-4 rounded-xl bg-transparent border-0",
                "transition-colors duration-150 ease-bounce",
                "data-[state=active]:bg-rose-900 data-[state=active]:text-white",
                props.className
            )}
            data-state={activeTab === props.value ? "active" : "inactive"}>
            {props.children}
        </button>
    );
}

export function MenuTabsContent(props: { children: ReactNode; value: string; className?: string; style?: React.CSSProperties }) {
    const { activeTab } = useTabs();
    const isActive = activeTab === props.value;

    if (!isActive) return null;

    return (
        <div
            className={cn(
                "starting:translate-y-2 starting:scale-95",
                "duration-150 ease-bounce",
                "transition-[transform,opacity]",
                "hidden:translate-y-2 hidden:scale-95",
                props.className
            )}
            data-state={isActive ? "active" : "inactive"}
            style={props.style}>
            {props.children}
        </div>
    );
}
