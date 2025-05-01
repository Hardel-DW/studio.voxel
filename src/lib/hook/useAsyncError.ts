import { DatapackError } from "@voxelio/breeze/core";
import React from "react";

export default function useAsyncError() {
    const [_, setError] = React.useState();
    return React.useCallback((e: string) => {
        setError(() => {
            throw new DatapackError(e);
        });
    }, []);
}
