import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function ImageCard({
    image,
    href,
    title,
    button,
    className
}: { image: string; href: string; title: string; button: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "group relative animate-levitate cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl shadow-red-950/15 w-full max-w-[20rem] sm:max-w-[22rem] md:max-w-[24rem] aspect-video",
                className
            )}>
            <img className="w-full h-full object-cover rounded-2xl border-2 border-zinc-900" alt={title} src={image} />
            <div className="absolute hidden group-hover:flex inset-0 bg-black/50 flex-col gap-4 items-center justify-center starting:opacity-0 transition-all duration-1000">
                <p className="text-white text-2xl font-bold">{title}</p>
                <LinkButton className="w-full xl:w-fit" href={href} size="sm" variant="white-shimmer">
                    {button}
                </LinkButton>
            </div>
        </div>
    );
}
