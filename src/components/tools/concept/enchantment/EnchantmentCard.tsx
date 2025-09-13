import { type EnchantmentProps, getItemFromMultipleOrOne, Identifier } from "@voxelio/breeze";
import { Draggable } from "@/components/ui/DragDrop";
import useTagManager from "@/lib/hook/useTagManager";
import EnchantOverviewCard from "./EnchantOverviewCard";

export default function EnchantmentCard({ element, isDetailed }: { element: EnchantmentProps; isDetailed: boolean }) {
    const { getAllItemsFromTag } = useTagManager();
    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);
    const elementId = new Identifier(element.identifier).toUniqueKey();

    return (
        <Draggable id={elementId} category="enchantment">
            <EnchantOverviewCard
                key={elementId}
                element={element}
                items={isTag ? getAllItemsFromTag(id) : [id]}
                elementId={elementId}
                display={isDetailed}
            />
        </Draggable>
    );
}
