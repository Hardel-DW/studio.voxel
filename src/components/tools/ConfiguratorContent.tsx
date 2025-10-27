import type { ReactNode } from "react";
import type { Tab } from "@/components/tools/elements";
import Translate from "@/components/ui/Translate";

export default function ConfiguratorContent(props: { tab: Tab; children: ReactNode }) {
    return (
        <div className="h-full">
            <div className="flex items flex-col pt-4 h-full">
                {props.tab.soon && (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <img src="/icons/tools/lock.svg" alt="Lock" className="w-48 h-48 invert-50" />
                        <div className="text-2xl text-zinc-400 text-center font-light mb-4">
                            <Translate content="temporary_disabled" />
                        </div>
                    </div>
                )}
                {props.children}
            </div>
        </div>
    );
}
