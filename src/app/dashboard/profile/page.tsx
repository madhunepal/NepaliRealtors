import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { updateProfile } from "./actions";

export default async function ProfileSettingsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch existing profile and details
    const { data: profile } = await supabase
        .from("profiles")
        .select("*, professional_details(*)")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/onboarding"); // Should have a profile if in dashboard
    }

    const details = profile.professional_details;

    const initialData = {
        fullName: profile.full_name || "",
        bio: details?.bio || "",
        city: details?.city || "",
        state: details?.state || "",
        licenseNumber: details?.license_number || "",
        website: details?.website || "",
        phone: details?.phone || "",
        languages: details?.languages || [],
        services: details?.services || [],
        isPhonePublic: details?.is_phone_public || false,
        isEmailPublic: details?.is_email_public || false,
        email: profile.email || "",
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Edit Profile
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Update your public profile information.
                    </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <ProfileForm
                        initialData={initialData}
                        action={updateProfile}
                        submitLabel="Save Changes"
                    />
                </div>
            </div>
        </div>
    );
}
