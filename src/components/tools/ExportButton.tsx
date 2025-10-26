import type { RefObject } from "react";
import DownloadButton from "@/components/tools/DownloadButton";
import GithubSender from "@/components/tools/GithubSender";
import InitializeRepoButton from "@/components/tools/InitializeRepoButton";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";

export default function ExportButton({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const { owner, repositoryName, isGitRepository } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const { isAuthenticated, user, logout, login } = useGitHubAuth();

    return (
        <Popover className="w-full">
            <PopoverTrigger className="w-full">
                <Button type="button" className="w-full items-center gap-2" variant="shimmer">
                    <span className="text-sm">
                        <Translate content="export" />
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent containerRef={containerRef} spacing={30} padding={16} className="rounded-none border-none shadow-none p-0 bg-transparent space-y-2">
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-md z-20 p-4">
                    <div className="relative">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <img src={user?.avatar_url} alt={user?.login} className="w-10 h-10 rounded-full border-2 border-zinc-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-200 truncate">{user?.login}</p>
                                    <p className="text-xs text-zinc-400 truncate">ID: {user?.id}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => logout()}
                                    className="cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">Non connecté</p>
                                        <p className="text-xs text-zinc-500">Connectez-vous pour accéder aux fonctionnalités GitHub</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => login({ redirect: false })}
                                    className="w-full flex items-center gap-x-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white">
                                    <img src="/icons/company/github.svg" alt="GitHub" className="size-4 invert" />
                                    <span className="text-sm">
                                        <Translate content="repository.login_to_github" />
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" />
                    </div>
                </div>
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-md z-20 flex flex-col p-2 pb-3 gap-3">
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
