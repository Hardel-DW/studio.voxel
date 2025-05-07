import { TooltipContext } from "@/components/tools/tooltip/useTooltip";
import { useTooltipPosition } from "@/lib/hook/useTooltipPosition";
import { clsx } from "@/lib/utils";
import { useContext, useRef } from "react";

export default function ItemTooltip(props: {
    categories?: string[];
}) {
    const { hoveredItem } = useContext(TooltipContext);
    const ref = useRef<HTMLDivElement>(null);
    const position = useTooltipPosition(ref);

    return (
        <>
            {hoveredItem && (
                <div
                    ref={ref}
                    className={clsx(
                        "fixed mx-1 my-tiny p-1.5 pointer-events-none z-10 bg-[#100010f0]",
                        "after:absolute after:top-tiny after:-right-tiny after:bottom-tiny after:-left-tiny after:border-tiny after:border-[#100010f0] border-none-solid",
                        "before:right-0 before:left-0 before:top-tiny before:bottom-tiny tooltip-border"
                    )}
                    style={{ left: position.x, top: position.y }}>
                    <div className={"font-seven text-base text-white whitespace-nowrap text-left word-spacing"}>
                        <div className={"text-name text-shadow-white"}>
                            {hoveredItem
                                .replace(/^[^:]+:/, "")
                                .split("_")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                        </div>
                        <div className={"text-base mt-[0.2em] text-lore text-shadow-dark"}>{hoveredItem}</div>
                        {props.categories && props.categories?.length > 0 && (
                            <div className={"mt-2"}>
                                {props.categories?.map((category) => (
                                    <div key={category} className={"text-attribute text-shadow-blue"}>
                                        {category}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
