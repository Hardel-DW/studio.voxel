import type { CSSProperties } from "react";

/**
 * Constant representing the magical premium theme for react-syntax-highlighter.
 */
export const premium: { [p: string]: CSSProperties } = {
    'code[class*="language-"]': {
        color: "#ccc",
        background: "none",
        fontFamily: "Consolas, Monaco, 'Ubuntu Mono', monospace",
        fontSize: "1em",
        textAlign: "left",
        whiteSpace: "pre",
        wordSpacing: "normal",
        wordBreak: "normal",
        wordWrap: "normal",
        lineHeight: "1.5",
        MozTabSize: "4",
        tabSize: "4",
        WebkitHyphens: "none",
        MozHyphens: "none",
        msHyphens: "none",
        hyphens: "none"
    },
    'pre[class*="language-"]': {
        color: "#ccc",
        fontFamily: "Consolas, Monaco, 'Ubuntu Mono', monospace",
        fontSize: "1em",
        textAlign: "left",
        whiteSpace: "pre",
        wordSpacing: "normal",
        wordBreak: "normal",
        wordWrap: "normal",
        lineHeight: "1.5",
        MozTabSize: "4",
        tabSize: "4",
        WebkitHyphens: "none",
        MozHyphens: "none",
        msHyphens: "none",
        hyphens: "none",
        margin: ".5em 0",
        overflow: "auto"
    },
    "react-syntax-highlighter-line-number": {
        minWidth: "2.25rem",
        paddingRight: "1rem"
    },
    comment: {
        color: "#999"
    },
    "block-comment": {
        color: "#999"
    },
    punctuation: {
        color: "#ccc"
    },
    boolean: {
        color: "#4177e5"
    },
    number: {
        color: "#f08d49"
    },
    property: {
        color: "#d89600"
    },
    string: {
        color: "#d43dab"
    }
};
