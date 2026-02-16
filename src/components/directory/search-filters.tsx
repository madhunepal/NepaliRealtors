"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { US_STATES } from "@/lib/data";

const ROLES = [
    { label: "All Pros", value: "all" },
    { label: "Realtors", value: "realtor" },
    { label: "Loan Officers", value: "loan_officer" },
    { label: "Inspectors", value: "inspector" },
    { label: "Builders", value: "builder" },
];

const LANGUAGES = [
    "Nepali",
    "English",
    "Newari",
    "Hindi",
    "Maithili",
    "Gurung",
    "Tamang",
];

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [showFilters, setShowFilters] = useState(false);

    // Initialize state from URL params
    const initialSearch = searchParams.get("q") || "";
    const initialCity = searchParams.get("city") || "";
    const initialRole = searchParams.get("category") || "all";
    const initialLang = searchParams.get("lang") || "";
    const initialVerified = searchParams.get("verified") === "true";

    const handleSearch = useDebouncedCallback((term: string) => {
        updateParams({ q: term });
    }, 300);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        startTransition(() => {
            router.replace(`/directory?${params.toString()}`);
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 mb-8">
            {/* Top Row: Search & City */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                    <input
                        type="text"
                        defaultValue={initialSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by name or bio..."
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    />
                </div>

                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                    <input
                        type="text"
                        defaultValue={initialCity}
                        onChange={(e) => updateParams({ city: e.target.value })}
                        placeholder="City (e.g., Dallas)"
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    />
                </div>

                <div className="flex-1 relative">
                    <select
                        defaultValue={searchParams.get("state") || ""}
                        onChange={(e) => updateParams({ state: e.target.value })}
                        className="w-full h-10 pl-3 pr-8 rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none appearance-none"
                    >
                        <option value="">All States (USA)</option>
                        {US_STATES.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center px-4 py-2 rounded-md border ${showFilters ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-400' : 'border-zinc-300 dark:border-zinc-700'} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Professional Role
                        </label>
                        <select
                            defaultValue={initialRole}
                            onChange={(e) => updateParams({ category: e.target.value })}
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 p-2 text-sm"
                        >
                            {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Language Filter */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Language Spoken
                        </label>
                        <select
                            defaultValue={initialLang}
                            onChange={(e) => updateParams({ lang: e.target.value })}
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 p-2 text-sm"
                        >
                            <option value="">Any Language</option>
                            {LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>



                    {/* Verified Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Verification Status
                        </label>
                        <div className="flex items-center h-[38px] px-3 rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
                            <label className="flex items-center cursor-pointer w-full">
                                <input
                                    type="checkbox"
                                    defaultChecked={initialVerified}
                                    onChange={(e) => updateParams({ verified: e.target.checked ? "true" : null })}
                                    className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-600"
                                />
                                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-100">Verified Pros Only</span>
                            </label>
                        </div>
                    </div>
                </div>


            )}

            {/* Active Filters Display (Optional for UX) */}
            {(initialCity || initialLang || initialVerified || searchParams.get("state") || (initialRole && initialRole !== 'all')) && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {initialRole !== 'all' && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            Role: {ROLES.find(r => r.value === initialRole)?.label}
                            <button onClick={() => updateParams({ category: 'all' })} className="ml-1 hover:text-blue-900"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {searchParams.get("state") && (
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                            State: {searchParams.get("state")}
                            <button onClick={() => updateParams({ state: null })} className="ml-1 hover:text-indigo-900"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {initialCity && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            City: {initialCity}
                            <button onClick={() => updateParams({ city: null })} className="ml-1 hover:text-green-900"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {initialLang && (
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                            Language: {initialLang}
                            <button onClick={() => updateParams({ lang: null })} className="ml-1 hover:text-purple-900"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {initialVerified && (
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            Verified Only
                            <button onClick={() => updateParams({ verified: null })} className="ml-1 hover:text-yellow-900"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    <button
                        onClick={() => {
                            const params = new URLSearchParams();
                            startTransition(() => { router.replace(`/directory`); });
                        }}
                        className="text-xs text-zinc-500 underline hover:text-zinc-900"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
}
