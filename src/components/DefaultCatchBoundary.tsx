import type { ErrorComponentProps } from "@tanstack/react-router";

export default function DefaultCatchBoundary({ error }: ErrorComponentProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center space-y-4 max-w-2xl px-4">
                <h1 className="text-6xl font-bold text-rose-700">Error</h1>
                <p className="text-xl text-zinc-400">Something went wrong</p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-left">
                    <p className="text-sm text-red-400 font-mono ">{error.message || "An unexpected error occurred"}</p>
                </div>
                <a href="/" className="inline-block px-6 py-3 bg-rose-700 hover:bg-rose-600 text-white rounded-lg transition">
                    Go Home
                </a>
            </div>
        </div>
    );
}
