"use client";

import { useElementCondition } from "@/lib/hook/useBreezeElement";
import type { Condition } from "@/lib/utils/lock";
import type React from "react";

interface RenderGuardProps {
    condition: Condition | undefined;
    children: React.ReactNode | (() => React.ReactNode);
    elementId?: string;
}

export default function RenderGuard({ condition, children, elementId }: RenderGuardProps) {
    const shouldHide = useElementCondition(condition, elementId);
    if (shouldHide) return null;

    return typeof children === "function" ? children() : children;
}
