import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white dark:bg-black">
      <Hero />
      <ValueProps />
    </main>
  );
}
