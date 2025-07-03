import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";

export default function MinecraftSlot(props: {
    id: string;
    count: number;
    asset: string;
}) {
    return (
        <span className={"border border-white/20 w-14 h-14 p-[4px] relative hover:bg-zinc-800"}>
            {props.id && <TextureRenderer id={props.id} />}
            {props.count > 1 && <span className={"absolute bottom-0 right-0 text-xl text-white font-seven"}>{props.count}</span>}
        </span>
    );
}
