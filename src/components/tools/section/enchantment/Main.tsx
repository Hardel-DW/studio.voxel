import Donation from "@/components/tools/elements/Donation";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSelector from "@/components/tools/elements/ToolSelector";
import { Actions } from "@voxelio/breeze/core";
import type { EnchantmentProps } from "@voxelio/breeze/schema";
import React from "react";
import { LockEntryBuilder } from "@/lib/utils/lock";
import TemplateCard from "@/components/tools/elements/template/Card";

export default function EnchantGlobalMainSection() {
    return (
        <ToolSection id="main" title={{ key: "enchantment:section.global.description" }}>
            <ToolGrid>
                {["maxLevel", "weight", "anvilCost"].map((key, index) => (
                    <TemplateCard
                        image={`/icons/tools/${key}.svg`}
                        title={`enchantment:global.${key}.title`}
                        description={`enchantment:global.explanation.list.${index + 1}`}
                        short={`enchantment:global.explanation.list.${index + 1}`}
                    >
                        <ToolCounter
                            min={1}
                            max={127}
                            step={1}
                            action={(value: number) => new Actions().setValue(key, value).build()}
                            renderer={(el: EnchantmentProps) => el[key]}
                        />
                    </TemplateCard>
                ))}
            </ToolGrid>
            <ToolSelector
                key="mode-selector"
                title={{ key: "enchantment:global.mode.title" }}
                description={{ key: "enchantment:global.mode.description" }}
                lock={[
                    new LockEntryBuilder()
                        .addTextKey("vanilla_disabled")
                        .addCondition((el: EnchantmentProps) => el.identifier?.namespace === "minecraft")
                        .build()
                ]}
                action={(value: string) => new Actions().setValue("mode", value).build()}
                renderer={(el: EnchantmentProps) => el.mode}
                options={[
                    {
                        label: { key: "enchantment:global.mode.enum.normal" },
                        value: "normal"
                    },
                    {
                        label: { key: "enchantment:global.mode.enum.soft_delete" },
                        value: "soft_delete"
                    },
                    {
                        label: { key: "enchantment:global.mode.enum.only_creative" },
                        value: "only_creative"
                    }
                ]}
            />
            <Donation
                key="donation"
                icon="/icons/logo.svg"
                title={{ key: "supports.title" }}
                description={{ key: "supports.description" }}
                subTitle={{ key: "supports.advantages" }}
                extra={[
                    { key: "supports.advantages.early_access" },
                    { key: "supports.advantages.submit_ideas" },
                    { key: "supports.advantages.discord_role" },
                    { key: "supports.advantages.live_voxel" }
                ]}
                patreon={{
                    text: { key: "supports.become" },
                    link: "https://www.patreon.com/hardel"
                }}
                tipText={{
                    text: { key: "donate" },
                    link: "https://streamelements.com/hardoudou/tip"
                }}
            />
        </ToolSection>
    );
}
