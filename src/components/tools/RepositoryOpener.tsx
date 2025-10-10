import { useRef, useState } from "react";
import Translate from "@/components/tools/Translate";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogCloseButton, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { useTranslateKey } from "@/lib/hook/useTranslation";
import { useGitHubAuth, useGitHubRepos } from "@/lib/hook/useGitHubAuth";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string;
    owner: string;
    private: boolean;
    avatar_url: string;
    html_url: string;
    clone_url: string;
}

interface Organization {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
}

export default function RepositoryOpener() {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [thirdPartyUrl, setThirdPartyUrl] = useState("");

    const searchPlaceholder = useTranslateKey("repository.search_placeholder");
    const thirdPartyPlaceholder = useTranslateKey("repository.third_party_placeholder");

    const { isAuthenticated, user, login, isLoggingIn } = useGitHubAuth();
    const { data: reposData, isLoading: isLoadingRepos, refetch } = useGitHubRepos();

    const handleButtonClick = () => {
        if (!isAuthenticated) {
            login();
            return;
        }

        refetch().then(() => {
            if (!selectedAccount && user) {
                setSelectedAccount(user.login);
            }
            dialogRef.current?.showPopover();
        });
    };

    const accounts: Array<{ value: string; label: string; description: string }> = [];
    const allRepositories: Repository[] = [];

    if (reposData && user) {
        accounts.push({
            value: user.login,
            label: user.login,
            description: "Your personal repositories"
        });

        allRepositories.push(...reposData.repositories);

        reposData.organizations.forEach((org: Organization) => {
            accounts.push({
                value: org.login,
                label: org.login,
                description: org.description || `${org.login} repositories`
            });
        });

        allRepositories.push(...reposData.orgRepositories);
    }

    const filteredRepositories = allRepositories.filter(
        (repo) => repo.owner === selectedAccount && repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedAccountLabel = accounts.find((acc) => acc.value === selectedAccount)?.label ?? "Select account";

    const handleImportRepository = (repo: Repository) => {
        console.log("Import repository:", repo);
        dialogRef.current?.hidePopover();
    };

    const handleImportThirdParty = () => {
        console.log("Import third-party repository:", thirdPartyUrl);
        dialogRef.current?.hidePopover();
    };

    const isLoading = isLoggingIn || isLoadingRepos;

    return (
        <>
            <Button
                type="button"
                onClick={handleButtonClick}
                variant="default"
                disabled={isLoading}
                className="w-full mt-8 flex items-center gap-x-2">
                <img src="/icons/company/github.svg" alt="GitHub" className="size-4" />
                <span className="text-sm">
                    {isLoading ? <Translate content="repository.loading" /> : <Translate content="repository.open" />}
                </span>
            </Button>

            <Dialog ref={dialogRef} id="repository-opener-modal" className="sm:max-w-[768px] p-6">
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
                                        description={account.description}
                                        className={selectedAccount === account.value ? "bg-zinc-900 text-zinc-200" : ""}>
                                        {account.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-700 transition-colors"
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
                                        <img src={repo.avatar_url} alt={repo.owner} className="size-8 rounded-full" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-zinc-200 truncate">{repo.name}</h3>
                                                {repo.private && (
                                                    <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">Private</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{repo.description || "No description"}</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => handleImportRepository(repo)}
                                        variant="default"
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
                            <input
                                id="third-party-url"
                                type="text"
                                placeholder={thirdPartyPlaceholder}
                                value={thirdPartyUrl}
                                onChange={(e) => setThirdPartyUrl(e.target.value)}
                                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-700 transition-colors"
                            />
                            <Button
                                type="button"
                                onClick={handleImportThirdParty}
                                variant="default"
                                className="text-xs px-4 py-2"
                                disabled={!thirdPartyUrl.trim()}>
                                <Translate content="repository.import" />
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-6">
                    <DialogCloseButton variant="ghost">
                        <Translate content="close" />
                    </DialogCloseButton>
                </DialogFooter>
            </Dialog>
        </>
    );
}
