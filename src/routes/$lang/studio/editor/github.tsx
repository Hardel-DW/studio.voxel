import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import type { FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { createContext, use } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { cn } from "@/lib/utils";

const GithubContext = createContext<GithubContextType | null>(null);
type GithubContextType = {
    diff: Map<string, FileStatus>;
};

export function useGithubContext() {
    const context = use(GithubContext);
    if (!context) {
        throw new Error("useGithubContext must be used within GithubLayout");
    }
    return context;
}

export const Route = createFileRoute("/$lang/studio/editor/github")({
    component: GithubLayout
});

function GithubLayout() {
    const { lang } = useParams({ from: "/$lang" });
    const { isGitRepository } = useExportStore();
    const files = useConfiguratorStore.getState().files;
    const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
    const diff = new DatapackDownloader(compiledFiles).getDiff(files);

    if (!isGitRepository) {
        return (
            <div className="flex-1 flex flex-col h-full bg-zinc-950 text-zinc-200">
                <Outlet />
            </div>
        );
    }

    return (
        <GithubContext.Provider value={{ diff }}>
            <div className="flex h-full w-full bg-zinc-950 text-zinc-200">
                <aside className="w-64 shrink-0 flex flex-col border-r border-zinc-800/50 bg-zinc-900/30">
                    <div className="h-12 flex items-center px-4 border-b border-zinc-800/50">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Source Control</span>
                        <span className="ml-auto text-xs text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded-full border border-zinc-800">
                            {diff.size}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                        {Array.from(diff).map(([path, status]) => (
                            <Link
                                key={path}
                                to="/$lang/studio/editor/github/diff"
                                params={{ lang }}
                                search={{ file: path }}
                                activeProps={{ className: "bg-blue-500/10 text-blue-200 border-blue-500/20" }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800/50 border border-transparent transition-all group">
                                <span className={cn(
                                    "text-[10px] font-bold w-3 text-center",
                                    status === "added" && "text-green-500",
                                    status === "updated" && "text-yellow-500",
                                    status === "deleted" && "text-red-500"
                                )}>
                                    {status === "added" ? "A" : status === "updated" ? "M" : status === "deleted" ? "D" : null}
                                </span>
                                <span className="truncate text-zinc-400 group-hover:text-zinc-200 transition-colors font-mono text-[11px] flex-1">
                                    {path}
                                </span>
                            </Link>
                        ))}
                        {diff.size === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
                                <img src="/icons/check.svg" className="size-6 opacity-20 invert" alt="" />
                                <span className="text-xs">No changes detected</span>
                            </div>
                        )}
                    </div>
                </aside>

                <div className="flex-1 min-w-0 flex flex-col bg-zinc-950">
                    <GithubContext.Provider value={{ diff }}>
                        <Outlet />
                    </GithubContext.Provider>
                </div>
            </div>
        </GithubContext.Provider>

    );
}