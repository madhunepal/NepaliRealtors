import { completeOnboarding } from "./actions";
import { ProfileForm } from "@/components/profile/profile-form";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Complete Your Profile
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Tell us more about your services to get verified.
                    </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <ProfileForm action={completeOnboarding} submitLabel="Save Profile" />
                </div>
            </div>
        </div>
    );
}
