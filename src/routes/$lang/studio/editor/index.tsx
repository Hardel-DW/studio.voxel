import { createFileRoute } from "@tanstack/react-router";
import { LinkButton } from "@/components/ui/Button";

export const Route = createFileRoute("/$lang/studio/editor/")({
    component: EditorHomepage
});

function EditorHomepage() {
    const { lang } = Route.useParams();

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-96 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white">Welcome to Voxel Studio</h1>
                    <p className="text-xl text-zinc-300">Choose a concept from the sidebar to start editing your datapack</p>
                    <p className="text-sm text-zinc-400">Select Enchantment, Loot Table, Recipe, or Structure to begin</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <LinkButton href={`/${lang}/studio/editor/enchantment/overview`} variant="primary" size="lg">
                        Start with Enchantments
                    </LinkButton>
                    <LinkButton href={`/${lang}/studio/editor/loot/overview`} variant="ghost" size="lg">
                        Explore Loot Tables
                    </LinkButton>
                </div>

                <div className="mt-12 text-xs text-zinc-500">
                    💡 Tip: Import a vanilla datapack using the button in the sidebar to get started quickly
                </div>
            </div>
        </div>
    );
}
