import { useParams } from "@tanstack/react-router";
import { ToolNavItem } from "@/components/tools/concept/home/ToolNavItem";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { LinkButton } from "@/components/ui/Button";

export function HomePage() {
    const { lang } = useParams({ from: "/$lang" });
    const getLengthByRegistry = useConfiguratorStore((state) => state.getLengthByRegistry);

    return (
        <div className="container mx-auto relative z-10 flex flex-col h-full justify-between pt-12">
            {/* Welcome Section */}
            <div className="text-left mx-auto flex items-center gap-8">
                <div className="h-1/2 aspect-square">
                    <img src="/icons/logo.svg" alt="Voxel" className="size-full" />
                </div>
                <div>
                    <h1 className="text-5xl font-semibold text-white mb-4 tracking-wide">
                        <Translate content="welcome.title" />
                    </h1>

                    <p className="text-zinc-400 max-w-2xl leading-relaxed">
                        <Translate content="welcome.description" />
                    </p>
                </div>
            </div>

            {/* Studio Tools - Compact Alternating */}
            <div className="mx-auto space-y-4 min-w-3xl max-w-5xl">
                {CONCEPTS.map((concept, index) => (
                    <>
                        <ToolNavItem
                            key={concept.registry}
                            title={`tools.${concept.registry}.title`}
                            description={`tools.${concept.registry}.description`}
                            image={concept.image.src}
                            href={concept.registry}
                            alignRight={index % 2 === 1}
                            comingSoon={concept.registry === "structure"}
                            elementsCount={getLengthByRegistry(concept.registry)}
                            index={index}
                        />

                        {index < CONCEPTS.length - 1 && (
                            <div className="flex justify-center">
                                <div className="w-1/3 h-px bg-zinc-800 opacity-30" />
                            </div>
                        )}
                    </>
                ))}
            </div>

            {/* Guides Section */}
            <div className="px-24">
                <div className="bg-black/50 backdrop-blur-2xl border-t-2 border-l-2 border-stone-900 rounded-xl p-8 relative overflow-hidden flex items-center justify-between">
                    <div className="absolute inset-0 -z-10 brightness-15 rotate-180 hue-rotate-30">
                        <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
                    </div>

                    <div className="text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            <Translate content="welcome.help.title" />
                        </h2>

                        <p className="text-zinc-500 max-w-xl">
                            <Translate content="welcome.help.description" />
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <LinkButton href={`/${lang}/guides`} variant="ghost_border" size="md" className="px-8">
                            <Translate content="welcome.help.guides" />
                        </LinkButton>
                        <LinkButton href={`/${lang}/guides`} variant="white-shimmer" size="md" className="px-8">
                            <Translate content="welcome.help.discord" />
                        </LinkButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
