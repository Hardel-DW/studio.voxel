import type React from "react";
import NavigationContent from "@/components/layout/navbar/NavigationContent";
import NavigationTrigger from "@/components/layout/navbar/NavigationTrigger";

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
