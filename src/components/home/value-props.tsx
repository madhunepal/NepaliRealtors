import { Search, MessageSquare, Handshake } from "lucide-react";

const features = [
    {
        name: "Search / खोज्नुहोस्",
        description:
            "Browse profiles by location, profession (Realtor, Loan Officer, Inspector), and language. Find someone who speaks your language—literally and culturally.",
        icon: Search,
    },
    {
        name: "Connect / सम्पर्क गर्नुहोस्",
        description:
            "Send a secure message directly through our platform. Your private contact details remain hidden until you decide to share them.",
        icon: MessageSquare,
    },
    {
        name: "Collaborate / सहकार्य गर्नुहोस्",
        description:
            "Work with a professional who understands your goals, your questions, and your background. Verified experts you can trust.",
        icon: Handshake,
    },
];

export function ValueProps() {
    return (
        <div className="bg-white dark:bg-zinc-900 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-red-600">HOW IT WORKS</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Verified for Your Peace of Mind
                    </p>
                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        We know that trust is everything. That’s why every professional with the Verified Badge on our platform has undergone a manual review process.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
