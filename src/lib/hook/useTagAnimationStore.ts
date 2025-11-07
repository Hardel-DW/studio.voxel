import { create } from "zustand";

const INTERVAL_MS = 2000;
export const useTagAnimationStore = create<{ tick: number }>(() => ({ tick: 0 }));
setInterval(() => useTagAnimationStore.setState((state) => ({ tick: state.tick + 1 })), INTERVAL_MS);
