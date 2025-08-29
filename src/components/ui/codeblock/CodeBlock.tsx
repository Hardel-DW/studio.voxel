import ButtonCopy from "@/components/ui/codeblock/ButtonCopy";
import ButtonDownload from "@/components/ui/codeblock/ButtonDownload";
import HighlightSection from "@/components/ui/codeblock/HighlightSection";
import { cn } from "@/lib/utils";

export default function CodeBlock(props: { children: string; language: string; title?: string; className?: string }) {
    return (
        <div className={cn("relative w-full h-full py-4 pl-4 pr-px bg-zinc-950/20 rounded-2xl border-zinc-800 border", props.className)}>
            <div className="absolute z-10 top-0 right-0 m-4">
                <div className="flex flex-col gap-y-4">
                    <ButtonCopy snippet={props.children} />
                    <ButtonDownload snippet={props.children} />
                </div>
            </div>
            <div className="flex h-4 mr-16">
                <div className="flex items-center z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                </div>
                <div className="flex items-center justify-center w-full text-sm font-medium z-20 text-ellipsis whitespace-nowrap m-0 p-0 text-center">
                    {props.title && <span className="text-secondary">{props.title}</span>}
                </div>
            </div>
            <div className="overflow-auto h-full w-full z-10">
                <div className="h-auto text-white pt-4 bg-transparent border-none text-base relative overflow-hidden">
                    <HighlightSection language={props.language}>{props.children}</HighlightSection>
                </div>
            </div>
        </div>
    );
}
