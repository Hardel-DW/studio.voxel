import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function ImageCard(props: { image: string; href: string; title: string; button: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "group relative animate-levitate cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl shadow-red-950/15 w-full max-w-80 sm:max-w-88 md:max-w-96 aspect-video",
                props.className
            )}>
            <img className="w-full h-full object-cover rounded-2xl border-2 border-zinc-900" alt={props.title} src={props.image} />
            <div className="absolute hidden group-hover:flex inset-0 bg-black/50 flex-col gap-4 items-center justify-center starting:opacity-0 transition-all duration-1000">
                <p className="text-white text-2xl font-bold">{props.title}</p>
                <LinkButton className="w-full xl:w-fit" href={props.href} size="sm" variant="shimmer">
                    {props.button}
                </LinkButton>
            </div>
        </div>
    );
}
