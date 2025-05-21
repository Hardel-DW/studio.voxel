import type React from "react";
import type { BaseComponent } from "../types/component";
import RenderGuard from "./RenderGuard";

export type ToolGridType = BaseComponent & {
    size?: string;
    children: React.ReactNode;
};

export default function ToolGrid(props: ToolGridType) {
    return (
        <RenderGuard condition={props.hide}>
            <div
                className="grid max-xl:grid-cols-1 gap-4"
                style={{
                    gridTemplateColumns: `repeat(auto-fit, minmax(${props.size ?? "255px"}, 1fr))`
                }}>
                {props.children}
            </div>
        </RenderGuard>
    );
}
