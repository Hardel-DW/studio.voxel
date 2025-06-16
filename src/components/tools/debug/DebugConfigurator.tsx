import { useConfiguratorStore } from "@/components/tools/Store";
import DebugPanel from "@/components/tools/debug/DebugPanel";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { createPortal } from "react-dom";

export default function DebugConfigurator() {
    const { isDebugModalOpen, openDebugModal } = useDebugStore();

    const handleDebugging = () => {
        const store = useConfiguratorStore.getState();
        const assembleDatapack = store.compile();
        openDebugModal(assembleDatapack);
    };

    const debugPanel = isDebugModalOpen ? createPortal(<DebugPanel />, document.getElementById("portal") as HTMLElement) : null;

    return (
        <>
            {debugPanel}
            <button className="p-2 bottom-36 cursor-pointer right-4 z-50 rounded-xl size-10" onClick={handleDebugging} type="button">
                <img src="/icons/debug.svg" alt="Debug Configurator" className="invert" />
            </button>
        </>
    );
}
