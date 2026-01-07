import { useRef, useState } from "react";
import { tokenizeJSON } from "@/lib/utils/json-tokenizer";
import { cn } from "@/lib/utils";

interface JsonError {
    message: string;
    line: number;
}

interface JsonEditorProps {
    initialValue: string;
    className?: string;
}

const TOKEN_HIGHLIGHT_NAMES = {
    string: "json-string",
    number: "json-number",
    boolean: "json-boolean",
    null: "json-null",
    property: "json-property",
    punctuation: "json-punctuation"
} as const;

function parseJsonError(error: SyntaxError, content: string): JsonError {
    const match = error.message.match(/position (\d+)/i);
    if (match) {
        const position = Number.parseInt(match[1], 10);
        const line = content.slice(0, position).split("\n").length;
        return { message: error.message, line };
    }
    return { message: error.message, line: 1 };
}

function validateJson(content: string): JsonError | null {
    if (!content.trim()) return null;
    try {
        JSON.parse(content);
        return null;
    } catch (e) {
        if (e instanceof SyntaxError) {
            return parseJsonError(e, content);
        }
        return { message: "Invalid JSON", line: 1 };
    }
}

function applyHighlights(element: HTMLElement): () => void {
    if (!CSS.highlights) {
        console.warn("CSS Custom Highlight API not supported");
        return () => { };
    }

    const text = element.textContent ?? "";
    const tokens = tokenizeJSON(text);
    const tokensByType = Map.groupBy(tokens.filter((t) => t.type !== "whitespace"), (t) => t.type);
    const createdHighlights: string[] = [];
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        textNodes.push(node as Text);
        node = walker.nextNode();
    }

    if (textNodes.length === 0) return () => { };
    const positionMap: Array<{ node: Text; localOffset: number }> = [];
    let globalOffset = 0;
    for (const textNode of textNodes) {
        const length = textNode.textContent?.length ?? 0;
        for (let i = 0; i < length; i++) {
            positionMap[globalOffset + i] = { node: textNode, localOffset: i };
        }
        globalOffset += length;
    }

    for (const [type, typeTokens] of tokensByType) {
        if (!typeTokens) continue;
        const highlightName = TOKEN_HIGHLIGHT_NAMES[type as keyof typeof TOKEN_HIGHLIGHT_NAMES];
        if (!highlightName) continue;

        const ranges: Range[] = [];
        let currentPos = 0;

        for (const token of tokens) {
            if (token.type === type) {
                const start = positionMap[currentPos];
                const end = positionMap[currentPos + token.value.length - 1];

                if (start && end) {
                    const range = new Range();
                    range.setStart(start.node, start.localOffset);
                    range.setEnd(end.node, end.localOffset + 1);
                    ranges.push(range);
                }
            }
            currentPos += token.value.length;
        }

        if (ranges.length > 0) {
            const highlight = new Highlight(...ranges);
            CSS.highlights.set(highlightName, highlight);
            createdHighlights.push(highlightName);
        }
    }

    return () => {
        for (const name of createdHighlights) {
            CSS.highlights.delete(name);
        }
    };
}

function LineNumbers({ count, errorLine }: { count: number; errorLine: number | null }) {
    return (
        <div className="shrink-0 select-none text-right pr-4 border-r border-zinc-800/50 text-zinc-600 font-[Consolas] text-sm leading-6">
            {Array.from({ length: count }, (_, i) => {
                const lineNum = i + 1;
                return (
                    <div key={`line-${lineNum}`} className={cn(errorLine === lineNum && "text-red-400 bg-red-500/10")}>
                        {lineNum}
                    </div>
                );
            })}
        </div>
    );
}

export default function JsonEditor({ initialValue, className }: JsonEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const cleanupRef = useRef<() => void>(() => { });
    const [error, setError] = useState<JsonError | null>(() => validateJson(initialValue));
    const [lineCount, setLineCount] = useState(() => initialValue.split("\n").length);

    const updateHighlights = () => {
        if (!editorRef.current) return;
        cleanupRef.current();
        cleanupRef.current = applyHighlights(editorRef.current);
    };

    const handleInput = () => {
        if (!editorRef.current) return;
        const content = editorRef.current.textContent ?? "";
        setError(validateJson(content));
        setLineCount(content.split("\n").length || 1);
        updateHighlights();
    };

    const insertText = (text: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
        }

        if (e.key === "Tab") {
            e.preventDefault();
            insertText("    ");
            handleInput();
        }
    };

    const handleRef = (el: HTMLDivElement | null) => {
        editorRef.current = el;
        if (el) {
            requestAnimationFrame(() => {
                cleanupRef.current = applyHighlights(el);
            });
        }
    };

    return (
        <div className={cn("relative flex flex-col h-full overflow-hidden", className)}>
            {error && (
                <div className="absolute top-2 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-sm rounded-lg">
                    <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <span>
                        Line {error.line}: {error.message}
                    </span>
                </div>
            )}

            <div className="flex-1 flex overflow-auto">
                <LineNumbers count={lineCount} errorLine={error?.line ?? null} />

                {/* biome-ignore lint/a11y/noStaticElementInteractions: contentEditable div acts as text editor */}
                <div
                    ref={handleRef}
                    contentEditable="plaintext-only"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className={cn(
                        "flex-1 px-4 outline-none",
                        "font-[Consolas] text-sm leading-6",
                        "whitespace-pre text-zinc-300",
                        "caret-zinc-100 selection:bg-blue-500/30"
                    )}
                    suppressContentEditableWarning>
                    {initialValue}
                </div>
            </div>
        </div>
    );
}
