import Donation from "@/components/tools/elements/Donation";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSelector from "@/components/tools/elements/ToolSelector";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import React from "react";
import { LockEntryBuilder } from "@/lib/utils/lock";

export default function EnchantGlobalMainSection() {
    return (
        <ToolSection id="main" title={{ key: "tools.enchantments.section.global.description" }}>
            <ToolGrid>
                {["maxLevel", "weight", "anvilCost"].map((key, index) => (
                    <ToolCounter
                        key={key}
                        title={{ key: `tools.enchantments.section.global.components.${key}.title` }}
                        description={{ key: `tools.enchantments.section.global.explanation.list.${index + 1}` }}
                        image={`/icons/tools/${key}.svg`}
                        min={1}
                        max={127}
                        step={1}
                        action={(value: number) => new Actions().setValue(key, value).build()}
                        renderer={(el: EnchantmentProps) => el[key]}
                    />
                ))}
            </ToolGrid>
            <ToolSelector
                key="mode-selector"
                title={{ key: "tools.enchantments.section.global.components.mode.title" }}
                description={{ key: "tools.enchantments.section.global.components.mode.description" }}
                lock={[
                    new LockEntryBuilder()
                        .addTextKey("tools.disabled_because_vanilla")
                        .addCondition((el: EnchantmentProps) => el.identifier?.namespace === "minecraft")
                        .build()
                ]}
                action={(value: string) => new Actions().setValue("mode", value).build()}
                renderer={(el: EnchantmentProps) => el.mode}
                options={[
                    {
                        label: { key: "tools.enchantments.section.global.components.selector.normal" },
                        value: "normal"
                    },
                    {
                        label: { key: "tools.enchantments.section.global.components.selector.soft_delete" },
                        value: "soft_delete"
                    },
                    {
                        label: { key: "tools.enchantments.section.global.components.selector.only_creative" },
                        value: "only_creative"
                    }
                ]}
            />
            <Donation
                key="donation"
                icon="/icons/logo.svg"
                title={{ key: "tools.supports.title" }}
                description={{ key: "tools.supports.description" }}
                subTitle={{ key: "tools.supports.advantages" }}
                extra={[
                    { key: "tools.supports.advantages.early_access" },
                    { key: "tools.supports.advantages.submit_ideas" },
                    { key: "tools.supports.advantages.discord_role" },
                    { key: "tools.supports.advantages.live_voxel" }
                ]}
                patreon={{
                    text: { key: "tools.supports.become" },
                    link: "https://www.patreon.com/hardel"
                }}
                tipText={{
                    text: { key: "dialog.footer.donate" },
                    link: "https://streamelements.com/hardoudou/tip"
                }}
            />
        </ToolSection>
    );
}
