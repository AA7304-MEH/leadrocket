
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Shield, Users, Lock, X } from "lucide-react";

export type UpgradeReason =
    | "email_limit"
    | "ai_credits"
    | "verification"
    | "team_members"
    | "ab_testing"
    | "send_timing"
    | "general";

interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
    reason?: UpgradeReason;
}

const reasonConfig: Record<UpgradeReason, { title: string; description: string; icon: React.ReactNode }> = {
    email_limit: {
        title: "You've hit your email limit!",
        description: "Upgrade to Pro for 2,000 emails/month and never miss a lead.",
        icon: <Zap className="w-6 h-6 text-amber-500" />,
    },
    ai_credits: {
        title: "Out of AI credits!",
        description: "Get unlimited AI personalization with Pro.",
        icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    },
    verification: {
        title: "Unlock Email Verification",
        description: "Verify emails before sending to protect your sender reputation.",
        icon: <Shield className="w-6 h-6 text-green-500" />,
    },
    team_members: {
        title: "Add Team Members",
        description: "Collaborate with your team on campaigns.",
        icon: <Users className="w-6 h-6 text-blue-500" />,
    },
    ab_testing: {
        title: "Unlock A/B Testing",
        description: "Test subject lines and content to maximize replies.",
        icon: <Zap className="w-6 h-6 text-orange-500" />,
    },
    send_timing: {
        title: "AI-Optimized Send Timing",
        description: "Let AI pick the best time to email each lead.",
        icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    },
    general: {
        title: "Upgrade to Pro",
        description: "Unlock all features and supercharge your outreach.",
        icon: <Zap className="w-6 h-6 text-primary" />,
    },
};

const proFeatures = [
    "2,000 emails/month",
    "Unlimited AI Personalization",
    "Email Verification (500/mo)",
    "A/B Testing",
    "AI Send Time Optimization",
    "Priority Support",
    "Team Collaboration (3 seats)",
];

const UpgradeModal = ({ open, onClose, reason = "general" }: UpgradeModalProps) => {
    const config = reasonConfig[reason];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            {config.icon}
                        </div>
                        <Lock className="w-5 h-5 text-white/50" />
                    </div>
                    <h2 className="text-xl font-bold mb-1">{config.title}</h2>
                    <p className="text-white/80 text-sm">{config.description}</p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-gray-900">$19</span>
                        <span className="text-gray-500">/month</span>
                        <span className="text-sm text-gray-400 line-through ml-2">$49</span>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">60% OFF</span>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-3">Everything in Pro:</p>
                    <ul className="space-y-2 mb-6">
                        {proFeatures.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Button className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                        Start 30-Day Free Trial 🚀
                    </Button>

                    <p className="text-xs text-center text-gray-400 mt-3">
                        No credit card required. Cancel anytime.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpgradeModal;
