import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { DatapackDownloader } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { GitFileTree } from "@/components/ui/tree/GitFileTree";

export const Route = createFileRoute("/$lang/studio/editor/github")({
    component: GithubLayout
});

function GithubLayout() {
    const search = useRouterState({ select: (s) => s.location.search as { file?: string } });
    const selectedFile = search.file;
    const { isGitRepository } = useExportStore();
    const files = useConfiguratorStore.getState().files;
    const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
    const diff = isGitRepository ? new DatapackDownloader(compiledFiles).getDiff(files) : new Map();

    return (
        <div className="flex size-full overflow-hidden relative isolate">
            <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/75 flex flex-col">
                <div className="px-6 pt-6">
                    <div className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-1">
                        <img src="/icons/company/github.svg" className="size-5 invert opacity-80" alt="" />
                        <span>Source Control</span>
                    </div>
                    <p className="text-xs text-zinc-500 pl-7">{diff.size} changes</p>
                </div>

                <div className="flex-1 overflow-y-auto px-3 mt-4">
                    <GitFileTree diff={diff} selectedFile={selectedFile} />
                </div>

                <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/90">
                    <a
                        href="https://discord.gg/8z3tkQhay7"
                        className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50 flex items-center gap-3 group hover:border-zinc-700/50 transition-colors">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Need help?</div>
                        </div>
                        <div className="size-8 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                            <img src="/icons/company/discord.svg" className="size-4 invert opacity-30 group-hover:opacity-50 transition-opacity" alt="" />
                        </div>
                    </a>
                </div>
            </aside>

            <main className="flex-1 min-w-0 flex flex-col bg-zinc-950">
                <Outlet />
            </main>
        </div>
    );
}
