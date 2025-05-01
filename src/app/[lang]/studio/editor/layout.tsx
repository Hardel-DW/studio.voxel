import type React from "react";

export default function Layout({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
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
                    {sidebar}
                </div>
            </div>

            {/* Content */}
            <div
                id="content-container"
                className="overflow-x-hidden stack flex bg-content md:border md:border-zinc-900 md:rounded-2xl w-full relative z-20">
                {children}
            </div>
        </>
    );
}
