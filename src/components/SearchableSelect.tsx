import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';


interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder, className, disabled, required }: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync internal input value with external value if it matches an option (or is empty)
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
                // If input doesn't match a valid option and we click out, what should happen?
                // For a strict select, we might revert to the last valid value or keep the custom text?
                // Given this is replacing a Select, we probably want strict selection,
                // BUT the specific request "searchable" often implies "autocomplete".
                // If the user types "Region VII", they should be able to select it.
                // If they type garbage, maybe we clear it or keep it?
                // Let's implement strict selection behavior on blur/close:
                // If the current input value EXACTLY matches an option, keep it.
                // If NOT, revert to the last valid `value` prop (or clear if empty).

                // For now, let's just close. The user might want to see what they typed.
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setInputValue(option);
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setOpen(true);
        // If we want to allow clearing by typing empty string:
        if (e.target.value === "") {
            onChange("");
        }
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setInputValue("");
        inputRef.current?.focus();
    };

    return (
        <div ref={wrapperRef} className={cn("relative w-full", className)}>
            <div className="relative">
                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder || "Select..."}
                    className="pr-10 bg-background/50"
                    disabled={disabled}
                    required={required}
                    autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="text-muted-foreground hover:text-foreground rounded-full p-0.5 hover:bg-muted"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                    <ChevronsUpDown className="h-4 w-4 opacity-50 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {open && !disabled && (
                <ul className="absolute z-[200] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-ring/5 space-y-1">
                    {filteredOptions.length === 0 ? (
                        <li className="px-2 py-2 text-sm text-muted-foreground text-center">
                            No matching options
                        </li>
                    ) : (
                        filteredOptions.map((option) => (
                            <li
                                key={option}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                    value === option && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => handleSelect(option)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}
