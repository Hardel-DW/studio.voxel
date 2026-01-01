import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import GithubSender from "@/components/tools/sidebar/export/GithubSender";
import InitializeRepoButton from "@/components/tools/sidebar/export/InitializeRepoButton";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Translate from "@/components/ui/Translate";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";

export default function GitButton() {
    const { owner, repositoryName, isGitRepository, branch } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const { isAuthenticated, login, user } = useGitHubAuth();
    const { isInitializing } = useExportStore();


    return (
        <Dialog id="git-dialog">
            <DialogTrigger>
                <Button type="button" variant="transparent" size="square" className="border-0 select-none aspect-square shrink-0">
                    <img src="/icons/company/github.svg" alt="Git" className="size-6 invert opacity-70" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-xl min-w-0 bg-zinc-950 border border-zinc-800 p-0 overflow-hidden gap-0">
                {!isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/shine.avif')] opacity-10 bg-cover bg-center pointer-events-none" />
                        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="size-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl shadow-black/50">
                                <img src="/icons/company/github.svg" alt="GitHub" className="size-10 invert" />
                            </div>
                            <div className="space-y-2 max-w-sm">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Unlock Cloud Sync</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Connect your GitHub account to backup your work, collaborate with others, and manage
                                    versions seamlessly.
                                </p>
                            </div>
                            <Button
                                onClick={() => login({ redirect: false })}
                                className="h-12 px-8 bg-white text-black font-bold hover:bg-zinc-200 transition-all rounded-full shadow-lg shadow-white/5">
                                Connect with GitHub
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner">
                                    <img src="/icons/company/github.svg" alt="Git" className="size-5 invert opacity-75" />
                                </div>
                                <div>
                                    <h3 className="text-zinc-100 font-semibold tracking-tight text-lg">
                                        <Translate content="repository" />
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                        <span>{isGitRepository ? `${owner}/${repositoryName}` : name}</span>
                                        {branch && (
                                            <>
                                                <span className="opacity-30">•</span>
                                                <span className="text-zinc-400">{branch}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* User Avatar */}
                            {user && (
                                <div className="flex items-center gap-3 bg-zinc-900/50 pr-4 pl-1 py-1 rounded-full border border-zinc-800">
                                    <img src={user.avatar_url} alt={user.login} className="size-6 rounded-full" />
                                    <span className="text-xs font-medium text-zinc-400">{user.login}</span>
                                </div>
                            )}
                        </div>

                        <DialogBody className="p-6 space-y-6">
                            {/* Status Section */}
                            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
                                <div className="relative z-10 flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-zinc-300 font-medium">
                                            {isGitRepository ? "Repository Synced" : "Ready to Initialize"}
                                        </span>
                                    </div>

                                    {isInitializing && (
                                        <div className="absolute inset-0 flex items-center flex-col justify-center bg-zinc-950/50 rounded-2xl w-full h-full z-100 backdrop-blur-sm">
                                            <div className="w-8 h-8 border-4 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
                                            <span className="text-sm text-zinc-400 mt-4">
                                                <Translate content="github:init.progress.sidebar" replace={[isInitializing.toString()]} />
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 z-0 opacity-5">
                                    <img src="/images/shine.avif" alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <label htmlFor="actions" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Actions</label>
                                <div className="grid gap-3">
                                    {isGitRepository ? <GithubSender /> : <InitializeRepoButton />}
                                </div>
                            </div>
                        </DialogBody>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
