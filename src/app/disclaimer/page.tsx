import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Disclaimer - MeroGharInUSA",
    description: "Legal Disclaimer for MeroGharInUSA.",
};

export default function DisclaimerPage() {
    return (
        <div className="bg-white px-6 py-32 lg:px-8 dark:bg-black">
            <div className="mx-auto max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">Disclaimer</h1>
                <div className="mt-10 max-w-2xl space-y-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/10 dark:border-yellow-600">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                    <strong>Important Notice:</strong> MeroGharInUSA is an independent directory and information service.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Not a Brokerage</h2>
                        <p className="mt-4">
                            MeroGharInUSA is <strong>not</strong> a real estate broker, mortgage broker, lender, or insurance agent. We do not buy (or sell) homes or provide any brokerage services. We help you connect with local professionals who can help you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">No Professional Advice</h2>
                        <p className="mt-4">
                            The information provided on this website is for general informational purposes only. It should not be considered legal, financial, or real estate advice. You should consult with a qualified professional before making any financial or legal decisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Verification of Professionals</h2>
                        <p className="mt-4">
                            While we verify that professionals on our platform have active licenses at the time of registration, license status can change. We recommend that you independently verify the license status and qualifications of any professional you choose to hire.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Third-Party Links</h2>
                        <p className="mt-4">
                            This website may contain links to third-party websites. We are not responsible for the content or practices of these third-party sites.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
