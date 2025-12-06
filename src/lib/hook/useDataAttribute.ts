import { useRef } from "react";

export function useDataAttribute<T extends HTMLElement = HTMLElement>({ name, initial }: { name: string; initial: boolean }) {
    const ref = useRef<T>(null);
    const valueRef = useRef<boolean>(initial);
    const set = (value: boolean) => {
        valueRef.current = value;
        if (!ref.current) return;
        if (!value) {
            return delete ref.current.dataset[name];
        }

        ref.current.dataset[name] = "";
    };

    const toggle = () => set(!valueRef.current);
    const get = () => valueRef.current;
    return { ref, set, toggle, get, initial };
}

