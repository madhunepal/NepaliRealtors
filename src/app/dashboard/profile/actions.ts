"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    fullName: z.string().min(2),
    bio: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    licenseNumber: z.string().optional().or(z.literal("")),
    website: z.string().optional().transform(val => {
        if (!val) return null;
        if (val.startsWith("http://") || val.startsWith("https://")) return val;
        return `https://${val}`;
    }).pipe(z.string().url().optional().or(z.literal("").transform(() => null))),
    phone: z.string().optional(),
    languages: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    isPhonePublic: z.boolean().optional(),
    isEmailPublic: z.boolean().optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
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

        const validated = profileSchema.safeParse(rawData);

        if (!validated.success) {
            return { error: validated.error.flatten().fieldErrors };
        }

        const data = validated.data;

        // 1. Update Profile Name & Role
        const role = data.services && data.services.length > 0 ? data.services.join(" & ") : "Professional";

        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                full_name: data.fullName,
                role: role,
            })
            .eq("id", user.id);

        if (profileError) {
            return { error: profileError.message };
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
            return { error: detailsError.message };
        }

        revalidatePath("/dashboard/profile");
        // revalidatePath(`/pro/${user.user_metadata?.slug}`);

        return { success: "Profile updated successfully!" };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}
