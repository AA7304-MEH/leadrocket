
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const AIPersonalize = ({ data, onNext, onBack }: StepProps) => {
    const leadName = data.leads?.[0]?.firstName || "Sarah";
    const company = data.leads?.[0]?.company || "TechCorp";
    const templateName = data.template?.name || "Cold Outreach";

    const [isGenerating, setIsGenerating] = useState(false);
    const [emailContent, setEmailContent] = useState(`Hi ${leadName},

I noticed ${company} is doing impressive work in the tech space. I wanted to reach out because we help companies like yours streamline their outreach and boost reply rates by 3X.

Would you be open to a quick 15-minute call this week to explore if we'd be a good fit?

Best,
[Your Name]`);

    const handleRegenerate = () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setEmailContent(`Hey ${leadName},

I've been following ${company}'s journey – congrats on the recent growth! 

I'm reaching out because we've helped similar companies increase their cold email reply rates from 2% to 12% using AI personalization.

Curious if you have 10 minutes for a quick chat? No pressure at all.

Cheers,
[Your Name]`);
            setIsGenerating(false);
        }, 1500);
    };

    const handleNext = () => {
        onNext({ emailContent });
    };

    return (
        <div>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    AI-Powered Personalization
                </h2>
                <p className="text-gray-500">
                    We've personalized your email for {leadName} at {company}.
                </p>
            </div>

            {/* Email Preview */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Email Preview</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="gap-1 text-primary"
                    >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        Regenerate
                    </Button>
                </div>
                <Textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="min-h-[200px] bg-gray-50 resize-none"
                />
            </div>

            {/* AI Credits Notice */}
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg mb-6">
                <p className="text-xs text-amber-800">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    <strong>5 AI credits remaining</strong> on your Free plan. Upgrade to Pro for unlimited AI personalization.
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleNext} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default AIPersonalize;
