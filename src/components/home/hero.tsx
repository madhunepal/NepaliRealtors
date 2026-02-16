"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/directory?query=${encodeURIComponent(query)}`);
        } else {
            router.push("/directory");
        }
    };

    return (
        <div className="relative isolate overflow-hidden bg-white dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 text-center lg:text-left">
                    <div className="mt-24 sm:mt-32 lg:mt-16">
                        <div className="inline-flex space-x-6">
                            <span className="rounded-full bg-red-600/10 px-3 py-1 text-sm font-semibold leading-6 text-red-600 ring-1 ring-inset ring-red-600/10">
                                Beta v1.0
                            </span>
                        </div>
                    </div>
                    <h1 className="mt-10 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
                        Find Trusted Nepali Real Estate Pros in the USA
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Connect with verified Nepali-speaking agents, lenders, and inspectors who understand your culture and needs.
                        <br />
                        <span className="font-hindi text-base opacity-80 mt-2 block text-red-600 dark:text-red-400">
                            अमेरिकामा भरपर्दो नेपाली घरजग्गा व्यवसायी खोज्नुहोस्।
                        </span>
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mt-10 flex max-w-md mx-auto lg:mx-0 gap-x-4 relative">
                        <div className="relative flex-grow">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 py-3 pl-10 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:ring-zinc-700 dark:text-white"
                                placeholder="Search by city, name, or service..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex-none rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Search
                        </button>
                    </form>

                    <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                        <Link href="/directory" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50 hover:text-red-600 transition-colors">
                            Browse All Pros <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                {/* Image / Graphic Side */}
                <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                        <div className="-m-2 rounded-xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                                alt="App screenshot"
                                width={1200}
                                height={800}
                                className="w-[48rem] rounded-md shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/10 opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
