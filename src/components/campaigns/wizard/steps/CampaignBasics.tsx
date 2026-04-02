
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    onLaunch: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const CampaignBasics = ({ data, onNext }: StepProps) => {
    const [name, setName] = useState(data.name || "");
    const [subject, setSubject] = useState(data.subject || "");
    const [senderName, setSenderName] = useState(data.senderName || "");
    const [senderEmail, setSenderEmail] = useState(data.senderEmail || "");

    const aiSubjectSuggestions = [
        "Quick question about {company}",
        "Idea for {first_name} at {company}",
        "{first_name}, saw your recent post..."
    ];

    const handleAISuggestion = (suggestion: string) => {
        setSubject(suggestion);
    };

    const handleNext = () => {
        onNext({ name, subject, senderName, senderEmail });
    };

    const isValid = name.trim() && subject.trim();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Campaign Basics</h3>
                <p className="text-sm text-gray-500">Name your campaign and set the subject line.</p>
            </div>

            {/* Campaign Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                    id="name"
                    placeholder="e.g., Q1 Outreach, Conference Follow-up"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Subject Line */}
            <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                    id="subject"
                    placeholder="e.g., Quick question about {company}"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Suggestions:
                    </span>
                    {aiSubjectSuggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleAISuggestion(suggestion)}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sender Identity */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input
                        id="senderName"
                        placeholder="Your Name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender Email</Label>
                    <Input
                        id="senderEmail"
                        type="email"
                        placeholder="you@company.com"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleNext} disabled={!isValid} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default CampaignBasics;
