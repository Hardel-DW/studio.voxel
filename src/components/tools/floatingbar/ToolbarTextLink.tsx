import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import Translate from "../../ui/Translate";

interface ToolbarTextLinkProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, "onClick" | "to" | "lang"> {
    icon: string;
    tooltip?: string;
    onClick?: () => void;
    disabled?: boolean;
    labelText: string;
    to: string;
    lang: string;
}

export function ToolbarTextLink(props: ToolbarTextLinkProps) {
    return (
        <Link
            {...props}
            to={props.to}
            params={{ lang: props.lang }}
            onClick={props.onClick}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={props.disabled}
            title={props.tooltip}
            className={cn(
                "h-10 px-3 select-none user-select-none hover:bg-zinc-800/50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 border border-zinc-700/50",
                props.className
            )}>
            <img src={props.icon} alt="" className="w-4 h-4 invert opacity-75 select-none user-select-none" />
            <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                <Translate content={props.labelText} />
            </span>
        </Link>
    );
}
