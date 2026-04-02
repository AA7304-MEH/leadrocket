import { useState, createContext, useContext, ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    Zap,
    ArrowRight,
    CheckCircle2,
    Star,
    Users,
    Lock
} from "lucide-react";

interface UpsellConfig {
    title: string;
    description: string;
    features: string[];
    socialProof?: string;
    trialOffer?: string;
    buttonText?: string;
    plan?: "pro" | "scale";
}

interface UpsellContextType {
    showUpsell: (config: UpsellConfig) => void;
    hideUpsell: () => void;
}

const UpsellContext = createContext<UpsellContextType | null>(null);

export const useUpsell = () => {
    const context = useContext(UpsellContext);
    if (!context) {
        throw new Error("useUpsell must be used within UpsellProvider");
    }
    return context;
};

interface UpsellProviderProps {
    children: ReactNode;
}

export const UpsellProvider = ({ children }: UpsellProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<UpsellConfig | null>(null);

    const showUpsell = (newConfig: UpsellConfig) => {
        setConfig(newConfig);
        setIsOpen(true);
    };

    const hideUpsell = () => {
        setIsOpen(false);
    };

    return (
        <UpsellContext.Provider value={{ showUpsell, hideUpsell }}>
            {children}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            {config?.title || "Upgrade to Pro"}
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {config?.description || "Unlock powerful features to supercharge your outreach"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Features List */}
                        <div className="space-y-2">
                            {config?.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof */}
                        {config?.socialProof && (
                            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{config.socialProof}</span>
                            </div>
                        )}

                        {/* Trial Offer */}
                        {config?.trialOffer && (
                            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                                <Badge className="bg-primary text-white">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {config.trialOffer}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Button className="w-full gap-2" size="lg">
                            {config?.buttonText || "Upgrade Now"}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={hideUpsell}>
                            Maybe Later
                        </Button>
                    </div>

                    {/* Money Back Guarantee */}
                    <p className="text-center text-xs text-gray-400">
                        30-day money-back guarantee • Cancel anytime
                    </p>
                </DialogContent>
            </Dialog>
        </UpsellContext.Provider>
    );
};

// Pre-configured upsell triggers
export const UPSELL_CONFIGS = {
    aiPersonalization: {
        title: "Unlock Unlimited AI Personalization",
        description: "Write 1000s of personalized emails in minutes",
        features: [
            "Generate unlimited personalized lines",
            "Bulk AI editing for entire campaigns",
            "Advanced tone and style control",
            "LinkedIn profile integration"
        ],
        socialProof: "Used by 85% of top performers",
        trialOffer: "7-day Pro trial available",
        buttonText: "Start Free Trial"
    },
    advancedAnalytics: {
        title: "Upgrade for Advanced Analytics",
        description: "Get deeper insights into your campaign performance",
        features: [
            "Unlimited CSV exports",
            "PDF campaign reports",
            "Scheduled weekly reporting",
            "Competitor benchmarking"
        ],
        socialProof: "Save 5 hours/week on reporting",
        buttonText: "Unlock Analytics"
    },
    abTesting: {
        title: "Unlock A/B Testing",
        description: "Optimize your campaigns with split testing",
        features: [
            "Test up to 4 subject line variants",
            "Automatic winner selection",
            "Statistical significance tracking",
            "Send time optimization"
        ],
        socialProof: "Users see 32% higher open rates",
        trialOffer: "Free for 14 days",
        buttonText: "Enable A/B Testing"
    },
    teamFeatures: {
        title: "Upgrade to Team Plan",
        description: "Collaborate seamlessly with your team",
        features: [
            "Shared team inbox",
            "Approval workflows",
            "Role-based permissions",
            "Activity audit trail"
        ],
        socialProof: "Saves 8 hours/week on coordination",
        plan: "scale" as const,
        buttonText: "Get Team Plan"
    }
};

export default UpsellProvider;
