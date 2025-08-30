import { Link, useLocation, useParams } from "@tanstack/react-router";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";
import { cn } from "@/lib/utils";

export default function ConfiguratorPanel() {
    const params = useParams({ from: "/$lang/studio/editor" });
    const location = useLocation();
    const currentConcept = useConfiguratorStore((state) => state.selectedConcept);
    const selectedElement = useConfiguratorStore((state) => state.currentElementId);
    const activeConcept = CONCEPTS.find((concept) => concept.registry === currentConcept);
    if (!activeConcept || !selectedElement) return null;

    return (
        <div className="flex gap-x-5 bg-inherit justify-center pt-1 overflow-x-auto border-0 mb-4 pb-4 gap-y-4 border-b-2 rounded-none border-zinc-800 flex-wrap shrink-0">
            {activeConcept.tabs.length > 1 &&
                activeConcept.tabs.map((tab) => {
                    const tabUrl = tab.url.replace("$lang", params.lang);
                    const isActive = location.pathname === tabUrl;

                    return (
                        <Link
                            key={tab.id}
                            to={tab.url}
                            params={{ lang: params.lang }}
                            disabled={tab.soon}
                            className={cn(
                                "backdrop-blur-2xl ring-3 px-4 py-2 rounded-md text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                isActive ? "ring-zinc-600 bg-transparent" : "ring-zinc-900"
                            )}>
                            <Translate content={tab.text} />
                        </Link>
                    );
                })}
        </div>
    );
}
