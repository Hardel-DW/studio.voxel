function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-zinc-800/50 rounded ${className ?? ""}`} />;
}

function StudioSidebarSkeleton() {
    return (
        <aside className="shrink-0 w-16 flex flex-col bg-editor">
            <div className="h-16 flex items-center justify-center">
                <Skeleton className="size-5" />
            </div>
            <div className="flex flex-col items-center gap-3 mt-4 flex-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={`concept-${i.toString()}`} className="size-10 rounded-xl" />
                ))}
            </div>
            <div className="flex flex-col items-center gap-2 pb-4">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="size-10 rounded-xl" />
            </div>
        </aside>
    );
}

function EditorSidebarSkeleton() {
    return (
        <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/75 flex flex-col">
            <div className="px-6 pt-6">
                <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="size-5 rounded" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-3 w-16 ml-7" />
            </div>

            <div className="flex-1 px-3 mt-6 space-y-2">
                <Skeleton className="h-9 w-full rounded-lg" />
                <div className="space-y-1 pt-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={`sidebar-${i.toString()}`} className="h-8 w-full rounded-md" />
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800/50">
                <Skeleton className="h-14 w-full rounded-lg" />
            </div>
        </aside>
    );
}

function HeaderSkeleton() {
    return (
        <header className="relative shrink-0 overflow-hidden border-b border-zinc-800/50 bg-zinc-900/50">
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="relative z-10 flex flex-col justify-end p-8 pb-6">
                <div className="flex items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-4 w-16 rounded-md" />
                        </div>
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-px w-24 mt-3" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-24 rounded-lg" />
                        <Skeleton className="h-9 w-20 rounded-lg" />
                    </div>
                </div>

                <nav className="flex items-center gap-1 mt-6 -mb-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={`tab-${i.toString()}`} className="h-9 w-20 rounded-t-lg" />
                    ))}
                </nav>
            </div>
        </header>
    );
}

function ContentSkeleton() {
    return (
        <div className="flex-1 p-6 space-y-4 overflow-hidden">
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={`content-${i.toString()}`} className="h-24 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default function EditorLoading() {
    return (
        <div className="flex h-dvh w-full overflow-hidden bg-editor">
            <StudioSidebarSkeleton />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 relative min-h-0 h-full bg-content overflow-hidden border-t border-l border-zinc-900 rounded-tl-3xl">
                    <div className="flex size-full overflow-hidden relative z-10 isolate">
                        <EditorSidebarSkeleton />
                        <div className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                            <HeaderSkeleton />
                            <ContentSkeleton />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
