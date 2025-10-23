import { useParams } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { LinkButton } from "@/components/ui/Button";

export default function ConfigManager(props: PropsWithChildren) {
    const { lang } = useParams({ from: "/$lang" });
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    if (hasElements) return props.children;

    return (
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
            <LinkButton variant="shimmer" size="sm" href={`/${lang}/studio`}>
                <Translate content="back" />
            </LinkButton>
        </div>
    );
}
