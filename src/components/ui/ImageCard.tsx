import { cn } from "@/lib/utils";
import Button from "./Button";

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
                "group relative animate-levitate cursor-pointer hover:scale-130 transition-all duration-300 shadow-2xl shadow-red-950/15 w-96 scale-125 aspect-video",
                className
            )}>
            <img className="w-full h-full object-cover rounded-2xl border-2 border-zinc-900" alt={title} src={image} />
            <div className="absolute hidden group-hover:flex inset-0 bg-black/50 flex-col gap-4 items-center justify-center starting:opacity-0 transition-all duration-1000">
                <p className="text-white text-2xl font-bold">{title}</p>
                <Button className="w-full xl:w-fit" href={href} size="sm" variant="white-shimmer">
                    {button}
                </Button>
            </div>
        </div>
    );
}
