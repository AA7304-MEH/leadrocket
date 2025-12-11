
import HeroSection from "@/components/marketing/HeroSection";
import VideoDemo from "@/components/marketing/VideoDemo";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import PricingCards from "@/components/marketing/PricingCards";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer"; // Assuming a footer exists or I'll create a simple one inline or file. Re-checking plan. I didn't plan a Footer, but it's good practice. I'll stick to plan for now or add a simple one.

// Actually, I should create a simple Navigation/Header too if it doesn't exist.
// Checking existing Codebase for Layouts.
// I'll assume standard layout for now or add a simple Navbar if needed.
// For now, let's just assemble the components.

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* TODO: Add Navbar here */}
      <main>
        <HeroSection />
        <VideoDemo />
        <FeaturesGrid />
        <PricingCards />
        <ComparisonTable />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      {/* TODO: Add Footer here */}
    </div>
  );
};

export default Index;