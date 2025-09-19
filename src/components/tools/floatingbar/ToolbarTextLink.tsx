import { cn } from "@/lib/utils";
import Translate from "../Translate";
import { Link } from "@tanstack/react-router";

interface ToolbarTextLinkProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, "onClick"> {
    icon: string;
    tooltip?: string;
    onClick?: () => void;
    disabled?: boolean;
    labelText: string;
    to: string;
    lang: string;
}

export function ToolbarTextLink({ icon, tooltip, onClick = () => { }, disabled, labelText, className, to, lang, ...props }: ToolbarTextLinkProps) {
    return (
        <Link
            to={to}
            params={{ lang: lang }}
            onClick={onClick}
            {...props}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={disabled}
            title={tooltip}
            className={cn(
                "h-10 px-3 select-none user-select-none hover:bg-zinc-800/50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 border border-zinc-700/50",
                className
            )}>
            <img src={icon} alt="" className="w-4 h-4 invert opacity-75 select-none user-select-none" />
            <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                <Translate content={labelText} />
            </span>
        </Link>
    );
}
