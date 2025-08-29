import { type ComponentType, lazy } from "react";

// Remplacement pour next/dynamic avec React.lazy
export default function dynamic<T = any>(
    importFunction: () => Promise<{ default: ComponentType<T> }>,
    options?: {
        loading?: () => React.JSX.Element;
        ssr?: boolean;
    }
) {
    console.log(options);
    return lazy(importFunction);
}
