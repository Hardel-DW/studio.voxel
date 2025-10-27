import { useConfiguratorStore } from "@/components/tools/Store";
import Translate from "@/components/ui/Translate";

export default function SettingsDialog() {
    const name = useConfiguratorStore((state) => state.name);
    const isModded = useConfiguratorStore((state) => state.isModded);

    return (
        <div>
            <div className="py-2">
                <span className="font-semibold text-zinc-400">{`${name}.${isModded ? "jar" : "zip"}`}</span>
            </div>
            <div className="h-1 w-full bg-zinc-700 rounded-full" />
            <div className="pt-8">
                <h4 className="font-semibold">
                    <Translate content="settings.additional_info.title" />
                </h4>
                <ul className="list-disc list-inside pt-4 space-y-2 pl-4">
                    <li>
                        <span className="font-light">
                            <Translate content="settings.additional_info.description" />
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
