import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import EditorLoading from "@/components/pages/studio/EditorLoading";
import ConfigManager from "@/components/tools/ConfigManager";
import ConfiguratorPanel from "@/components/tools/ConfiguratorPanel";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import StudioSidebar from "@/components/tools/sidebar/Sidebar";
import ToolInternalization from "@/components/tools/ToolInternalization";
import { cn } from "@/lib/utils";
import { getQueryClient } from "@/lib/utils/query";

export const Route = createFileRoute("/$lang/studio/editor")({
    component: EditorLayout,
    pendingComponent: EditorLoading,
    notFoundComponent: NotFoundStudio
});

function EditorLayout() {
    const queryClient = getQueryClient();
    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={cn(
            "flex h-dvh w-full p-4 overflow-hidden relative transition-all duration-300 ease-in-out box-border",
            isPinned ? "gap-4" : "gap-0"
        )} data-pinned={isPinned}>
            {!isPinned && (
                <button type="button" tabIndex={0} onMouseEnter={() => setIsHovered(true)} onFocus={() => setIsHovered(true)} className="fixed inset-y-0 left-0 w-4 z-50 outline-none cursor-default" aria-label="Show sidebar" />
            )}

            <div
                className={cn(
                    "shrink-0 transition-[width] duration-300 ease-in-out z-40",
                    isPinned ? "w-80" : "w-0"
                )}>
                <aside
                    onMouseEnter={() => !isPinned && setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                        "flex flex-col w-80 transition-all duration-300 ease-in-out overflow-hidden rounded-2xl border-0 border-zinc-800",
                        isPinned && "h-full relative translate-x-0 border-none",
                        !isPinned && "fixed left-4 top-4 bottom-4 shadow-2xl z-50 bg-zinc-950 border",
                        !isPinned && isHovered && "translate-x-0",
                        !isPinned && !isHovered && "-translate-x-[120%]"
                    )}>
                    <div className="flex items-center justify-between px-6 pt-5 shrink-0">
                        <a href="/" className="flex items-center gap-2 text-lg transition-colors hover:opacity-80">
                            <img src="/icons/logo.svg" alt="Voxel" className="size-6 brightness-90" />
                            <span className="font-bold text-primary">VOXEL</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setIsPinned(!isPinned)}
                            className="size-8 flex items-center justify-center rounded-md hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-100">
                            <img src="/icons/menu.svg" alt="Collapse" className="size-5 invert-75" />
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 px-2">
                        <StudioSidebar />
                    </div>
                </aside>
            </div>

            <main className="flex-1 relative flex flex-col min-w-0 bg-content overflow-hidden rounded-2xl border border-zinc-900">
                <div className="absolute top-6 right-8 z-50 flex items-center gap-6 pointer-events-auto">
                    <ToolInternalization />
                    <a href="/" className="select-none size-fit opacity-50 hover:opacity-100 transition-opacity">
                        <img src="/icons/logo.svg" alt="Voxel" className="size-6" />
                    </a>
                </div>

                <div className="size-full relative">
                    <div className="absolute w-full -z-10 inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <ConfigManager>
                            <ConfiguratorPanel />
                            <div className="size-full">
                                <Outlet />
                            </div>
                            <ItemTooltip />
                        </ConfigManager>
                    </HydrationBoundary>
                </div>
            </main>
        </div>
    );
}
