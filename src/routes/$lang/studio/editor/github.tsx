import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { DatapackDownloader } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { TOAST, toast } from "@/components/ui/Toast";
import { GitFileTree } from "@/components/ui/tree/GitFileTree";
import { GitHub } from "@/lib/github/GitHub";
import { t, useI18n } from "@/lib/i18n";
import { encodeToBase64 } from "@/lib/utils/encode";

export const Route = createFileRoute("/$lang/studio/editor/github")({
    component: GithubLayout
});

function GithubLayout() {
    useI18n((state) => state.locale);
    const search = useRouterState({ select: (s) => s.location.search as { file?: string } });
    const selectedFile = search.file;
    const { isGitRepository, owner, repositoryName, branch, token } = useExportStore();
    const files = useConfiguratorStore.getState().files;
    const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
    const diff = isGitRepository ? new DatapackDownloader(compiledFiles).getDiff(files) : new Map();
    const [message, setMessage] = useState("");

    const pushMutation = useMutation({
        mutationFn: () => {
            const compiled = useConfiguratorStore.getState().compile().getFiles();
            const filesToPush = Object.fromEntries(
                Array.from(diff).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiled[path])])
            );
            return new GitHub({ token }).send(owner, repositoryName, branch, "push", filesToPush);
        },
        onSuccess: () => {
            toast(t("github:push.success"), TOAST.SUCCESS);
            setMessage("");
        },
        onError: (error: Error) => {
            toast(t("github:push.error"), TOAST.ERROR, error.message);
        }
    });

    return (
        <div className="flex size-full overflow-hidden relative isolate">
            <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/75 flex flex-col">
                <div className="px-6 pt-6">
                    <div className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-1">
                        <img src="/icons/company/github.svg" className="size-5 invert opacity-80" alt="Icon of a GitHub repository" />
                        <span>{t("github:layout.title")}</span>
                    </div>
                    {isGitRepository && (
                        <p className="text-xs text-zinc-500 pl-7 flex items-center gap-1.5">
                            <span className="text-zinc-400 font-sm font-mono">
                                {owner}/{repositoryName}
                            </span>
                            <span className="opacity-30">•</span>
                            <span>{branch}</span>
                        </p>
                    )}
                </div>

                {isGitRepository && (
                    <div className="px-3 mt-4 space-y-2">
                        <TextInput
                            className="rounded-lg"
                            disableIcon
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t("github:layout.commit.placeholder")}
                        />
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() => pushMutation.mutate()}
                            disabled={pushMutation.isPending || diff.size === 0 || !message.trim()}>
                            {pushMutation.isPending ? t("github:layout.commit.button.pushing") : t("github:layout.commit.button.push")}
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-3 mt-4">
                    {isGitRepository ? (
                        <GitFileTree diff={diff} selectedFile={selectedFile} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
                            <img src="/icons/company/github.svg" className="size-8 opacity-20 invert" alt="Icon of a GitHub repository" />
                            <span className="text-xs text-center">{t("github:layout.empty.init")}</span>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/90">
                    <a
                        href="https://discord.gg/8z3tkQhay7"
                        className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50 flex items-center gap-3 group hover:border-zinc-700/50 transition-colors">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                {t("common.help.discord")}
                            </div>
                        </div>
                        <div className="size-8 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                            <img
                                src="/icons/company/discord.svg"
                                className="size-4 invert opacity-30 group-hover:opacity-50 transition-opacity"
                                alt="Icon of a Discord server"
                            />
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
