import { HeroSection } from "@/components/sections/hero-section";
import { CatalogSection } from "@/components/sections/catalog-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CatalogSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
