import TextureRenderer from "@/components/tools/texture/TextureRenderer";
import { cn } from "@/lib/utils";

export default function MinecraftItem(props: {
    item: string;
    className?: string;
}) {
    return (
        <span className={cn("p-[6px] relative opacity-60 hover:opacity-100 transition ease-in-out cursor-pointer", props.className)}>
            <TextureRenderer id={props.item} />
        </span>
    );
}
