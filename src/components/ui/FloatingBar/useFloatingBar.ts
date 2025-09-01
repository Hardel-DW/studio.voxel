import { useRef } from "react";
import { useFloatingBarStore } from "./FloatingBarStore";
import type { FloatingBarContent } from "./types";

export function useFloatingBar() {
    const store = useFloatingBarStore();
    const initRef = useRef(false);

    return {
        init: (config: FloatingBarContent) => {
            if (!initRef.current) {
                store.setContent(config);
                initRef.current = true;
            }
        }
    };
}
