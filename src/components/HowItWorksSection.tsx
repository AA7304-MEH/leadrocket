import { Brain, TrendingUp, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Brain,
    title: "Define Your Ideal Customer",
    description: "You define your ideal customer (industry, size, tech stack)",
    step: "01"
  },
  {
    icon: TrendingUp,
    title: "AI Finds Intent Signals",
    description: "Our AI finds buying intent signals (hiring, funding, tech changes)",
    step: "02"
  },
  {
    icon: Mail,
    title: "Verified Leads Delivered",
    description: "We deliver verified leads daily to your inbox",
    step: "03"
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-gradient-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/20 rounded-full" />
        <div className="absolute bottom-20 right-16 w-24 h-24 border border-primary/20 rounded-full" />
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-primary/20 rounded-full" />
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
            ⚡ Lightning Fast Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From targeting to delivery, our AI handles the entire lead generation process
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-card p-8 rounded-2xl shadow-elegant hover:shadow-floating transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slide-up border border-primary/5"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 z-10" />
              )}
              
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4 shadow-glow group-hover:animate-pulse-glow">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                </div>
                <div className="text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to see it in action?
          </p>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 px-8 py-3">
            Watch Demo Video
          </Button>
        </div>
      </div>
    </section>
  );
};