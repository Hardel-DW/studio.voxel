import { createPortal } from "react-dom";
import DebugPanel from "@/components/tools/debug/DebugPanel";
import { useDebugStore } from "@/components/tools/debug/DebugStore";

export default function DebugConfigurator() {
    const isDebugModalOpen = useDebugStore((state) => state.isDebugModalOpen);
    return isDebugModalOpen ? createPortal(<DebugPanel />, document.getElementById("portal") as HTMLElement) : null;
}
