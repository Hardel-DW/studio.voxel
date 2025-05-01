"use client";

import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { MenuTabsContent } from "@/components/ui/MenuTabs";
import { RenderSchemaChildren } from "./RenderSchema";
import type { ToolTab } from "@voxelio/breeze/core";
import Translate from "./Translate";
import { useSchema } from "@/lib/hook/useBreezeElement";

export default function ConfiguratorContent(props: { tab: ToolTab }) {
    const currentNamespace = useConfiguratorStore((state) => getCurrentElement(state)?.identifier.namespace);
    const schema = useSchema(props.tab.id);

    return (
        <MenuTabsContent value={props.tab.id} className="h-full">
            {currentNamespace === "minecraft" && (
                <div className="text-xs text-zinc-400 text-center font-light mb-4">
                    <Translate content="tools.enchantments.vanilla" />
                </div>
            )}

            <div className="flex items flex-col pt-4 h-full">
                {props.tab.soon && (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <img src="/icons/tools/lock.svg" alt="Lock" className="w-48 h-48 invert-50" />
                        <div className="text-2xl text-zinc-400 text-center font-light mb-4">Temporarily disabled - Come back soon!</div>
                    </div>
                )}

                <RenderSchemaChildren component={schema} />
            </div>
        </MenuTabsContent>
    );
}
