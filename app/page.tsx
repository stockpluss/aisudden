import { HeroSection } from "@/components/hero-section"
import { AwardSection } from "@/components/award-section"
import { TrustSection } from "@/components/trust-section"
import { BenefitsSection } from "@/components/benefits-section"
import { PerformanceSection } from "@/components/performance-section"
import { FixedCTA } from "@/components/fixed-cta"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      <HeroSection />
      <PerformanceSection />
      <TrustSection />
      <BenefitsSection />
      <Footer />
      <FixedCTA />
    </main>
  )
}
