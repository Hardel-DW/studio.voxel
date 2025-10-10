import { useEffect, useRef } from "react";

type Handler = () => void;

export const useClickOutside = (handler: Handler, ignoreOtherPopovers = true) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (ref.current && !ref.current.contains(target)) {
                if (ignoreOtherPopovers) {
                    const clickedPopover = (target as Element).closest?.("[popover]");
                    if (clickedPopover && clickedPopover !== ref.current) {
                        return;
                    }
                }
                handler();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handler, ignoreOtherPopovers]);

    return ref;
};
