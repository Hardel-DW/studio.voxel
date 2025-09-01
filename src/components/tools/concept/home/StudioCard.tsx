import Translate from "@/components/tools/Translate";
import { Button, LinkButton } from "@/components/ui/Button";

export function StudioCard({
    title,
    description,
    image,
    href,
    comingSoon
}: {
    title: string;
    description: string;
    image: string;
    href: string;
    comingSoon?: boolean;
    disabled?: boolean;
}) {
    const cardContent = (
        <div className="group relative h-full">
            <div className="p-6 h-full transition-all duration-300 cursor-pointer relative">
                {/* Background shine - only on hover */}
                <div className="absolute inset-0 -z-10 brightness-30 blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl overflow-hidden">
                    <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-6">
                        <img src={image} alt="Tool" className="w-12 h-12  pixelated" />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                <Translate content={title} />
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed break-words whitespace-normal">
                                <Translate content={description} />
                            </p>
                        </div>
                    </div>

                    {!comingSoon && (
                        <div className="pt-6 mt-auto">
                            <Button variant="ghostlite" className="w-full" onClick={() => {}}>
                                <Translate content="tools.open" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {comingSoon && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="text-white text-2xl font-bold uppercase tracking-wider text-center px-4">
                        <Translate content="tools.coming_soon" />
                    </div>
                </div>
            )}
        </div>
    );

    if (comingSoon) {
        return <div className="h-full">{cardContent}</div>;
    }

    return (
        <LinkButton href={href} className="h-full block p-0 bg-transparent border-0 hover:bg-transparent">
            {cardContent}
        </LinkButton>
    );
}
