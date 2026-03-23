import { HeroSection } from "@/components/shinjeong/hero-section"
import { StatsSection } from "@/components/shinjeong/stats-section"
import { FeaturesSection } from "@/components/shinjeong/features-section"
import { SiteFooter } from "@/components/shinjeong/site-footer"
import { ShinjeongFixedCTA } from "@/components/shinjeong/fixed-cta"

export default function ShinjeongPage() {
  return (
    <>
      <main className="min-h-screen pb-20">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <SiteFooter />
      </main>
      <ShinjeongFixedCTA />
    </>
  )
}
