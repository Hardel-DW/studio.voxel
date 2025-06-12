import type { Lock, LockRenderer } from "@/components/tools/types/component";
import { checkCondition } from "@voxelio/breeze";

export function checkLocks(locks: Lock[] | undefined, element: Record<string, unknown>): LockRenderer {
    if (!locks) return { isLocked: false };

    for (const lock of locks) {
        if (checkCondition(lock.condition, element)) {
            return { isLocked: true, text: lock.text };
        }
    }

    return { isLocked: false };
}
