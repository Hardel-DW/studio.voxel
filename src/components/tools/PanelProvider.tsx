"use client";

import type React from "react";
import { SWRConfig } from "swr";

export default function PanelProvider({ children }: { children?: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            }}>
            <div id="portal" className="fixed inset-0 -z-10" />
            {children}
        </SWRConfig>
    );
}
