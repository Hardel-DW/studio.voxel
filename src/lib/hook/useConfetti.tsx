import { Confetti } from "@/components/ui/Confetti";
import { useCallback, useState } from "react";

export function useConfetti() {
    const [confettiIds, setConfettiIds] = useState<number[]>([]);

    const addConfetti = useCallback(() => {
        const newId = Date.now();
        setConfettiIds((ids) => [...ids, newId]);
        setTimeout(() => {
            setConfettiIds((ids) => ids.filter((id) => id !== newId));
        }, 3000);
    }, []);

    const renderConfetti = useCallback((): React.ReactNode => {
        return confettiIds.map((id) => <Confetti key={id} />);
    }, [confettiIds]);

    return {
        addConfetti,
        renderConfetti
    } as const;
}
