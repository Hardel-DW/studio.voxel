import Donation from "@/components/tools/elements/Donation";
import ToolSection from "@/components/tools/elements/ToolSection";
import React from "react";

export default function RecipeMainSection() {
    return (
        <ToolSection id="main" title={{ key: "recipe:section.main" }}>
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
