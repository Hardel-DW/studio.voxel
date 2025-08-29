import { CodeSection } from "@/components/tools/debug/CodeSection";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";

interface RightSectionProps {
    uniqueKey: string | undefined;
}

export function RightSection({ uniqueKey }: RightSectionProps) {
    const { name, version } = useConfiguratorStore.getState();
    const { closeDebugModal } = useDebugStore();

    return (
        <div className="h-full pt-12 relative flex flex-col min-h-0">
            <div className="absolute top-0 left-0 px-2">
                <p className="text-zinc-400">{name}</p>
                <p className="text-xs text-zinc-500">
                    <Translate content="debug.pack_version" /> - {version}
                </p>
            </div>
            <button
                className="absolute cursor-pointer top-1 right-0 rounded-xl text-zinc-500 hover:text-zinc-200 transition-colors bg-zinc-950/10 px-2 py-1 border-zinc-950"
                type="button"
                onClick={closeDebugModal}>
                <Translate content="debug.leave" />
            </button>
            <div className="flex-1 min-h-0">
                <CodeSection uniqueKey={uniqueKey} />
            </div>
        </div>
    );
}
