import { cn } from "@/lib/utils";
import { ITEMS } from "@voxelio/breeze/schema";

export default function TextureRenderer(props: { id: string; className?: string }) {
    if (!(props.id in ITEMS)) {
        return null;
    }

    const asset = ITEMS[props.id as keyof typeof ITEMS];
    return (
        <div className={cn("h-10 w-10 relative shrink-0", props.className)}>
            <div
                className="atlas absolute inset-0 pixelated"
                style={{
                    backgroundPosition: `${-asset[0]}px ${-asset[1]}px`,
                    width: `${asset[2]}px`,
                    height: `${asset[3]}px`,
                    transform: `scale(${40 / asset[2]})`,
                    transformOrigin: "top left"
                }}
            />
        </div>
    );
}
