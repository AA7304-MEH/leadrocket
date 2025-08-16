import { Brain, TrendingUp, Mail } from "lucide-react";

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
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From targeting to delivery, our AI handles the entire lead generation process
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative bg-card p-8 rounded-lg shadow-elegant hover:shadow-premium transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-4xl font-bold text-muted-foreground/20">
                  {step.step}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};