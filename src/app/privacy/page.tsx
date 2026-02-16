import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - MeroGharInUSA",
    description: "Privacy Policy for MeroGharInUSA.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-white px-6 py-32 lg:px-8 dark:bg-black">
            <div className="mx-auto max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">Privacy Policy</h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <div className="mt-10 max-w-2xl space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. Introduction</h2>
                        <p className="mt-4">
                            MeroGharInUSA ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. Information We Collect</h2>
                        <p className="mt-4">
                            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-2">
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site or choose to participate in various activities related to the Site.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. Use of Your Information</h2>
                        <p className="mt-4">
                            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-2">
                            <li>Create and manage your account.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Enable user-to-user communications.</li>
                            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. Disclosure of Your Information</h2>
                        <p className="mt-4">
                            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-2">
                            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. Contact Us</h2>
                        <p className="mt-4">
                            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:support@merogharinusa.com" className="text-red-600 hover:underline">support@merogharinusa.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
