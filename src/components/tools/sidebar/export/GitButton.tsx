import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import AuthView from "@/components/tools/sidebar/export/AuthView";
import GithubSender from "@/components/tools/sidebar/export/GithubSender";
import InitializeRepoButton from "@/components/tools/sidebar/export/InitializeRepoButton";
import RepositoryLoading from "@/components/tools/sidebar/export/RepositoryLoading";
import UnauthView from "@/components/tools/sidebar/export/UnauthView";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import Translate from "@/components/ui/Translate";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";

export default function GitButton() {
    const { owner, repositoryName, isGitRepository } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const { isAuthenticated } = useGitHubAuth();

    return (
        <Dialog id="git-dialog">
            <DialogTrigger>
                <Button type="button" variant="transparent" size="square" className="border-0 select-none aspect-square shrink-0">
                    <img src="/icons/company/github.svg" alt="Git" className="size-6 invert opacity-70" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-xl min-w-0 bg-zinc-950 border border-zinc-800 p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="flex items-center gap-x-3 text-xl">
                        <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner">
                            <img src="/icons/company/github.svg" alt="Git" className="size-5 invert opacity-75" />
                        </div>
                        <span className="text-zinc-100 font-semibold tracking-tight">
                            <Translate content="repository" />
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-sm">
                        <Translate content="repository.description" />
                    </DialogDescription>
                </DialogHeader>

                <DialogBody className="p-6 space-y-6">
                    {/* Auth Section */}
                    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
                        <div className="relative z-10">{isAuthenticated ? <AuthView /> : <UnauthView />}</div>
                        <div className="absolute inset-0 -z-0 opacity-20">
                            <img src="/images/shine.avif" alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 relative">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Actions</label>
                        <div className="flex flex-col gap-2 relative">
                            <RepositoryLoading />
                            {isGitRepository ? <GithubSender /> : <InitializeRepoButton />}
                        </div>
                    </div>
                </DialogBody>

                <div className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">Target</span>
                    <div className="flex items-center gap-2">
                        <img src="/icons/folder.svg" alt="" className="size-3.5 opacity-40 invert" />
                        <span className="text-xs font-mono text-zinc-400">
                            {isGitRepository ? `${owner}/${repositoryName}` : name}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
