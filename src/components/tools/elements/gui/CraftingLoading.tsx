import LoadingSlot from "@/components/tools/elements/gui/LoadingSlot";

export default function SkeletonCraftingTableGUI() {
    return (
        <div className={"p-4 flex justify-center"}>
            <div>
                <div className={"w-[10rem] mb-2 h-4 bg-zinc-700 rounded-md animate-pulse"} />
                <div className={"flex justify-between items-center w-[18rem]"}>
                    <div className={"w-[10.5rem] flex flex-wrap"}>
                        {Array.from({ length: 9 }).map((_, index) => (
                            <LoadingSlot key={index.toString()} />
                        ))}
                    </div>
                    <img src="/images/features/gui/arrow.webp" alt="loading arrow" width={32} height={27} />
                    <LoadingSlot />
                </div>
            </div>
        </div>
    );
}
