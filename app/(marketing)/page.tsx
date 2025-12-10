import ContentSection from "./_components/content";
import CTA from "./_components/cta";
import Features from "./_components/features";
import HeroSection from "./_components/hero-section";

export default function Home() {
  return (
    <main className="bg-muted/50 dark:bg-background">
      <HeroSection />
      <Features />
      <ContentSection />
      <CTA />
    </main>
  );
}
