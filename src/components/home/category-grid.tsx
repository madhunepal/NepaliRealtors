import Link from "next/link";
import { Home, Banknote, ClipboardCheck, ArrowRight } from "lucide-react";

const categories = [
    {
        name: "Real Estate Agents",
        description: "Find expert agents to help you buy or sell your home.",
        icon: Home,
        href: "/directory?role=agent",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
        name: "Mortgage Lenders",
        description: "Get the best rates and loan options for your budget.",
        icon: Banknote,
        href: "/directory?role=lender",
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
        name: "Home Inspectors",
        description: "Ensure your future home is safe and sound.",
        icon: ClipboardCheck,
        href: "/directory?role=inspector",
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
];

export function CategoryGrid() {
    return (
        <div className="bg-zinc-50 dark:bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Everything You Need to Buy a Home
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        We bring together the entire ecosystem of Nepali real estate professionals.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:ring-zinc-700"
                        >
                            <div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor}`}>
                                    <category.icon className={`h-6 w-6 ${category.color}`} aria-hidden="true" />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold leading-8 text-zinc-900 dark:text-zinc-50">
                                    {category.name}
                                </h3>
                                <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                    {category.description}
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-x-2 text-sm font-semibold leading-6 text-red-600 group-hover:text-red-500">
                                Find Pros <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
