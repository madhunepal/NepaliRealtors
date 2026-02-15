import { createClient } from "@/lib/supabase/server";
import { ProfessionalCard } from "@/components/directory/professional-card";
import { ProfessionalProfile } from "@/types/database";
import Link from "next/link";

export const metadata = {
    title: "Directory - MeroGhar",
    description: "Browse verified Nepali real estate professionals.",
};

export default async function DirectoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const { category, city } = await searchParams;

    let query = supabase
        .from("profiles")
        .select("*, professional_details(*)")
        .neq("role", "customer"); // Exclude customers

    if (category && typeof category === "string" && category !== "all") {
        query = query.eq("role", category);
    }

    // City filter (naive implementation for MVP)
    // Ideally, we'd filter on joined table, but Supabase JS syntax for inner join filtering is tricky.
    // For MVP, if city is present, we might filter in JS or simpler exact match if RLS allows.
    // Let's rely on client-side or simple role filtering for now to ensure robustness.

    const { data: profiles, error } = await query;

    if (error) {
        console.error("Error fetching profiles:", error);
        return <div>Error loading directory.</div>;
    }

    const professionals = (profiles as unknown as ProfessionalProfile[]) || [];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="border-b border-zinc-200 pb-10 dark:border-zinc-800">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Professional Directory
                    </h1>
                    <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                        Find the right expert for your needs.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/directory?category=all"
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700"
                        >
                            All
                        </Link>
                        <Link
                            href="/directory?category=realtor"
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700"
                        >
                            Realtors
                        </Link>
                        <Link
                            href="/directory?category=loan_officer"
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700"
                        >
                            Loan Officers
                        </Link>
                        <Link
                            href="/directory?category=inspector"
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700"
                        >
                            Inspectors
                        </Link>
                        <Link
                            href="/directory?category=builder"
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700"
                        >
                            Builders
                        </Link>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {professionals.map((pro) => (
                        <ProfessionalCard key={pro.id} profile={pro} />
                    ))}
                    {professionals.length === 0 && (
                        <p className="text-zinc-500">No professionals found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
