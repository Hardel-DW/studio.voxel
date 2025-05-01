"use client";

import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    onValueChange?: (value: string) => void;
}

export function TextInput({ id, label, onValueChange, ...props }: TextInputProps) {
    return (
        <div className="relative w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-zinc-400 mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type="text"
                onChange={(e) => onValueChange?.(e.target.value)}
                className="w-full border px-4 py-2 text-sm font-normal outline-0 focus-visible:border-fuchsia-700 border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 transition-colors rounded-[0.5rem] shadow-2xl shadow-black"
                {...props}
            />
        </div>
    );
}
