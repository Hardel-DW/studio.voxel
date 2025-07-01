import { cn } from "@/lib/utils";
import { Identifier } from "@voxelio/breeze/core";
import { useDebugStore } from "@/components/tools/debug/DebugStore";

interface RegistryElementProps {
    uniqueKey: string;
    selectedElement: string | undefined;
    onElementSelect: (uniqueKey: string) => void;
}

export function RegistryElement({ uniqueKey, selectedElement, onElementSelect }: RegistryElementProps) {
    const elements = useDebugStore((state) => state.elements);
    const labeledElement = elements.get(uniqueKey);
    const identifier = Identifier.fromUniqueKey(uniqueKey);
    const isSelected = selectedElement === uniqueKey;

    return (
        <div
            key={uniqueKey}
            onClick={() => onElementSelect(uniqueKey)}
            onKeyDown={() => onElementSelect(uniqueKey)}
            className={cn(
                "border-zinc-800 relative cursor-pointer border-t border-b rounded-lg p-2 bg-zinc-900/10 hover:bg-zinc-800/10 transition-colors w-full",
                {
                    "border-red-950": labeledElement?.type === "deleted",
                    "border-green-950": labeledElement?.type === "new",
                    "border-blue-950": labeledElement?.type === "updated"
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
        </div>
    );
}
