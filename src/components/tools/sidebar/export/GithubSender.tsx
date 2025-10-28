import { useMutation } from "@tanstack/react-query";
import type { FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import { TOAST, toast } from "@/components/ui/Toast";
import Translate from "@/components/ui/Translate";
import { GitHub } from "@/lib/github/GitHub";
import { useClientDictionary } from "@/lib/hook/useClientDictionary";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { cn } from "@/lib/utils";
import { encodeToBase64 } from "@/lib/utils/encode";

type GitHubActionPayload = {
    type: "push" | "pr";
    changes: Map<string, FileStatus>;
    files: Record<string, string | null>;
};

export default function GithubSender() {
    const [pendingAction, setPendingAction] = useState<GitHubActionPayload | null>(null);
    const { owner, repositoryName, branch, token, isGitRepository } = useExportStore();
    const t = useClientDictionary("github");
    const { isAuthenticated } = useGitHubAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: () => new GitHub({ token }).send(owner, repositoryName, branch, pendingAction?.type, pendingAction?.files),
        onSuccess: (data) => {
            const message = pendingAction?.type === "pr" ? t["pr.success"] : t["push.success"];
            const detail = pendingAction?.type === "pr" ? data.prUrl : t["files.modified"].replace("%s", String(data.filesModified));
            toast(message, TOAST.SUCCESS, detail);
            setPendingAction(null);
        },
        onError: (error: Error) => {
            const message = pendingAction?.type === "pr" ? t["pr.error"] : t["push.error"];
            toast(message, TOAST.ERROR, error.message);
        }
    });

    const handleGitAction = (type: GitHubActionPayload["type"]) => {
        const configuratorStore = useConfiguratorStore.getState();
        const compiledFiles = configuratorStore.compile().getFiles();
        const changes = new DatapackDownloader(compiledFiles).getDiff(configuratorStore.files);
        if (changes.size === 0) {
            toast(t["no.changes"], TOAST.ERROR);
            return false;
        }

        const files = Object.fromEntries(
            Array.from(changes).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiledFiles[path])])
        );

        setPendingAction({ type, changes, files });
        return true;
    };

    if (!isGitRepository) return null;

    return (
        <Dialog id="confirm-github-modal" className="flex flex-col gap-1">
            <DialogTrigger disabled={!isAuthenticated} onBeforeOpen={() => handleGitAction("pr")}>
                <Button type="button" variant="aurora" disabled={!isAuthenticated}>
                    <Translate content="export.pull" />
                    <img src="/icons/company/pull.svg" alt="pull" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogTrigger disabled={!isAuthenticated} onBeforeOpen={() => handleGitAction("push")}>
                <Button type="button" variant="aurora" disabled={!isAuthenticated}>
                    <Translate content="export.push" />
                    <img src="/icons/company/github.svg" alt="push" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                        <span className="text-xl font-medium text-zinc-200">
                            <Translate content={pendingAction?.type === "pr" ? "github:dialog.pr.title" : "github:dialog.push.title"} />
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        <Translate
                            content={pendingAction?.type === "pr" ? "github:dialog.pr.description" : "github:dialog.push.description"}
                        />
                    </DialogDescription>
                </DialogHeader>

                {pendingAction && (
                    <div className="mt-4">
                        <div className="text-sm text-zinc-300 mb-3">
                            <Translate content="github:files.count" /> {pendingAction.changes.size}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950">
                            {Array.from(pendingAction.changes).map(([path, status]) => (
                                <div
                                    key={path}
                                    className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-900/50 transition">
                                    <span
                                        className={cn(
                                            "text-xs font-mono px-2 py-1 rounded",
                                            status === "added" && "bg-green-900/30 text-green-400",
                                            status === "updated" && "bg-yellow-900/30 text-yellow-400",
                                            status === "deleted" && "bg-red-900/30 text-red-400"
                                        )}>
                                        {status === "added" ? "+" : status === "updated" ? "~" : "-"}
                                    </span>
                                    <span className="text-sm text-zinc-300 font-mono truncate flex-1">{path}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter className="pt-6 flex items-center justify-end gap-3">
                    <DialogCloseButton variant="ghost" disabled={isPending}>
                        <Translate content="github:dialog.cancel" />
                    </DialogCloseButton>
                    <DialogCloseButton type="button" onClick={() => pendingAction && mutate()} variant="default" disabled={isPending}>
                        {isPending ? (
                            <Translate content="github:dialog.processing" />
                        ) : (
                            <Translate content={pendingAction?.type === "pr" ? "github:dialog.pr.confirm" : "github:dialog.push.confirm"} />
                        )}
                    </DialogCloseButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
