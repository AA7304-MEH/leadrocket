
import Header from "@/components/marketing/Header";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import PricingCards from "@/components/marketing/PricingCards";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import Testimonials from "@/components/marketing/Testimonials";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";

const LandingPage = () => {
    return (
        <div className="bg-white">
            <Header />
            <main>
                <HeroSection />
                <FeaturesGrid />
                <PricingCards />
                <ComparisonTable />
                <Testimonials />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
