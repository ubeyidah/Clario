import Features from "./_components/features";
import HeroSection from "./_components/hero-section";

export default function Home() {
  return (
    <main className="bg-muted/50 dark:bg-background">
      <HeroSection />
      <Features />
    </main>
  );
}
