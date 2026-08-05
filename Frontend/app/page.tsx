import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/ProductTeaserCard"
import { FeaturesSection } from "@/components/FeaturesSection"
import { HowItWorksSection } from "@/components/HowItWorksSection"
import { BankingScaleHero } from "@/components/BankingScaleHero"
import { TwinNetworkSection } from "@/components/TwinNetworkSection"
import { AIConversationSection } from "@/components/AIConversationSection"
import { CaseStudiesCarousel } from "@/components/CaseStudiesCarousel"
import { UseCasesSection } from "@/components/UseCasesSection"
import { FAQSection } from "@/components/FAQSection"
import { Footer } from "@/components/Footer"

export default function Page() {
  return (
    <>
      <PortfolioNavbar />
      <ProductTeaserCard />
      <FeaturesSection />
      <HowItWorksSection />
      <BankingScaleHero />
      <TwinNetworkSection />
      <AIConversationSection />
      <CaseStudiesCarousel />
      <UseCasesSection />
      <FAQSection />
      <Footer />
    </>
  )
}
