
import { Sparkles, Mail, Shield, Clock, Copy, BrainCircuit } from "lucide-react";

const features = [
    {
        name: "AI Personalization",
        description: "Not just {first_name}. Our AI analyzes prospects and writes personalized opening lines.",
        icon: Sparkles,
    },
    {
        name: "Built-in Email Verifier",
        description: "Stop bouncing. Verify 100 emails free every month.",
        icon: Mail,
    },
    {
        name: "Deliverability Dashboard",
        description: "See your sender score, avoid spam, get AI suggestions.",
        icon: Shield,
    },
    {
        name: "5-Minute Setup",
        description: "Import leads, choose template, personalize, and send. Built for founders.",
        icon: Clock,
    },
    {
        name: "Campaign Cloning",
        description: "Clone high-performing campaigns with one click.",
        icon: Copy,
    },
    {
        name: "Reply Intelligence",
        description: "AI categorizes replies and suggests next steps.",
        icon: BrainCircuit,
    },
];

const FeaturesGrid = () => {
    return (
        <div className="bg-white py-24 sm:py-32" id="features">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Everything You Need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Built for founders, not just sales teams
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Stop switching between 5 different tools. LeadRockets gives you the full stack to send cold emails that actually convert.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default FeaturesGrid;
