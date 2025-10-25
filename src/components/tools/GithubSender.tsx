import { useMutation } from "@tanstack/react-query";
import type { FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import Translate from "@/components/tools/Translate";
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
import { GitHub } from "@/lib/github/GitHub";
import { cn, encodeToBase64 } from "@/lib/utils";

type GitHubActionPayload = {
    type: "push" | "pr";
    changes: Map<string, FileStatus>;
    files: Record<string, string | null>;
};

export default function GithubSender() {
    const [pendingAction, setPendingAction] = useState<GitHubActionPayload | null>(null);
    const { owner, repositoryName, branch, token, isGitRepository } = useExportStore();

    const { mutate, isPending } = useMutation({
        mutationFn: () => new GitHub({ authHeader: token }).send(owner, repositoryName, branch, pendingAction?.type, pendingAction?.files),
        onSuccess: (data) => {
            const message = pendingAction?.type === "pr" ? "Pull request created" : "Changes pushed";
            const detail = pendingAction?.type === "pr" ? data.prUrl : `${data.filesModified} files modified`;
            toast(message, TOAST.SUCCESS, detail);
            setPendingAction(null);
        },
        onError: (error: Error) => toast(`Failed to ${pendingAction?.type === "pr" ? "create PR" : "push"}`, TOAST.ERROR, error.message)
    });

    const handleGitAction = (type: GitHubActionPayload["type"]) => {
        const configuratorStore = useConfiguratorStore.getState();
        const compiledFiles = configuratorStore.compile().getFiles();
        const changes = new DatapackDownloader(compiledFiles).getDiff(configuratorStore.files);
        if (changes.size === 0) return toast("No changes detected", TOAST.INFO);

        const files = Object.fromEntries(
            Array.from(changes).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiledFiles[path])])
        );
        setPendingAction({ type, changes, files });
    };

    if (!isGitRepository) return null;

    return (
        <Dialog id="confirm-github-modal">
            <DialogTrigger>
                <Button type="button" variant="aurora" onClick={() => handleGitAction("pr")}>
                    <Translate content="export.pull" />
                    <img src="/icons/company/pull.svg" alt="pull" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogTrigger>
                <Button type="button" variant="aurora" onClick={() => handleGitAction("push")}>
                    <Translate content="export.push" />
                    <img src="/icons/company/github.svg" alt="push" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                        {pendingAction?.type === "pr" ? "Create Pull Request" : "Push Changes"}
                    </DialogTitle>
                    <DialogDescription>
                        Review the changes before {pendingAction?.type === "pr" ? "creating a pull request" : "pushing to the repository"}
                    </DialogDescription>
                </DialogHeader>

                {pendingAction && (
                    <div className="mt-4">
                        <div className="text-sm text-zinc-300 mb-3">{pendingAction.changes.size} file(s) will be modified</div>
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
                    <DialogCloseButton variant="ghost" disabled={isPending}>Cancel</DialogCloseButton>
                    <Button type="button" onClick={() => pendingAction && mutate()} variant="default" disabled={isPending}>
                        {isPending ? "Processing..." : `Confirm ${pendingAction?.type === "pr" ? "Pull Request" : "Push"}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
