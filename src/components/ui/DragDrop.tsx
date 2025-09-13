import {
    type ComponentPropsWithoutRef,
    cloneElement,
    createContext,
    isValidElement,
    type MouseEvent,
    type ReactNode,
    useContext,
    useEffect,
    useState
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DragData {
    id: string;
    category: string;
    children: ReactNode;
    offset: { x: number; y: number };
}

interface DropZoneProps extends Omit<ComponentPropsWithoutRef<"div">, "onDrop"> {
    children: ReactNode;
    zone: string;
    onDrop?: (dragData: DragData) => void;
    asChild?: boolean;
}

interface DraggableProps extends ComponentPropsWithoutRef<"div"> {
    children: ReactNode;
    id: string;
    category: string;
    asChild?: boolean;
}

interface DragDropContextValue {
    dragData: DragData | null;
    startDrag: (data: DragData) => void;
    endDrag: () => void;
    onDrop?: (dragData: DragData, dropZone: string) => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

export function DragDropProvider({ children, onDrop }: { children: ReactNode; onDrop?: (dragData: DragData, dropZone: string) => void }) {
    const [dragData, setDragData] = useState<DragData | null>(null);

    const startDrag = (data: DragData) => {
        setDragData(data);
        document.body.style.cursor = "grabbing";
    };

    const endDrag = () => {
        setDragData(null);
        document.body.style.cursor = "";
    };

    return (
        <DragDropContext.Provider value={{ dragData, startDrag, endDrag, onDrop }}>
            {children}
            {dragData && <DragPreview dragData={dragData} />}
        </DragDropContext.Provider>
    );
}

function DragPreview({ dragData }: { dragData: DragData }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: e.clientX - dragData.offset.x,
                y: e.clientY - dragData.offset.y
            });
        };

        document.addEventListener("mousemove", handleMouseMove as any);
        return () => document.removeEventListener("mousemove", handleMouseMove as any);
    }, [dragData.offset.x, dragData.offset.y]);

    return createPortal(
        <div
            className="fixed pointer-events-none z-50 opacity-75"
            style={{
                left: position.x,
                top: position.y,
                transform: "scale(0.9)"
            }}>
            {dragData.children}
        </div>,
        document.body
    );
}

export function Draggable({ children, id, category, asChild = false, ...props }: DraggableProps) {
    const context = useContext(DragDropContext);
    if (!context) throw new Error("Draggable must be used within DragDropProvider");

    const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();

        context.startDrag({
            id,
            category,
            children,
            offset: {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        });

        const handleMouseUp = () => {
            context.endDrag();
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mouseup", handleMouseUp);
    };

    const dragProps = {
        ...props,
        onMouseDown: handleMouseDown,
        className: cn("cursor-grab active:cursor-grabbing", props.className)
    };

    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            ...dragProps
        });
    }

    return <div {...dragProps}>{children}</div>;
}

export function DropZone({ children, zone, onDrop, asChild = false, ...props }: DropZoneProps) {
    const context = useContext(DragDropContext);
    if (!context) throw new Error("DropZone must be used within DragDropProvider");
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseUp = () => {
        if (context.dragData && isHovered) {
            onDrop?.(context.dragData);
            context.onDrop?.(context.dragData, zone);
            context.endDrag();
        }
        setIsHovered(false);
    };

    const dropProps = {
        ...props,
        onMouseUp: handleMouseUp,
        onMouseEnter: () => {
            if (context.dragData) {
                setIsHovered(true);
            }
        },
        onMouseLeave: () => {
            if (context.dragData) {
                setIsHovered(false);
            }
        },
        className: cn("transition-colors", props?.className, isHovered && context.dragData && "border-zinc-500 border-dashed bg-black/50")
    };

    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            ...dropProps
        });
    }

    return <div {...dropProps}>{children}</div>;
}
