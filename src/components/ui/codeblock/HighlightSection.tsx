import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { premium as syntax } from "@/lib/utils/theme";

export default function HighlightSection(props: { children: string; language: string }) {
    return (
        <SyntaxHighlighter language={props.language} style={syntax} wrapLongLines={true} showLineNumbers={true}>
            {props.children}
        </SyntaxHighlighter>
    );
}
