import { Preloader } from "@/components/sections/Preloader";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Doors } from "@/components/sections/Doors";
import { Story } from "@/components/sections/Story";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[var(--foreground)] selection:text-[var(--background)]">
      <Preloader />
      <Header />
      <Hero />
      <Doors />
      <Story />
      <Contact />
    </main>
  );
}
