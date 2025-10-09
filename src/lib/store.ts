import { create } from "zustand";

export function store<T>(initialValue: T) {
    const store = create<{ value: T; setValue: (value: T) => void }>((set) => ({
        value: initialValue,
        setValue: (value) => set({ value })
    }));

    return () => {
        const { value, setValue } = store();
        return [value, setValue] as const;
    };
}
