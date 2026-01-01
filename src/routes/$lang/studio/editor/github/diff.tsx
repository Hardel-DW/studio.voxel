import { createFileRoute } from "@tanstack/react-router";
import { useConfiguratorStore } from "@/components/tools/Store";
import { Button } from "@/components/ui/Button";

export const Route = createFileRoute("/$lang/studio/editor/github/diff")({
    component: GithubDiffPage,
    validateSearch: (search) => ({ file: search.file as string }),
});

function GithubDiffPage() {
    const { file } = Route.useSearch();
    const files = useConfiguratorStore.getState().compile().getFiles();
    const rawContent = files[file];
    const content = rawContent ? new TextDecoder("utf-8").decode(rawContent) : "";

    if (!file) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/search.svg" className="size-12 opacity-20 invert" alt="" />
                <p>Select a file to view changes</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="h-12 border-b border-zinc-800/50 flex items-center px-4 justify-between bg-zinc-900/30">
                <div className="flex items-center gap-2">
                    <img src="/icons/tools/crafting/code.svg" className="size-4 invert opacity-50" alt="" />
                    <span className="font-mono text-sm text-zinc-300">{file}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" className="text-zinc-500 hover:text-zinc-300">
                        Unified
                    </Button>
                    <Button variant="ghost" size="xs" className="text-zinc-500 hover:text-zinc-300">
                        Split
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0d1117]">
                <pre className="p-4 font-mono text-sm leading-6 text-zinc-300">
                    <code>{content}</code>
                </pre>
            </div>
        </div>
    );
}
