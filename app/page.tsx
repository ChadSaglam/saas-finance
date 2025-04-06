import { NavBar } from "@/components/marketing/NavBar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeatureSection } from "@/components/marketing/FeatureSection";
import { TestimonialSection } from "@/components/marketing/TestimonialSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CtaSection } from "@/components/marketing/CtaSection";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <NavBar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}