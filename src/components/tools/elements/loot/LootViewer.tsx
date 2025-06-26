import { useInteractiveLogic, type BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import type { TranslateTextType } from "@/components/tools/Translate";
import RewardItem from "./RewardItem"
import type { LootItem } from "@voxelio/breeze";

export type LootViewerProps = BaseInteractiveComponent & {
    title: TranslateTextType;
    data: LootItem[]
};

export default function LootViewer(props: LootViewerProps) {
    const { value, handleChange } = useInteractiveLogic<LootViewerProps, boolean>({ component: props });

    return (
        <div className="relative overflow-hidden bg-black/50 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 rounded-xl w-full min-h-full">
            {/* Right Column */}
            <div className="overflow-y-auto col-span-5 flex flex-col gap-y-4 p-8">
                <div>
                    <div className="flex justify-between items-center gap-y-2">
                        <h1 className="text-2xl font-bold text-white">Chance d'obtention</h1>
                        <p className="text-sm text-zinc-400">This loot table has {value} items</p>
                    </div>
                    <div className="w-full h-1 bg-zinc-700 rounded-full" />
                </div>


                <ul className="grid grid-cols-2 gap-4">
                    {props.data?.map((reward) => <RewardItem key={reward.id} {...reward} onDelete={(id: string) => handleChange(id)} />)}
                </ul>
            </div>

            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30 rotate-180">
                <img src="/images/shine.avif" alt="Shine" />
            </div>
        </div>
    )
}