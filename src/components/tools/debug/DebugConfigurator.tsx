import DebugPanel from "@/components/tools/debug/DebugPanel";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { createPortal } from "react-dom";

export default function DebugConfigurator() {
    const isDebugModalOpen = useDebugStore((state) => state.isDebugModalOpen);
    return isDebugModalOpen ? createPortal(<DebugPanel />, document.getElementById("portal") as HTMLElement) : null;
}
