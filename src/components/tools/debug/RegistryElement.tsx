import { FILE_STATUS, Identifier } from "@voxelio/breeze";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { cn } from "@/lib/utils";

interface RegistryElementProps {
    uniqueKey: string;
    selectedElement: string | undefined;
    onElementSelect: (uniqueKey: string) => void;
}

export function RegistryElement({ uniqueKey, selectedElement, onElementSelect }: RegistryElementProps) {
    const fileStatusComparator = useDebugStore((state) => state.fileStatusComparator);
    const fileStatus = fileStatusComparator?.getFileStatus(uniqueKey);
    const identifier = Identifier.fromUniqueKey(uniqueKey);
    const isSelected = selectedElement === uniqueKey;

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onElementSelect(uniqueKey);
        }
    };

    return (
        <button
            type="button"
            onClick={() => onElementSelect(uniqueKey)}
            onKeyDown={handleKeyDown}
            className={cn(
                "border-zinc-800 relative cursor-pointer border-t border-b rounded-lg p-2 bg-zinc-900/10 hover:bg-zinc-800/10 transition-colors w-full text-left",
                {
                    "border-red-950": fileStatus === FILE_STATUS.DELETED,
                    "border-green-950": fileStatus === FILE_STATUS.ADDED,
                    "border-blue-950": fileStatus === FILE_STATUS.UPDATED
                }
            )}>
            <p className="absolute top-2 right-2 px-2 rounded-2xl bg-zinc-700/50 text-[0.65rem] text-zinc-500">
                {identifier.toNamespace()}
            </p>
            <div
                className={cn("text-white", {
                    "text-rose-500": isSelected
                })}>
                {identifier.toResourceName()}
            </div>
            <small className="text-xs text-gray-400">{identifier.toString()}</small>
        </button>
    );
}
