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
    licenseNumber: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    phone: z.string().optional(),
});

export async function completeOnboarding(prevState: any, formData: FormData) {
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

    if (!existingProfile) {
        // Create Profile if missing (Fallback for failed triggers/legacy users)
        const slug = data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Math.floor(Math.random() * 1000);
        const { error: insertError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                email: user.email!, // Authenticated user must have email
                full_name: data.fullName,
                role: user.user_metadata?.role || 'realtor',
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
            is_phone_public: true, // Default to true for now
        });

    if (detailsError) {
        console.error("Details error", detailsError);
        return { error: `Failed to update professional details: ${detailsError.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/pro/${user.user_metadata?.slug}`); // Attempt to revalidate profile if slug known
    redirect("/dashboard");
}
