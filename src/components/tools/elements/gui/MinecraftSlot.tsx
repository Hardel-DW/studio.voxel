import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";

export default function MinecraftSlot(props: { id: string; count: number; }) {
    return (
        <span className="slot w-16 h-16 relative flex items-center justify-center cursor-pointer">
            {props.id && <TextureRenderer id={props.id} className="scale-125" />}
            {props.count > 1 && <span className={"absolute bottom-0 right-0 text-xl text-white font-seven"}>{props.count}</span>}
        </span>
    );
}
