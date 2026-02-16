"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

export type Option = {
    label: string;
    value: string;
};

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
    className = "",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleRemove = (value: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(selected.filter((item) => item !== value));
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div
                className="relative flex min-h-[38px] w-full cursor-pointer flex-wrap items-center justify-between rounded-md border border-zinc-300 bg-white py-1.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600 sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
                onClick={() => setOpen(!open)}
            >
                {selected.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {selected.map((value) => {
                            const option = options.find((o) => o.value === value);
                            return (
                                <span
                                    key={value}
                                    className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    {option?.label || value}
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemove(value, e)}
                                        className="ml-1 inline-flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus:bg-zinc-500 focus:text-white dark:hover:bg-zinc-700 dark:hover:text-white"
                                    >
                                        <X className="h-2 w-2" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    <span className="text-zinc-500 dark:text-zinc-400">{placeholder}</span>
                )}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                </span>
            </div>

            {open && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-zinc-900 dark:ring-zinc-700">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-red-50 dark:hover:bg-red-900/20 ${selected.includes(option.value)
                                ? "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200"
                                : "text-zinc-900 dark:text-zinc-100"
                                }`}
                            onClick={(e) => handleSelect(option.value, e)}
                        >
                            <div className="flex items-center pointer-events-none">
                                <span className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${selected.includes(option.value) ? 'border-red-600 bg-red-600 text-white' : 'border-zinc-300 dark:border-zinc-600'}`}>
                                    {selected.includes(option.value) && <Check className="h-3 w-3" />}
                                </span>
                                <span className={`block truncate ${selected.includes(option.value) ? "font-semibold" : "font-normal"}`}>
                                    {option.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
