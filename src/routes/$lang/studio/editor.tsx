import { createFileRoute } from '@tanstack/react-router'
import ToolInternalization from '@/components/tools/ToolInternalization'
import { HydrationBoundary } from '@tanstack/react-query'
import { dehydrate } from '@tanstack/react-query'
import ConfiguratorPanel from '@/components/tools/ConfiguratorPanel'
import ConfigManager from '@/components/tools/ConfigManager'
import StudioSidebar from '@/components/tools/sidebar/Sidebar'
import EditorLoading from '@/components/loading/EditorLoading'
import { getQueryClient } from '@/lib/utils/query'

export const Route = createFileRoute('/$lang/studio/editor')({
    component: EditorPage,
    pendingComponent: EditorLoading,
})

function EditorPage() {
    const queryClient = getQueryClient();

    return (
        <>
            <input type="checkbox" id="sidebar-toggle" className="peer hidden" defaultChecked />

            {/* Sidebar */}
            <div
                id="collapse-menu"
                className="@container shrink-0 overflow-hidden transition-all duration-500 ease-in-out peer-checked:w-62.5 xl:peer-checked:w-80 w-0 max-md:absolute max-md:inset-0 max-md:bg-linear-to-br max-md:from-guides-gradient-from max-md:to-guides-gradient-to max-md:z-50 max-md:py-4 max-md:rounded-r-2xl max-md:border max-md:border-zinc-700">
                <div className="w-62.5 xl:w-80 flex flex-col h-full relative z-100 px-4 md:pl-0 @sm:pl-0">
                    <div className="flex w-full items-center justify-between">
                        <a
                            href="/"
                            className="text-lg flex items-center transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden focus-visible:shadow-outline-indigo rounded-full px-2 -ml-2">
                            <img src="/icons/logo.svg" alt="Voxel" className="w-6 h-6 brightness-90 mx-2" />
                            <span className="font-bold text-primary">VOXEL</span>
                        </a>
                        <label htmlFor="sidebar-toggle" className="w-6 h-6 cursor-pointer block md:hidden">
                            <img src="/icons/menu.svg" alt="menu" className="invert-[75%]" />
                        </label>
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
                            <label htmlFor="sidebar-toggle" className="w-6 h-6 cursor-pointer">
                                <img src="/icons/menu.svg" alt="Menu" className="invert opacity-75" />
                            </label>
                            <h1 className="text-sm text-zinc-400 truncate">Voxel Studio</h1>
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
                                    </ConfigManager>
                                </HydrationBoundary>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}