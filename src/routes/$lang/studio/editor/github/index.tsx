import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query";
import type { FileStatus } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { Button } from "@/components/ui/Button";
import { TOAST, toast } from "@/components/ui/Toast";
import { GitHub } from "@/lib/github/GitHub";
import { GithubRepoValidationError } from "@/lib/github/GitHubError";
import { useClientDictionary } from "@/lib/hook/useClientDictionary";
import { encodeToBase64 } from "@/lib/utils/encode";
import { sanitizeRepoName } from "@/lib/utils/text";
import { useGithubContext } from "../github";
import Translate from "@/components/ui/Translate";

const DESCRIPTION = "Minecraft datapack created with Voxel Studio";

export const Route = createFileRoute("/$lang/studio/editor/github/")({
    component: GithubMainPage
});

function GithubMainPage() {
    const { isGitRepository } = useExportStore();
    const { diff } = useGithubContext();

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                {isGitRepository ? <CommitView diff={diff} /> : <InitView />}
            </div>
        </div>
    );
}

function InitView() {
    const [repoName, setRepoName] = useState("");
    const { token } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const t = useClientDictionary("github");
    const { isInitializing } = useExportStore();

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
            const files = Object.fromEntries(Object.entries(compiledFiles).map(([path, content]) => [path, encodeToBase64(content)]));
            useExportStore.getState().setInitializing(Object.keys(files).length);
            return new GitHub({ token }).initializeRepository(repoName, DESCRIPTION, false, true, files);
        },
        onSuccess: (data) => {
            toast(t["init.success"], TOAST.SUCCESS);
            const [owner, repositoryName] = data.fullName.split("/");
            useExportStore.setState({ owner, repositoryName, branch: data.defaultBranch, isGitRepository: true });
        },
        onError: (error: Error) => {
            if (error instanceof GithubRepoValidationError) {
                return toast(t["init.error.validation"], TOAST.ERROR);
            }
            toast(t["init.error"], TOAST.ERROR, error.message);
        },
        onSettled: () => useExportStore.getState().setInitializing(null)
    });

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
                <div className="size-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-xl mb-6">
                    <img src="/icons/company/github.svg" className="size-8 invert opacity-80" alt="" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Initialize Repository</h1>
                <p className="text-zinc-400">Create a new GitHub repository to start versioning your project.</p>
            </div>
            <div className="space-y-4 bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/50">
                <div className="space-y-2">
                    <label htmlFor="repoName" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Repository Name</label>
                    <input
                        type="text"
                        id="repoName"
                        value={repoName}
                        onChange={(e) => setRepoName(sanitizeRepoName(e.target.value))}
                        placeholder={name.toLowerCase().replace(/[^a-z0-9-_]/g, "-")}
                        className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-600 focus:outline-hidden focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
                    />
                </div>
                {isInitializing && (
                    <div className="absolute inset-0 flex items-center flex-col justify-center bg-zinc-950/50 rounded-2xl w-full h-full z-100 backdrop-blur-sm">
                        <div className="w-8 h-8 border-4 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
                        <span className="text-sm text-zinc-400 mt-4">
                            <Translate content="github:init.progress.sidebar" replace={[isInitializing.toString()]} />
                        </span>
                    </div>
                )}
                <Button
                    onClick={() => mutate()}
                    disabled={isPending || !repoName}
                    className="w-full h-12 bg-white text-black font-bold hover:bg-zinc-200 rounded-xl transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isPending ? "Creating Repository..." : "Create Repository"}
                </Button>
            </div>
        </div>
    )
}

function CommitView({ diff }: { diff: Map<string, FileStatus> }) {
    const { owner, repositoryName, branch, token } = useExportStore();
    const [message, setMessage] = useState("");
    const t = useClientDictionary("github");

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const configuratorStore = useConfiguratorStore.getState();
            const compiledFiles = configuratorStore.compile().getFiles();
            const files = Object.fromEntries(
                Array.from(diff).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiledFiles[path])])
            );
            return new GitHub({ token }).send(owner, repositoryName, branch, "push", files);
        },
        onSuccess: () => {
            toast(t["push.success"], TOAST.SUCCESS);
            setMessage("");
        },
        onError: (error: Error) => {
            toast(t["push.error"], TOAST.ERROR, error.message);
        }
    });

    return (
        <div className="w-full max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Source Control</h1>
                    <p className="text-zinc-400 text-sm flex items-center gap-2">
                        <span className="font-mono text-blue-400">{owner}/{repositoryName}</span>
                        <span className="opacity-30">•</span>
                        <span className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-xs text-zinc-500">{branch}</span>
                    </p>
                </div>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-2">
                    <img src="/icons/sync.svg" className="size-4 invert opacity-50" alt="" />
                    Sync
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Commit Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your changes..."
                            className="w-full h-32 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-600 focus:outline-hidden focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm leading-relaxed"
                        />
                    </div>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending || diff.size === 0 || !message}
                        className="w-full h-12 bg-blue-600 text-white font-bold hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                        {isPending ? "Pushing Changes..." : `Commit & Push (${diff.size})`}
                    </Button>
                </div>

                <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
                    <h3 className="font-semibold text-zinc-300 flex items-center gap-2">
                        <img src="/icons/tools/overview/info.svg" className="size-4 invert opacity-50" alt="" />
                        Repository Info
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-sm text-zinc-500">Status</span>
                            <span className="text-sm text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded">Up to date</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                            <span className="text-sm text-zinc-500">Changes</span>
                            <span className="text-sm text-zinc-200 font-mono">{diff.size} files</span>
                        </div>
                        <div className="pt-2">
                            <a
                                href={`https://github.com/${owner}/${repositoryName}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1">
                                Open on GitHub
                                <img src="/icons/arrow-right.svg" className="size-3 invert opacity-50" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}