import { Identifier } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/tools/Translate";

export default function SidebarItemContent({ elementId }: { elementId: string }) {
    const identifier = useConfiguratorStore((state) => state.elements.get(elementId)?.identifier);
    return (
        <div className="wrap-break-words cursor-pointer">
            {identifier ? new Identifier(identifier).toResourceName() : <Translate content="error" />}
        </div>
    );
}
