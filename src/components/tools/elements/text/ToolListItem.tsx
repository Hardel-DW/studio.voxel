import Translate from "@/components/tools/Translate";
import type { TranslateTextType } from "@voxelio/breeze/core";

export default function ToolListItem({ content }: { content: TranslateTextType | string }) {
    return (
        <li className="text-zinc-400">
            <Translate content={content} schema={true} />
        </li>
    );
}
