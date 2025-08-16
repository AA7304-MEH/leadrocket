import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export const FinalCtaSection = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 text-center relative animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-accent px-4 py-2 rounded-full text-sm font-medium text-primary mb-8 shadow-elegant">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            🎯 Ready to Transform Your Business?
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight">
            Ready to Stop Chasing Leads?
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Join 500+ founders who are already getting qualified leads delivered to their inbox every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <Button 
              size="lg" 
              className="group text-lg px-10 py-6 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-floating"
            >
              Start Getting Leads Tomorrow
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-6 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Strategy Call
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              No spam, no sales calls
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Just qualified leads ready to buy
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};