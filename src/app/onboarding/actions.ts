"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const onboardingSchema = z.object({
    fullName: z.string().min(2),
    bio: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    licenseNumber: z.string().optional().or(z.literal("")),
    website: z.string().optional().or(z.literal("")).transform(val => {
        if (!val) return null;
        if (val.startsWith("http://") || val.startsWith("https://")) return val;
        return `https://${val}`;
    }).pipe(z.string().url().nullable()),
    phone: z.string().optional(),
    languages: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    isPhonePublic: z.boolean().optional(),
    isEmailPublic: z.boolean().optional(),
});

export async function completeOnboarding(prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Not authenticated" };
        }

        const rawData = {
            fullName: formData.get("fullName"),
            bio: formData.get("bio"),
            city: formData.get("city"),
            state: formData.get("state"),
            licenseNumber: formData.get("licenseNumber"),
            website: formData.get("website"),
            phone: formData.get("phone"),
            languages: formData.getAll("languages"),
            services: formData.getAll("services"),
            isPhonePublic: formData.get("isPhonePublic") === "on",
            isEmailPublic: formData.get("isEmailPublic") === "on",
        };

        const validated = onboardingSchema.safeParse(rawData);

        if (!validated.success) {
            return { error: validated.error.flatten().fieldErrors };
        }

        const data = validated.data;

        // 1. Ensure Profile Exists & Update
        const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single();

        const role = data.services && data.services.length > 0 ? data.services.join(" & ") : "Professional";

        if (!existingProfile) {
            // Create Profile if missing (Fallback for failed triggers/legacy users)
            const slug = data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Math.floor(Math.random() * 1000);
            const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    email: user.email!, // Authenticated user must have email
                    full_name: data.fullName,
                    role: role,
                    slug: slug,
                });

            if (insertError) {
                console.error("Profile insert error", insertError);
                return { error: `Failed to create profile: ${insertError.message}` };
            }
        } else {
            // Update existing profile
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    full_name: data.fullName,
                    role: role,
                })
                .eq("id", user.id);

            if (updateError) {
                return { error: "Failed to update profile" };
            }
        }

        // 2. Upsert Professional Details
        const { error: detailsError } = await supabase
            .from("professional_details")
            .upsert({
                id: user.id,
                bio: data.bio,
                city: data.city,
                state: data.state,
                license_number: data.licenseNumber,
                website: data.website,
                phone: data.phone,
                languages: data.languages,
                services: data.services,
                is_phone_public: data.isPhonePublic,
                is_email_public: data.isEmailPublic,
            });

        if (detailsError) {
            console.error("Details error", detailsError);
            return { error: `Failed to update professional details: ${detailsError.message}` };
        }

        revalidatePath("/dashboard");
        revalidatePath(`/pro/${user.user_metadata?.slug}`);
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }

    redirect("/dashboard");
}
