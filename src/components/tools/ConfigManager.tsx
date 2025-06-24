"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import type { Locale } from "@/lib/i18n/i18nServer";
import { useParams } from "next/navigation";
import type { PropsWithChildren } from "react";
import { LinkButton } from "../ui/Button";
import Translate from "@/components/tools/Translate";

export default function ConfigManager(props: PropsWithChildren) {
    const params = useParams<{ lang: Locale }>();
    const hasElements = useConfiguratorStore((state) => state.elements.size > 0);
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
            <LinkButton variant="white-shimmer" size="sm" href={`/${params.lang}/studio`}>
                <Translate content="back" />
            </LinkButton>
        </div>
    );
}
