import { Shield, TrendingUp } from "lucide-react";

export const GuaranteeSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-hero border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Our Iron-Clad Guarantee
            </h3>
            
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get 50 qualified leads in Week 1 — or get 50% off your next month. No questions asked.
            </p>
            
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>96% of customers see results in their first week</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};