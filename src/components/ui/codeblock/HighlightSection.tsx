import { getTokenColor, processTokensIntoLines, tokenizeJSON } from "@/lib/utils/json-tokenizer";

export default function HighlightSection(props: { children: string; language: string }) {
    if (props.language !== "json") return null;
    const tokens = tokenizeJSON(props.children);
    const lineTokens = processTokensIntoLines(tokens);

    return (
        <pre className="font-[Consolas] text-sm leading-6">
            {lineTokens.map((lineTokenList, lineIndex) => (
                <div key={lineIndex.toString()} className="flex">
                    <span className="w-12 shrink-0 select-none text-right pr-4 border-r border-zinc-800/50 text-zinc-600">
                        {lineIndex + 1}
                    </span>
                    <code className="flex-1 px-4 whitespace-pre">
                        {lineTokenList.map((token, tokenIndex) => (
                            <span key={`${lineIndex}-${tokenIndex}-${token.type}`} style={{ color: getTokenColor(token.type) }}>
                                {token.value}
                            </span>
                        ))}
                        {lineTokenList.length === 0 && <span>&nbsp;</span>}
                    </code>
                </div>
            ))}
        </pre>
    );
}
