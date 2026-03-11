import { HeroSection } from "@/components/stockplus/hero-section"
import { AwardSection } from "@/components/stockplus/award-section"
import { TrustSection } from "@/components/stockplus/trust-section"
import { BenefitsSection } from "@/components/stockplus/benefits-section"
import { PerformanceSection } from "@/components/stockplus/performance-section"
import { FixedCTA } from "@/components/stockplus/fixed-cta"
import { Footer } from "@/components/stockplus/footer"

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
