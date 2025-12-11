
import PricingCards from "@/components/marketing/PricingCards";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";

const Pricing = () => {
    return (
        <div className="bg-white">
            <div className="pt-24 pb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Simple, transparent pricing
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    No hidden fees. No contracts. Cancel anytime.
                </p>
            </div>
            <PricingCards />
            <FAQ />
            <FinalCTA />
        </div>
    );
};

export default Pricing;
