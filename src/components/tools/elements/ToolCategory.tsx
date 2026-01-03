import type React from "react";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { BaseComponent } from "@/lib/hook/useBreezeElement";
import { useTranslate } from "@/lib/i18n";

export type ToolCategoryType = BaseComponent & {
    title: string;
    children: React.ReactNode;
};

export default function ToolCategory(props: ToolCategoryType) {
    const t = useTranslate();

    return (
        <RenderGuard condition={props.hide}>
            <div className="not-first:mt-8">
                <div className="flex items-center gap-x-4 mb-8">
                    <div className="h-1 flex-1 bg-zinc-700" />
                    <h2 className="text-2xl font-semibold px-4">{t(props.title)}</h2>
                    <div className="h-1 flex-1 bg-zinc-700" />
                </div>
                <div className="flex flex-col gap-4">{props.children}</div>
            </div>
        </RenderGuard>
    );
}
