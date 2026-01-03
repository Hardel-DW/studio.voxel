import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import CodeDiff from "@/components/ui/codeblock/CodeDiff";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/studio/editor/github/diff")({
    component: GithubDiffPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function parseFilePath(path: string): Identifier | null {
    const parts = path.split("/");
    if (parts.length < 4 || !path.endsWith(".json")) return null;

    const [, namespace, ...rest] = parts;
    const resourceWithExt = rest.pop();
    if (!resourceWithExt || !namespace) return null;

    const resource = resourceWithExt.replace(/\.json$/, "");
    const registry = rest.join("/");
    if (!registry || !resource) return null;

    return new Identifier({ namespace, registry, resource });
}

function GithubDiffPage() {
    const { file } = Route.useSearch();
    const { files } = useConfiguratorStore.getState();
    const compiledFiles = useConfiguratorStore.getState().compile().getFiles();

    if (!file) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/search.svg" className="size-12 opacity-20 invert" alt="Icon of a search" />
                <p className="text-sm">{t("github:diff.title")}</p>
            </div>
        );
    }

    if (!file.endsWith(".json")) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/tools/crafting/code.svg" className="size-12 opacity-20 invert" alt="Icon of a code file" />
                <p className="text-sm">{t("github:diff.preview.title")}</p>
                <p className="text-xs text-zinc-600">{file}</p>
            </div>
        );
    }

    const identifier = parseFilePath(file);
    const originalData = files[file];
    const compiledData = compiledFiles[file];
    const original = originalData ? JSON.stringify(JSON.parse(new TextDecoder().decode(originalData)), null, 4) : "";
    const compiled = compiledData ? JSON.stringify(JSON.parse(new TextDecoder().decode(compiledData)), null, 4) : "";

    return (
        <div className="flex flex-col h-full">
            <div className="h-12 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-900/30 shrink-0">
                <div className="flex items-center gap-3">
                    <img src="/icons/tools/crafting/code.svg" className="size-4 invert opacity-50" alt="Icon of a code file" />
                    <span className="font-mono text-sm text-zinc-300">{identifier?.toFileName(true) ?? file.split("/").pop()}</span>
                </div>
                <span className="text-xs text-zinc-600 font-mono">{file}</span>
            </div>

            <div className="flex-1 overflow-hidden">
                <CodeDiff original={original} modified={compiled} />
            </div>
        </div>
    );
}
