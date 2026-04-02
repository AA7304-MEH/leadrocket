import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const tiers = [
    {
        name: "Free",
        id: "tier-free",
        priceMonthly: "$0",
        description: "Perfect for testing the waters.",
        features: ["100 emails/month", "Basic features", "Community support"],
        featured: false,
        cta: "Get Started Free",
        action: "register"
    },
    {
        name: "Pro",
        id: "tier-pro",
        priceMonthly: "$19",
        description: "For founders ready to scale.",
        features: [
            "2,000 emails/month",
            "AI Personalization",
            "Email Verifier (500/month)",
            "Deliverability Dashboard",
            "Priority support",
        ],
        featured: true,
        cta: "Start Free Trial",
        action: "trial"
    },
    {
        name: "Scale",
        id: "tier-scale",
        priceMonthly: "$49",
        description: "For teams and agencies.",
        features: [
            "10,000 emails/month",
            "Everything in Pro",
            "Team collaboration",
            "Advanced analytics",
            "Dedicated IP option",
        ],
        featured: false,
        cta: "Contact Sales",
        action: "contact"
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const PricingCards = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handlePlanSelect = (tier: typeof tiers[0]) => {
        if (tier.action === "register") {
            // Free plan - go to register
            navigate("/register?plan=free");
            toast({
                title: "Welcome! 🎉",
                description: "Sign up to start your free plan",
            });
        } else if (tier.action === "trial") {
            // Pro trial - go to register with trial
            navigate("/register?plan=pro&trial=true");
            toast({
                title: "Great Choice! ⚡",
                description: "Start your 30-day Pro trial",
            });
        } else if (tier.action === "contact") {
            // Scale - show contact info
            toast({
                title: "Scale Plan 🚀",
                description: "Contact us at sales@leadrockets.com",
            });
            // Open email client
            window.location.href = "mailto:sales@leadrockets.com?subject=Scale Plan Inquiry";
        }
    };

    return (
        <div className="bg-gray-50 py-24 sm:py-32" id="pricing">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Pricing That Scales With You
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    No credit card required for trial. 30-day money-back guarantee.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                tier.featured ? "bg-white ring-2 ring-primary scale-105 shadow-xl z-10" : "bg-white/60 ring-1 ring-gray-200",
                                "rounded-3xl p-8 xl:p-10 relative flex flex-col transition-all hover:shadow-lg"
                            )}
                        >
                            {tier.featured && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                                    Most Popular
                                </span>
                            )}
                            <div className="flex items-center justify-between gap-x-4">
                                <h3
                                    id={tier.id}
                                    className={classNames(
                                        tier.featured ? "text-primary" : "text-gray-900",
                                        "text-lg font-semibold leading-8"
                                    )}
                                >
                                    {tier.name}
                                </h3>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                                <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                            </p>
                            <Button
                                variant={tier.featured ? "default" : "outline"}
                                className={classNames(
                                    "mt-6 w-full cursor-pointer",
                                    tier.featured ? "bg-primary hover:bg-primary/90 shadow-md" : "hover:bg-gray-100"
                                )}
                                onClick={() => handlePlanSelect(tier)}
                            >
                                {tier.cta}
                            </Button>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingCards;
