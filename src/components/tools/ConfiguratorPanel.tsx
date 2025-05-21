"use client";

import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "./Translate";
import { CONCEPTS } from "./elements";
import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/i18nServer";

export default function ConfiguratorPanel() {
    const params = useParams<{ lang: Locale }>();
    const currentConcept = useConfiguratorStore((state) => state.selectedConcept);
    const hasElements = useConfiguratorStore((state) => state.elements.size > 0);
    const activeConcept = useMemo(() => CONCEPTS.find((concept) => concept.registry === currentConcept), [currentConcept]);
    if (!hasElements || !activeConcept) return null;

    return (
        <div className="flex flex-col">
            <div className="absolute w-full -z-10 inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-[10rem]" />
            <div className="contents">
                <div className="flex gap-x-5 bg-inherit justify-center pt-1 overflow-x-auto border-0 mb-4 pb-4 gap-y-4 border-b-2 rounded-none border-zinc-800 flex-wrap shrink-0">
                    {activeConcept.tabs.map((tab) => (
                        <Link
                            className="text-zinc-500 whitespace-nowrap font-medium cursor-pointer disabled:pointer-events-none hover:text-white text-md py-2 px-4 rounded-xl bg-transparent border-0 transition-colors duration-150 ease-bounce data-[state=active]:text-white data-[state=active]:bg-transparent backdrop-blur-2xl ring-1 ring-zinc-900 data-[state=active]:ring-zinc-600"
                            key={tab.id}
                            href={`/${params.lang}/studio/editor/${activeConcept.registry}/${tab.path}`}>
                            <Translate content={tab.text} schema={true} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
