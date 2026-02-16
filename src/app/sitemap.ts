import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://merogharinusa.com";
    const supabase = await createClient();

    // Get all verified professionals for the sitemap
    const { data: pros } = await supabase
        .from("profiles")
        .select("slug, updated_at")
        .eq("role", "professional") // Or specific roles
        .not("slug", "is", null);

    const proUrls = (pros || []).map((pro) => ({
        url: `${baseUrl}/pro/${pro.slug}`,
        lastModified: new Date(pro.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/directory`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        ...proUrls,
    ];
}
