import { cn } from "@/lib/utils";
import { Identifier, getLabeledIdentifier } from "@voxelio/breeze/core";
import type { LabeledElement } from "@voxelio/breeze/core";

interface RegistryElementProps {
    element: LabeledElement;
    selectedElement: LabeledElement | undefined;
    onElementSelect: (element: LabeledElement) => void;
}

export function RegistryElement({ element, selectedElement, onElementSelect }: RegistryElementProps) {
    const identifier = getLabeledIdentifier(element);
    const isSelected = selectedElement && new Identifier(getLabeledIdentifier(selectedElement)).equalsObject(identifier);

    return (
        <div
            key={new Identifier(identifier).toFilePath()}
            onClick={() => onElementSelect(element)}
            onKeyDown={() => onElementSelect(element)}
            className={cn(
                "border-zinc-800 relative cursor-pointer border-t border-b rounded-lg p-2 bg-zinc-900/10 hover:bg-zinc-800/10 transition-colors w-full",
                {
                    "border-red-950": element.type === "deleted",
                    "border-green-950": element.type === "new"
                }
            )}>
            <p className="absolute top-2 right-2 px-2 rounded-2xl bg-zinc-700/50 text-[0.65rem] text-zinc-500">
                {new Identifier(identifier).toNamespace()}
            </p>
            <div
                className={cn("text-white", {
                    "text-rose-500": isSelected
                })}>
                {new Identifier(identifier).toResourceName()}
            </div>
            <small className="text-xs text-gray-400">{new Identifier(identifier).toString()}</small>
        </div>
    );
}
