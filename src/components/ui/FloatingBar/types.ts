import type { ReactNode } from "react";

export interface FloatingBarButton {
    id: string;
    icon: string;
    tooltip?: string;
    onClick: () => void;
    variant?: "default" | "primary" | "secondary";
    disabled?: boolean;
}

export interface FloatingBarSearchConfig {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
}

export interface FloatingBarContent {
    searchConfig?: FloatingBarSearchConfig;
    buttons?: FloatingBarButton[];
    customContent?: ReactNode;
}

export interface FloatingBarContextValue {
    content: FloatingBarContent | null;
    isVisible: boolean;
    setContent: (content: FloatingBarContent | null) => void;
    addButton: (button: FloatingBarButton) => void;
    removeButton: (buttonId: string) => void;
    setSearchConfig: (config: FloatingBarSearchConfig | null) => void;
    show: () => void;
    hide: () => void;
    clear: () => void;
}
