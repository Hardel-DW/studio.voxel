import { useMutation } from "@tanstack/react-query";
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
import { TextInput } from "@/components/ui/TextInput";
import { TOAST, toast } from "@/components/ui/Toast";
import Translate from "@/components/ui/Translate";
import { GitHub } from "@/lib/github/GitHub";
import { useClientDictionary } from "@/lib/hook/useClientDictionary";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { encodeToBase64 } from "@/lib/utils/encode";
import { sanitizeRepoName } from "@/lib/utils/text";
import { GithubRepoValidationError } from "@/lib/github/GitHubError";

const DESCRIPTION = "Minecraft datapack created with Voxel Studio";

export default function InitializeRepoButton() {
    const [repoName, setRepoName] = useState("");
    const { token } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const t = useClientDictionary("github");
    const { isAuthenticated } = useGitHubAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
            const files = Object.fromEntries(Object.entries(compiledFiles).map(([path, content]) => [path, encodeToBase64(content)]));
            useExportStore.getState().setInitializing(Object.keys(files).length);
            toast(t["init.progress"], TOAST.INFO, t["init.progress.count"].replace("%s", Object.keys(files).length.toString()));
            return new GitHub({ token }).initializeRepository(repoName, DESCRIPTION, false, true, files);
        },
        onSuccess: (data) => {
            toast(t["init.success"], TOAST.SUCCESS, data.htmlUrl);
            const [owner, repositoryName] = data.fullName.split("/");
            useExportStore.setState({ owner, repositoryName, branch: data.defaultBranch, isGitRepository: true });
            setRepoName("");
        },
        onError: (error: Error) => {
            if (error instanceof GithubRepoValidationError) {
                return toast(t["init.error.validation"], TOAST.ERROR, t["init.error.validation.desc"]);
            }
            toast(t["init.error"], TOAST.ERROR, error.message);
        },
        onSettled: () => useExportStore.getState().setInitializing(null)
    });

    const handleSubmit = () => {
        const trimmedName = repoName.trim();
        if (!trimmedName) {
            return toast(t["init.error.empty"], TOAST.ERROR);
        }

        const isValid = /^[a-zA-Z0-9_-]+$/.test(trimmedName);
        if (!isValid) {
            return toast(t["init.error.invalid"], TOAST.ERROR);
        }

        mutate();
    };

    return (
        <Dialog id="init-repo-modal" onOpenChange={(open) => open && setRepoName(name.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}>
            <DialogTrigger disabled={!isAuthenticated}>
                <Button type="button" variant="aurora" disabled={!isAuthenticated}>
                    <Translate content="github:init.button" />
                    <img src="/icons/company/github.svg" alt="init" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                        <Translate content="github:init.title" />
                    </DialogTitle>
                    <DialogDescription>
                        <Translate content="github:init.description" />
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <label htmlFor="repo-name" className="text-sm text-zinc-300 mb-2 block">
                        <Translate content="github:init.label" />
                    </label>
                    <TextInput
                        disableIcon
                        id="repo-name"
                        type="text"
                        value={repoName}
                        onChange={(e) => setRepoName(sanitizeRepoName(e.target.value))}
                        placeholder={t["init.placeholder"]}
                        disabled={isPending}
                        className="w-full"
                    />
                </div>

                <DialogFooter className="pt-6 flex items-center justify-end gap-3">
                    <DialogCloseButton variant="ghost" disabled={isPending}>
                        <Translate content="github:dialog.cancel" />
                    </DialogCloseButton>
                    <DialogCloseButton type="button" onClick={handleSubmit} variant="default" disabled={isPending}>
                        {isPending ? <Translate content="github:dialog.processing" /> : <Translate content="github:init.confirm" />}
                    </DialogCloseButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
