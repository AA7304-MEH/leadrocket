
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, ArrowRight, RefreshCw, FileText } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    onLaunch: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const templates = [
    {
        id: "cold-outreach",
        name: "Cold Outreach",
        content: `Hi {first_name},

I noticed {company} is doing impressive work. I wanted to reach out because we help companies like yours boost email reply rates by 3X.

Would you be open to a quick 15-minute call?

Best,
{sender_name}`,
    },
    {
        id: "follow-up",
        name: "Follow-up",
        content: `Hi {first_name},

Just wanted to follow up on my previous email. I know you're busy, so I'll keep this brief.

If you're interested in learning how we could help {company}, I'd love to connect.

Cheers,
{sender_name}`,
    },
];

const CampaignContent = ({ data, onNext, onBack }: StepProps) => {
    const [selectedTemplate, setSelectedTemplate] = useState(data.selectedTemplate || templates[0].id);
    const [emailContent, setEmailContent] = useState(
        data.emailContent || templates[0].content
    );
    const [isGenerating, setIsGenerating] = useState(false);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setEmailContent(template.content);
        }
    };

    const handleAIEnhance = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setEmailContent(`Hey {first_name} 👋

I've been following {company}'s growth – congrats on the recent momentum!

We've helped similar companies increase their cold email reply rates from 2% to 12% using AI personalization. I thought you might find this interesting.

Would you have 10 minutes for a quick chat? No pressure at all.

Cheers,
{sender_name}

P.S. I promise no generic sales pitch – just genuine value.`);
            setIsGenerating(false);
        }, 1500);
    };

    const handleNext = () => {
        onNext({ selectedTemplate, emailContent });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Email Content</h3>
                <p className="text-sm text-gray-500">Choose a template and customize with AI.</p>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
                <Label>Start with a template</Label>
                <div className="flex gap-2">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateChange(template.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedTemplate === template.id
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            {template.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Email Editor */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Email Body</Label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAIEnhance}
                        disabled={isGenerating}
                        className="gap-2 text-primary"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Enhancing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> AI Enhance
                            </>
                        )}
                    </Button>
                </div>
                <Textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                    Use {"{first_name}"}, {"{company}"}, {"{sender_name}"} for personalization.
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
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

export default CampaignContent;
