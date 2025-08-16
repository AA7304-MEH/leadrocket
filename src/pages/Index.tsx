import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <GuaranteeSection />
      <FinalCtaSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Index;