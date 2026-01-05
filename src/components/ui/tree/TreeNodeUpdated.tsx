import { useTranslate } from "@/lib/i18n";
import { useParams } from "@tanstack/react-router";
import { SidebarLink } from "@/components/ui/tree/SidebarLink";
import { useTree } from "@/components/ui/tree/useTree";
import { getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";

export function TreeNodeUpdated() {
    const { changesRoute, clearSelection, concept } = useTree();
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, concept).length);
    const { lang } = useParams({ from: "/$lang" });
    const t = useTranslate();

    return (
        <SidebarLink to={changesRoute} params={{ lang }} icon="/icons/pencil.svg" count={modifiedCount} disabled={modifiedCount === 0} onClick={clearSelection}>
            {t("tree.updated")}
        </SidebarLink>
    );
}