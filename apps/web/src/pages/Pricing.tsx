
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Crown, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { useUpgrade } from "@/contexts/UpgradeContext";

const plans = [
    {
        id: "free",
        name: "Free",
        price: 0,
        description: "Get started with cold outreach",
        icon: <Zap className="w-6 h-6" />,
        color: "from-gray-500 to-gray-600",
        features: [
            { name: "100 emails/month", included: true },
            { name: "50 AI credits/month", included: true },
            { name: "Basic templates (5)", included: true },
            { name: "Email tracking", included: true },
            { name: "Email verification", included: false },
            { name: "A/B testing", included: false },
            { name: "AI send timing", included: false },
            { name: "Team members", included: false },
            { name: "Priority support", included: false },
        ],
        cta: "Current Plan",
        disabled: true,
    },
    {
        id: "pro",
        name: "Pro",
        price: 19,
        originalPrice: 49,
        description: "For growing teams",
        icon: <Crown className="w-6 h-6" />,
        color: "from-blue-500 to-indigo-600",
        popular: true,
        features: [
            { name: "2,000 emails/month", included: true },
            { name: "Unlimited AI credits", included: true },
            { name: "All templates (20+)", included: true },
            { name: "Email tracking", included: true },
            { name: "Email verification (500/mo)", included: true },
            { name: "A/B testing", included: true },
            { name: "AI send timing", included: true },
            { name: "3 team members", included: true },
            { name: "Priority support", included: false },
        ],
        cta: "Start Free Trial",
        disabled: false,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 79,
        description: "For large organizations",
        icon: <Rocket className="w-6 h-6" />,
        color: "from-purple-500 to-pink-600",
        features: [
            { name: "Unlimited emails", included: true },
            { name: "Unlimited AI credits", included: true },
            { name: "All templates + custom", included: true },
            { name: "Email tracking", included: true },
            { name: "Unlimited verification", included: true },
            { name: "A/B testing", included: true },
            { name: "AI send timing", included: true },
            { name: "Unlimited team", included: true },
            { name: "Priority support", included: true },
        ],
        cta: "Contact Sales",
        disabled: false,
    },
];

const Pricing = () => {
    const { showUpgrade } = useUpgrade();

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary mb-4">Pricing</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Start free and scale as you grow. All plans include our core features.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative overflow-hidden ${plan.popular ? "ring-2 ring-primary shadow-xl scale-105" : ""
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                                Most Popular
                            </div>
                        )}
                        <CardHeader className={`bg-gradient-to-r ${plan.color} text-white p-6`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    {plan.icon}
                                </div>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-white/80">/month</span>
                                {plan.originalPrice && (
                                    <span className="text-sm line-through text-white/50 ml-2">
                                        ${plan.originalPrice}
                                    </span>
                                )}
                            </div>
                            <p className="text-white/80 text-sm mt-2">{plan.description}</p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <li key={feature.name} className="flex items-center gap-2">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                        )}
                                        <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className={`w-full ${plan.popular
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        : ""
                                    }`}
                                variant={plan.disabled ? "outline" : "default"}
                                disabled={plan.disabled}
                                onClick={() => !plan.disabled && showUpgrade("general")}
                            >
                                {plan.cta}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Can I cancel anytime?
                            </h3>
                            <p className="text-sm text-gray-500">
                                Yes! You can cancel your subscription at any time. Your access
                                continues until the end of your billing period.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2">
                                What happens if I exceed my limits?
                            </h3>
                            <p className="text-sm text-gray-500">
                                We'll notify you when you're approaching your limits. You can
                                upgrade anytime or wait for the next billing cycle.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Is there a free trial?
                            </h3>
                            <p className="text-sm text-gray-500">
                                Yes! Pro plan includes a 30-day free trial. No credit card required.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Pricing;
