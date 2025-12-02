import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 49,
    period: "month",
    description: "For individuals just starting out",
    badge: "Start 14-Day Free Trial",
    features: [
      "20 verified leads per week",
      "Basic outreach sequences",
      "Email support",
      "Export to CSV",
      "Basic lead scoring"
    ]
  },
  {
    name: "Pro",
    price: 199,
    period: "month",
    description: "Perfect for growing businesses",
    badge: "Most Popular",
    popular: true,
    features: [
      "100 verified leads per week",
      "AI-powered outreach sequences",
      "CRM sync (HubSpot, Salesforce)",
      "Intent signal monitoring",
      "Priority email & chat support"
    ]
  },
  {
    name: "Enterprise",
    price: 499,
    period: "month",
    description: "For scaling teams and agencies",
    badge: "Best Value",
    features: [
      "300 verified leads per week",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced analytics dashboard",
      "Phone support & training",
      "White-label options"
    ]
  }
];

export const PricingSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include our 50-lead guarantee.
          </p>
        </div>

        {/* Pricing plans temporarily hidden
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`group relative bg-gradient-card shadow-elegant hover:shadow-floating transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border animate-slide-up overflow-hidden ${plan.popular ? 'ring-2 ring-primary/50 border-primary/20 shadow-glow' : 'border-primary/10'
                }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-primary text-primary-foreground px-6 py-2 shadow-glow animate-pulse-glow">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  {plan.description}
                </p>
                <Badge variant="outline" className="mt-4">
                  {plan.badge}
                </Badge>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  <Button
                    className={`w-full ${plan.popular
                        ? 'bg-gradient-primary hover:opacity-90'
                        : 'bg-gradient-primary hover:opacity-90'
                      }`}
                    size="lg"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        */}
      </div>
    </section>
  );
};