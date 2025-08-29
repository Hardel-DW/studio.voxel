import type React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLUListElement> {}

export default function NavigationList({ className, children, ...props }: Props) {
    return (
        <ul className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)} {...props}>
            {children}
        </ul>
    );
}
