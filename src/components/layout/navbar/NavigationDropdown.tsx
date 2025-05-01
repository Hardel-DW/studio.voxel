import type React from "react";
import NavigationContent from "./NavigationContent";
import NavigationTrigger from "./NavigationTrigger";

interface Props extends React.LiHTMLAttributes<HTMLLIElement> {
    label: string;
    children: React.ReactNode;
}

export default function NavigationDropdown({ label, children, className, ...props }: Props) {
    return (
        <li className={`relative group/dropdown ${className || ""}`} {...props}>
            <NavigationTrigger>{label}</NavigationTrigger>
            <div className="absolute hidden group-hover/dropdown:flex top-full left-0 mt-1">
                <NavigationContent>{children}</NavigationContent>
            </div>
        </li>
    );
}
