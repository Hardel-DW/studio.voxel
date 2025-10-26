import type { ErrorComponentProps } from "@tanstack/react-router";
import SimpleLayout from "./layout/SimpleLayout";
import { LinkButton } from "./ui/Button";

export default function DefaultCatchBoundary({ error }: ErrorComponentProps) {
    return (
        <SimpleLayout>
            <div className="relative z-10 px-8 py-12 w-full max-w-3xl mx-auto">
                <h1 className="text-6xl font-bold text-white mb-4">An error occurred</h1>
                <p className="text-xl text-zinc-400 mb-12">Something went wrong, please go back to the home page or contact the support if you think this is an error.</p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-left mb-8">
                    <p className="text-sm text-zinc-400 font-mono ">{error.message || "An unexpected error occurred"}</p>
                </div>
                <LinkButton to="/" variant="black" className="w-full shimmer-neutral-950 border-zinc-800 hover:shimmer-neutral-900">
                    Go to home
                </LinkButton>
            </div>
        </SimpleLayout>
    );
}
