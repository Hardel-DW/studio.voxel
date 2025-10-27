import type { RefObject } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import AuthView from "@/components/tools/sidebar/export/AuthView";
import DownloadButton from "@/components/tools/sidebar/export/DownloadButton";
import GithubSender from "@/components/tools/sidebar/export/GithubSender";
import InitializeRepoButton from "@/components/tools/sidebar/export/InitializeRepoButton";
import RepositoryLoading from "@/components/tools/sidebar/export/RepositoryLoading";
import UnauthView from "@/components/tools/sidebar/export/UnauthView";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import Translate from "@/components/ui/Translate";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";

export default function ExportButton({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const { owner, repositoryName, isGitRepository } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const { isAuthenticated } = useGitHubAuth();

    return (
        <Popover className="w-full">
            <PopoverTrigger className="w-full">
                <Button type="button" className="w-full items-center gap-2" variant="shimmer">
                    <span className="text-sm">
                        <Translate content="export" />
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                containerRef={containerRef}
                spacing={20}
                padding={16}
                className="rounded-none border-none shadow-none p-0 bg-transparent space-y-2">
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-md z-20 p-4">
                    <div className="relative">{isAuthenticated ? <AuthView /> : <UnauthView />}</div>
                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                </div>
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-md z-20 flex flex-col p-2 pb-3 gap-3">
                    <RepositoryLoading />
                    <div className="flex flex-col gap-1 bg-neutral-950 rounded-2xl p-2 border border-zinc-800">
                        {isGitRepository ? <GithubSender /> : <InitializeRepoButton />}
                        <DownloadButton />
                    </div>

                    <div className="px-2 flex items-center justify-between text-xs text-zinc-400">
                        <span className="leading-none text-s text-zinc-500">{isGitRepository ? `${owner}/${repositoryName}` : name}</span>
                    </div>

                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
