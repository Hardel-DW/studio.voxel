import { useEffect, useState } from "react";

interface UsePopoverVisibilityProps {
    open: boolean;
    transitionDuration?: number;
}

export const usePopoverVisibility = ({ open, transitionDuration = 150 }: UsePopoverVisibilityProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), transitionDuration);
            return () => clearTimeout(timer);
        }
    }, [open, transitionDuration]);

    return { isVisible, isLeaving: !open && isVisible };
};
