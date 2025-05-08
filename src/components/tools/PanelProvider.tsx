"use client";

import type React from "react";

export default function PanelProvider({ children }: { children?: React.ReactNode }) {
    return (
        <>
            <div id="portal" className="fixed inset-0 -z-10" />
            {children}
        </>
    );
}
