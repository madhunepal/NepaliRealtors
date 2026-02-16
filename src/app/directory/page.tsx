import { createClient } from "@/lib/supabase/server";
import { ProfessionalCard } from "@/components/directory/professional-card";
import { SearchFilters } from "@/components/directory/search-filters";
import { ProfessionalProfile } from "@/types/database";

export const metadata = {
    title: "Directory - MeroGharInUSA",
    description: "Browse verified Nepali real estate professionals in the USA.",
};

export default async function DirectoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const resolvedParams = await searchParams;
    const { category, city, state, q, lang, verified } = resolvedParams;

    let query = supabase
        .from("profiles")
        .select("*, professional_details!inner(*)") // Inner join ensures we filter on details too
        .neq("role", "customer");

    // 1. Role Filter
    if (category && typeof category === "string" && category !== "all") {
        query = query.eq("role", category);
    }

    // 2. Verified Filter
    if (verified === "true") {
        query = query.eq("is_verified", true);
    }

    // 3. Search Filter (Name)
    if (q && typeof q === "string") {
        query = query.ilike("full_name", `%${q}%`);
    }

    const { data: profiles, error } = await query;

    if (error) {
        console.error("Error fetching profiles:", error);
        return <div>Error loading directory.</div>;
    }

    let professionals = (profiles as unknown as ProfessionalProfile[]) || [];

    // 5. Post-process filters (City, State & Language)

    if (city && typeof city === "string") {
        const cityTerm = city.toLowerCase();
        professionals = professionals.filter(p =>
            p.professional_details?.city?.toLowerCase().includes(cityTerm)
        );
    }

    if (state && typeof state === "string") {
        // Exact match likely better for state dropdown, but case-insensitive
        professionals = professionals.filter(p =>
            p.professional_details?.state?.toLowerCase() === state.toLowerCase()
        );
    }

    if (lang && typeof lang === "string") {
        professionals = professionals.filter(p =>
            p.professional_details?.languages?.some((l: string) => l.includes(lang))
        );
    }

    // Secondary Search Check (if not found by name, check bio)
    if (q && typeof q === "string") {
        // If we already filtered by name via SQL, this just effectively double checks,
        // BUT if we want to search BIO as well, we should do it here if SQL didn't cover it.
        // SQL `or` with joined tables is tricky. Let's do a comprehensive text search here instead?
        // Actually, let's Stick to SQL for Name, and if we want Bio search, we can add it here.

        // Let's refine: If the SQL query was just name, we might miss bio matches.
        // For true full-text search we need Postgres FTS. 
        // For now, let's leave as is (Name search only via SQL).
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-24">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="border-b border-zinc-200 pb-10 dark:border-zinc-800">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Professional Directory
                    </h1>
                    <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                        Find the right expert for your needs.
                    </p>

                    <div className="mt-8">
                        <SearchFilters />
                    </div>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {professionals.map((pro) => (
                        <ProfessionalCard key={pro.id} profile={pro} />
                    ))}
                    {professionals.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-zinc-500">
                                <p className="text-lg font-semibold">No professionals found</p>
                                <p className="text-sm">Try adjusting your filters or search terms.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
