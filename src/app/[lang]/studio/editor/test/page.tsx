export default function Loading() {
    return (
        <>
            <div className="flex flex-col flex-1 h-full overflow-hidden pb-4">
                <div className="overflow-y-auto overflow-x-hidden flex-1 h-full pb-16 mt-4">
                    <div className="flex space-x-px border-b border-zinc-700 mb-4">
                        <div className="h-8 basis-1/2 rounded-t-sm bg-zinc-700 animate-pulse py-2 px-3" />
                        <div className="h-8 basis-1/2 rounded-t-sm bg-zinc-800 animate-pulse py-2 px-3" />
                    </div>
                    <div className="space-y-4 px-1">
                        <div className="space-y-2">
                            <div className="h-4 w-1/3 rounded bg-zinc-600 animate-pulse" />
                            <div className="h-8 w-full rounded-md bg-zinc-700 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-1/4 rounded bg-zinc-600 animate-pulse" />
                            <div className="h-12 w-full rounded-md bg-zinc-700 animate-pulse" />
                        </div>
                        <div className="h-8 w-full rounded-md bg-zinc-700 animate-pulse" />
                        <div className="h-8 w-5/6 rounded-md bg-zinc-700 animate-pulse" />
                        <div className="h-8 w-full rounded-md bg-zinc-700 animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center gap-2 border-t border-zinc-700 pt-3">
                    <div className="h-9 w-full rounded-md bg-zinc-700 animate-pulse" />
                    <div className="h-9 w-9 rounded-md bg-zinc-700 animate-pulse flex-shrink-0" />
                </div>
            </div>

            <main className="contents">
                <div className="size-full pt-4 pb-8">
                    <div className="flex absolute inset-0 p-4 justify-between items-center select-none h-fit gap-x-4">
                        <div className="w-6 h-6 rounded-md bg-zinc-700 animate-pulse" />
                        <div className="h-4 w-32 rounded-md bg-zinc-700 animate-pulse" />
                        <div className="w-6 h-6 rounded-full bg-zinc-700 animate-pulse" />
                    </div>

                    <div className="px-8 lg:px-0 pt-12 h-full transition w-full md:w-[95%] justify-self-center flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </main>
        </>
    );
}
