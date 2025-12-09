import { createFileRoute, Link, Outlet, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { buildEnchantmentTree } from "@/components/tools/concept/enchantment/buildEnchantmentTree";
import { SLOT_CONFIGS } from "@/components/tools/concept/enchantment/slots";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { FileTree } from "@/components/ui/FileTree";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import Translate from "@/components/ui/Translate";
import { enchantableKeys } from "@/lib/data/tags";
import { useElementsByType } from "@/lib/hook/useElementsByType";

const ENCHANTMENT_ICON = "/images/features/item/enchanted_book.webp";

const SLOT_FOLDER_ICONS = Object.fromEntries(SLOT_CONFIGS.map((c) => [c.id, c.image]));
const ITEM_FOLDER_ICONS = Object.fromEntries(enchantableKeys.map((k) => [k, `/images/features/item/${k}.webp`]));

export const Route = createFileRoute("/$lang/studio/editor/enchantment")({
    component: EnchantmentLayout
});

function EnchantmentLayout() {
    const { lang } = useParams({ from: "/$lang/studio/editor/enchantment" });
    const { sidebarView, setSidebarView, filterPath, setFilterPath, viewMode, setViewMode } = useEditorUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const isOverview = location.pathname.endsWith("/overview");
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const enchantment = currentElement && isVoxel(currentElement, "enchantment") ? currentElement : undefined;
    const elements = useElementsByType("enchantment");
    const tree = buildEnchantmentTree(elements, sidebarView);
    const folderIcons = sidebarView === "slots" ? SLOT_FOLDER_ICONS : sidebarView === "items" ? ITEM_FOLDER_ICONS : undefined;

    const handleBack = () => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } });
    const handleTreeSelect = (path: string) => {
        setFilterPath(path);
        if (!isOverview) {
            navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } });
        }
    };
    const handleElementSelect = (elementId: string) => {
        useConfiguratorStore.getState().setCurrentElementId(elementId);
        navigate({ to: "/$lang/studio/editor/enchantment/main", params: { lang } });
    };

    return (
        <div className="flex size-full overflow-hidden relative z-10 isolate">
            <EditorSidebar
                title="enchantment:overview.title"
                icon="/images/features/item/enchanted_book.webp"
                linkTo="/$lang/studio/editor/enchantment/overview">
                <ToggleGroup value={sidebarView} onChange={setSidebarView} className="mt-4">
                    <ToggleGroupOption value="slots">
                        <Translate content="enchantment:overview.sidebar.slots" />
                    </ToggleGroupOption>
                    <ToggleGroupOption value="items">
                        <Translate content="enchantment:overview.sidebar.items" />
                    </ToggleGroupOption>
                    <ToggleGroupOption value="exclusive">
                        <Translate content="enchantment:overview.sidebar.exclusive" />
                    </ToggleGroupOption>
                </ToggleGroup>
                <FileTree
                    tree={tree}
                    activePath={filterPath}
                    onSelect={handleTreeSelect}
                    onElementSelect={handleElementSelect}
                    elementIcon={ENCHANTMENT_ICON}
                    folderIcons={folderIcons}
                />
            </EditorSidebar>

            <main className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                <EditorHeader
                    fallbackTitle="Enchantment"
                    identifier={enchantment?.identifier}
                    filterPath={filterPath}
                    isOverview={isOverview}
                    onBack={handleBack}>
                    <Link
                        to="/$lang/studio/editor/enchantment/simulation"
                        params={{ lang }}
                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 rounded-lg text-sm transition-colors cursor-pointer">
                        Simulation
                    </Link>

                    <ToggleGroup value={viewMode} onChange={setViewMode}>
                        <ToggleGroupOption
                            value="grid"
                            icon={<img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="" />}
                        />
                        <ToggleGroupOption
                            value="list"
                            icon={<img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="" />}
                        />
                    </ToggleGroup>
                </EditorHeader>

                <Outlet />
            </main>
        </div>
    );
}
