import { useState } from 'react';

interface UseDragAndDropProps {
    onDrop?: (item: string, slotPath: string) => void;
    onSlotClear?: (slotPath: string) => void;
}

export function useDragAndDrop({ onDrop, onSlotClear }: UseDragAndDropProps = {}) {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, item: string) => {
        e.dataTransfer.setData("text/plain", item);
        e.dataTransfer.effectAllowed = "copy";
        setDraggedItem(item);
    };

    const handleDragEnd = () => setDraggedItem(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e: React.DragEvent, slot: string) => {
        e.preventDefault();
        const item = e.dataTransfer.getData("text/plain");
        if (item) {
            onDrop?.(item, slot);
        }
        setDraggedItem(null);
    };

    const handleSlotClear = (slotPath: string) => {
        onSlotClear?.(slotPath);
    };

    return {
        draggedItem,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
        handleSlotClear,
    };
} 