import type { RefObject } from "react";
import DownloadButton from "@/components/tools/DownloadButton";
import GithubSender from "@/components/tools/GithubSender";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

export default function ExportButton({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const { owner, repositoryName, branch, isGitRepository } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);

    return (
        <Popover className="w-full">
            <PopoverTrigger className="w-full">
                <Button type="button" className="w-full items-center gap-2" variant="shimmer">
                    <span className="text-sm">
                        <Translate content="export" />
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent containerRef={containerRef} spacing={20} padding={16} className="p-0 relative">
                <div className="p-4 flex items-center justify-between text-xs text-zinc-400">
                    <span className="leading-none">{isGitRepository ? `${owner}/${repositoryName}` : name}</span>
                    {isGitRepository && (
                        <span className="leading-none">
                            <Translate content="export.branch" />: {branch}
                        </span>
                    )}
                </div>

                <div className="px-2 pb-2">
                    <div className="flex flex-col gap-1 bg-neutral-950 rounded-2xl p-2 border border-zinc-800">
                        <GithubSender />
                        <DownloadButton />
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 brightness-30">
                    <img src="/images/shine.avif" alt="Shine" />
                </div>
            </PopoverContent>
        </Popover>
    );
}
