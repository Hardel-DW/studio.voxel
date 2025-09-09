import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { Actions } from "@voxelio/breeze";
import TemplateCard from "@/components/tools/Card";
import Donation from "@/components/tools/elements/Donation";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSelector from "@/components/tools/elements/ToolSelector";
import { LockEntryBuilder } from "@/lib/utils/lock";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/main")({
    component: EnchantmentMainPage
});

function EnchantmentMainPage() {
    return (
        <div className="h-full">
            <div className="flex items flex-col pt-4 h-full">
                <ToolSection id="main" title="enchantment:section.global.description">
                    <ToolGrid>
                        {["maxLevel", "weight", "anvilCost"].map((key, index) => (
                            <TemplateCard
                                key={key}
                                image={`/icons/tools/${key}.svg`}
                                title={`enchantment:global.${key}.title`}
                                description={`enchantment:global.explanation.list.${index + 1}`}>
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
                        title="enchantment:global.mode.title"
                        description="enchantment:global.mode.description"
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
                                label: "enchantment:global.mode.enum.normal",
                                value: "normal"
                            },
                            {
                                label: "enchantment:global.mode.enum.soft_delete",
                                value: "soft_delete"
                            },
                            {
                                label: "enchantment:global.mode.enum.only_creative",
                                value: "only_creative"
                            }
                        ]}
                    />
                    <Donation
                        key="donation"
                        icon="/icons/logo.svg"
                        title="supports.title"
                        description="supports.description"
                        subTitle="supports.advantages"
                        extra={[
                            "supports.advantages.early_access",
                            "supports.advantages.submit_ideas",
                            "supports.advantages.discord_role",
                            "supports.advantages.live_voxel"
                        ]}
                        patreon={{
                            text: "supports.become",
                            link: "https://www.patreon.com/hardel"
                        }}
                        tipText={{
                            text: "donate",
                            link: "https://streamelements.com/hardoudou/tip"
                        }}
                    />
                </ToolSection>
            </div>
        </div>
    );
}
