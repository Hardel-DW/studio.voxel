export default function Loading() {
    return (
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
    );
}
