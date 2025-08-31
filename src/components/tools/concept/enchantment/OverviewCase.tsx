import type { TranslateTextType } from "@/components/tools/Translate";
import Translate from "@/components/tools/Translate";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";

type OverviewCaseProps = BaseInteractiveComponent & {
    image: string;
    tag: string;
    title: TranslateTextType;
};

export default function OverviewCase(props: OverviewCaseProps) {
    const { value } = useInteractiveLogic<OverviewCaseProps, boolean>({ component: props }, props.elementId);
    if (value === false) return null;

    return (
        <Popover>
            <PopoverTrigger>
                <img key={props.tag} src={props.image} alt="Tag" className="w-4 h-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-zinc-400">
                        <Translate content={props.title} />
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
