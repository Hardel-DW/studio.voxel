import { useMutation } from "@tanstack/react-query";
import { ClientOnly, useNavigate, useParams } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { TOAST, toast } from "@/components/ui/Toast";
import { GitHub, type Repository } from "@/lib/github/GitHub";
import { useGitHubAuth, useGitHubRepos } from "@/lib/hook/useGitHubAuth";
import { useDictionary } from "@/lib/hook/useNext18n";
import { RepositoryManager } from "@/lib/RepositoryManager";
import { TextInput } from "../ui/TextInput";

function RepositoryOpenerContent() {
    const navigate = useNavigate();
    const { lang } = useParams({ from: "/$lang" });
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [thirdPartyUrl, setThirdPartyUrl] = useState("");
    const dictionary = useDictionary();
    const { isAuthenticated, user, token, login, isLoggingIn } = useGitHubAuth();
    const { data, isLoading: isLoadingRepos } = useGitHubRepos(token);

    const manager = new RepositoryManager(user, data);
    const accounts = manager.getAccounts();
    const selectedAccountData = manager.findAccount(selectedAccount);
    const selectedAccountLabel = selectedAccountData?.label ?? dictionary.repository.select_account;
    const filteredRepositories = manager.getFilteredRepositories(selectedAccount, searchQuery);

    const { mutate, isPending } = useMutation({
        mutationFn: async (repo: Repository) => {
            toast(dictionary.studio.import_repository.downloading.replace("{repo.name}", repo.name), TOAST.INFO);
            const files = await new GitHub({ token }).clone(repo.owner.login, repo.name, repo.default_branch, true);
            const datapack = new Datapack(files).parse();
            return { datapack, repo };
        },
        onSuccess: ({ datapack, repo }) => {
            useConfiguratorStore.getState().setup(datapack, false, repo.name);
            useExportStore.getState().setGitRepository(repo.owner.login, repo.name, repo.default_branch, token || "");
            toast(dictionary.studio.import_repository.success.replace("{repo.name}", repo.name), TOAST.SUCCESS);
            navigate({ to: "/$lang/studio/editor", params: { lang } });
        },
        onError: (e: unknown) => {
            const errorMessage = e instanceof Error ? e.message : dictionary.studio.error.failed_to_import_repository;
            toast(dictionary.generic.dialog.error, TOAST.ERROR, errorMessage);
        }
    });

    if (!isAuthenticated)
        return (
            <Button
                onClick={() => login()}
                className="w-full mt-8 flex items-center gap-x-2 shimmer-zinc-950 border border-zinc-800 text-white">
                <img src="/icons/company/github.svg" alt="GitHub" className="size-4 invert" />
                <span className="text-sm">
                    <Translate content="repository.login_to_github" />
                </span>
            </Button>
        );

    return (
        <Dialog id="repository-opener-modal" className="w-full">
            <DialogTrigger>
                <Button
                    onClick={() => setSelectedAccount(manager.getDefaultAccountLogin())}
                    disabled={isLoggingIn || isLoadingRepos}
                    className="w-full mt-8 flex items-center gap-x-2">
                    <img src="/icons/company/github.svg" alt="GitHub" className="size-4" />
                    <span className="text-sm">
                        <Translate content={isLoggingIn ? "repository.loading" : "repository.open"} />
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[768px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                        <Translate content="repository.select" />
                    </DialogTitle>
                    <DialogDescription>
                        <Translate content="repository.select_description" />
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex-1">
                                <Button type="button" variant="ghost_border" className="w-full justify-between">
                                    <span className="text-sm">{selectedAccountLabel}</span>
                                    <img src="/icons/chevron-down.svg" alt="chevron" className="size-4 invert" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-50">
                                {accounts.map((account) => (
                                    <DropdownMenuItem
                                        key={account.value}
                                        onClick={() => setSelectedAccount(account.value)}
                                        description={
                                            account.type === "user"
                                                ? dictionary.repository.personal_repositories
                                                : dictionary.repository.organization_repositories.replace("{org}", account.label)
                                        }
                                        className={selectedAccount === account.value ? "bg-zinc-900 text-zinc-200" : ""}>
                                        {account.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <TextInput
                            placeholder={dictionary.repository.search_placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-3">
                        {filteredRepositories.length === 0 ? (
                            <div className="text-center py-8 text-zinc-400 text-sm">
                                <Translate content="repository.no_results" />
                            </div>
                        ) : (
                            filteredRepositories.map((repo) => (
                                <div
                                    key={repo.id}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 hover:border-zinc-700 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <img src={repo.owner.avatar_url} alt={repo.owner.login} className="size-8 rounded-full" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-zinc-200 truncate">{repo.name}</h3>
                                                {repo.private && (
                                                    <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">Private</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                                                {repo.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => mutate(repo)}
                                        variant="default"
                                        disabled={isPending}
                                        className="shrink-0 text-xs px-3 py-2">
                                        <Translate content="repository.import" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <label htmlFor="third-party-url" className="text-sm text-zinc-300 font-medium mb-2 block">
                            <Translate content="repository.third_party" />
                        </label>
                        <div className="flex items-center gap-2">
                            <TextInput
                                placeholder={dictionary.repository.third_party_placeholder}
                                value={thirdPartyUrl}
                                onChange={(e) => setThirdPartyUrl(e.target.value)}
                            />
                            <DialogCloseButton variant="default" className="text-xs px-4 py-2" disabled={!thirdPartyUrl.trim()}>
                                <Translate content="repository.import" />
                            </DialogCloseButton>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-6">
                    <DialogCloseButton variant="ghost">
                        <Translate content="close" />
                    </DialogCloseButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function RepositoryOpenerFallback() {
    return (
        <Button className="w-full mt-8 flex items-center gap-x-2 shimmer-zinc-950 border border-zinc-800 text-white">
            <img src="/icons/company/github.svg" alt="GitHub" className="size-4 invert" />
            <span className="text-sm">
                <Translate content="repository.loading" />
            </span>
        </Button>
    );
}

export default function RepositoryOpener() {
    return (
        <ClientOnly fallback={<RepositoryOpenerFallback />}>
            <RepositoryOpenerContent />
        </ClientOnly>
    );
}
