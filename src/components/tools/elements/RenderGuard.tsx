"use client";

import { useElementCondition } from "@/lib/hook/useBreezeElement";
import type { Condition } from "@voxelio/breeze";
import type React from "react";

interface RenderGuardProps {
    condition?: Condition;
    children: React.ReactNode | (() => React.ReactNode);
}

export default function RenderGuard({ condition, children }: RenderGuardProps) {
    const shouldHide = useElementCondition(condition);

    if (shouldHide) {
        return null;
    }

    return typeof children === "function" ? children() : children;
}
