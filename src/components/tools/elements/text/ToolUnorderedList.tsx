import ToolListItem from "@/components/tools/elements/text/ToolListItem";
import { getKey } from "@voxelio/breeze";
import type { UnorderedListChildren } from "@voxelio/breeze/core";

export default function ToolUnorderedList({ sublist }: { sublist: UnorderedListChildren[] }) {
    const renderChild = (child: UnorderedListChildren) => {
        switch (child.type) {
            case "ListItem":
                return <ToolListItem key={getKey(child.content)} content={child.content} />;
            case "UnorderedList":
                return <ToolUnorderedList key={`list-${Math.random()}`} sublist={child.sublist} />;
            default:
                return null;
        }
    };

    return <ul className="list-disc list-inside space-y-2">{sublist.map(renderChild)}</ul>;
}
