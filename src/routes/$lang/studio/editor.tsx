import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import EditorLoading from "@/components/pages/studio/EditorLoading";
import ConfigManager from "@/components/tools/ConfigManager";
import ConfiguratorPanel from "@/components/tools/ConfiguratorPanel";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import PageTitle from "@/components/tools/PageTitle";
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
    const [toggleSidebar, setToggleSidebar] = useState(true);

    return (
        <>
            {/* Sidebar */}
            <div
                id="collapse-menu"
                className={cn(
                    "@container shrink-0 overflow-hidden transition-all duration-500 ease-in-out w-0 max-md:absolute max-md:inset-0 max-md:bg-linear-to-br max-md:from-guides-gradient-from max-md:to-guides-gradient-to max-md:z-50 max-md:py-4 max-md:rounded-r-2xl max-md:border max-md:border-zinc-700",
                    toggleSidebar ? "w-62.5 xl:w-80" : "w-0"
                )}>
                <div className="w-62.5 xl:w-80 flex flex-col h-full relative z-100 px-4 md:pl-0 @sm:pl-0">
                    <div className="flex w-full items-center justify-between">
                        <a
                            href="/"
                            className="text-lg flex items-center transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden focus-visible:shadow-outline-indigo rounded-full px-2 -ml-2">
                            <img src="/icons/logo.svg" alt="Voxel" className="w-6 h-6 brightness-90 mx-2" />
                            <span className="font-bold text-primary">VOXEL</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setToggleSidebar(!toggleSidebar)}
                            className="w-6 h-6 cursor-pointer block md:hidden">
                            <img src="/icons/menu.svg" alt="menu" className="invert-75" />
                        </button>
                    </div>
                    <StudioSidebar />
                </div>
            </div>

            {/* Content */}
            <div
                id="content-container"
                className="overflow-x-hidden stack flex bg-content md:border md:border-zinc-900 md:rounded-2xl w-full relative z-20">
                <main className="contents">
                    <div className="size-full pt-4 pb-8">
                        <div className="flex absolute inset-0 p-4 justify-between items-center select-none h-fit gap-x-4">
                            <button type="button" onClick={() => setToggleSidebar(!toggleSidebar)} className="w-6 h-6 cursor-pointer">
                                <img src="/icons/menu.svg" alt="Menu" className="invert-75" />
                            </button>
                            <PageTitle />
                            <div className="flex items-center gap-x-6">
                                <ToolInternalization />
                                <a href="/" className="select-none size-fit">
                                    <img src="/icons/logo.svg" alt="Voxel" className="w-6 h-6 opacity-75" />
                                </a>
                            </div>
                        </div>
                        <div id="content" className="px-8 lg:px-0 pt-12 h-full transition w-full md:w-[95%] mx-auto justify-self-center">
                            <div className="flex flex-col h-full">
                                <div className="absolute w-full -z-10 inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
                                <HydrationBoundary state={dehydrate(queryClient)}>
                                    <ConfigManager>
                                        <ConfiguratorPanel />
                                        <div className="contents">
                                            <Outlet />
                                        </div>

                                        <ItemTooltip />
                                    </ConfigManager>
                                </HydrationBoundary>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
