import { useParams } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { LinkButton } from "@/components/ui/Button";

export default function ConfigManager(props: PropsWithChildren) {
    const { lang } = useParams({ from: "/$lang" });
    const hasElements = useConfiguratorStore((state) => state.elements.size > 0);

    return (
        <>
            {hasElements ? (
                props.children
            ) : (
                <div className="size-full flex items-center justify-center flex-col gap-y-4">
                    <h1 className="text-zinc-400 text-2xl font-bold">
                        <Translate content="no_config.title" />
                    </h1>
                    <div className="text-zinc-400 text-sm text-center">
                        <Translate content="no_config.description.1" />
                        <br />
                        <Translate content="no_config.description.2" />
                    </div>
                    <div className="w-1/2">
                        <hr />
                    </div>
                    <LinkButton variant="white-shimmer" size="sm" href={`/${lang}/studio`}>
                        <Translate content="back" />
                    </LinkButton>
                </div>
            )}
            <ItemTooltip />
        </>
    );
}
