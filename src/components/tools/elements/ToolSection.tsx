import type React from "react";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import { LinkButton } from "@/components/ui/Button";
import type { TranslateTextType } from "@/components/ui/Translate";
import Translate from "@/components/ui/Translate";
import type { BaseComponent } from "@/lib/hook/useBreezeElement";

export type ToolSectionType = BaseComponent & {
    id: string;
    title: TranslateTextType;
    children: React.ReactNode;
    button?: { text: TranslateTextType; url: string };
};

export default function ToolSection(props: ToolSectionType) {
    return (
        <RenderGuard condition={props.hide}>
            <div className="not-first:mt-16">
                <div className="py-2 px-2 gap-4 flex flex-wrap justify-between items-center cursor-pointer shrink-0">
                    <div className="relative">
                        <h2 className="text-2xl font-semibold">
                            <Translate content={props.title} />
                        </h2>
                        <hr className="m-0 absolute -bottom-2 left-0 right-0" />
                    </div>
                    {props.button && (
                        <LinkButton href={props.button.url} variant="ghost">
                            <Translate content={props.button.text} />
                        </LinkButton>
                    )}
                </div>
                <div className="pt-4 gap-4 flex items flex-col">{props.children}</div>
            </div>
        </RenderGuard>
    );
}
