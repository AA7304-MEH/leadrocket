import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export const FinalCtaSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Stop Chasing Leads?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Join 500+ founders who are already getting qualified leads delivered to their inbox every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 shadow-premium"
            >
              Start Getting Leads Tomorrow
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Strategy Call
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No spam, no sales calls. Just qualified leads ready to buy.
          </p>
        </div>
      </div>
    </section>
  );
};