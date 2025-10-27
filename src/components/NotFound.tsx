import SimpleLayout from "./layout/SimpleLayout";
import { LinkButton } from "./ui/Button";

export default function NotFound() {
    return (
        <SimpleLayout>
            <div className="relative z-10 px-8 py-12 w-full max-w-3xl mx-auto">
                <h1 className="text-6xl font-bold text-white mb-4">Page not found</h1>
                <p className="text-xl text-zinc-400 mb-12">
                    This page does not exist, please go back to the home page or contact the support if you think this is an error.
                </p>
                <LinkButton to="/" variant="black" className="w-full shimmer-neutral-950 border-zinc-800 hover:shimmer-neutral-900">
                    Go to home
                </LinkButton>
            </div>
        </SimpleLayout>
    );
}
