import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";

interface ToolbarDropdownOption {
    value: string;
    label: string;
    description?: string;
}

interface ToolbarDropdownProps {
    icon: string;
    tooltip: string;
    value: string;
    options: ToolbarDropdownOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function ToolbarDropdown({ icon, tooltip, value, options, onChange, disabled }: ToolbarDropdownProps) {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={disabled}
                    title={tooltip}
                    className="h-10 px-3 select-none user-select-none hover:bg-zinc-800/50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 border border-zinc-700/50">
                    <img src={icon} alt="" className="w-4 h-4 invert opacity-75 select-none user-select-none" />
                    <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                        {selectedOption?.label || "Select"}
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[150px] -translate-y-4">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={value === option.value ? "bg-zinc-900 text-zinc-100" : ""}>
                        <div className="flex items-center w-full gap-3">
                            {value === option.value && (
                                <img 
                                    src="/icons/valid.svg" 
                                    alt="Selected" 
                                    className="h-4 w-4 flex-shrink-0"
                                />
                            )}
                            {value !== option.value && <div className="h-4 w-4 flex-shrink-0" />}
                            <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                {option.description && (
                                    <span className="text-xs text-zinc-400">{option.description}</span>
                                )}
                            </div>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
