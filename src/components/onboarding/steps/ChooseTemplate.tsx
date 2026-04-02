
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Check, ArrowLeft, ArrowRight } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

interface Template {
    id: string;
    name: string;
    preview: string;
    category: string;
}

const templates: Template[] = [
    {
        id: "cold-outreach",
        name: "Cold Outreach",
        category: "Sales",
        preview: "Hi {first_name}, I noticed {company} is doing great work in...",
    },
    {
        id: "conference-followup",
        name: "Conference Follow-up",
        category: "Networking",
        preview: "Great meeting you at {event}! I wanted to follow up on...",
    },
    {
        id: "partnership",
        name: "Partnership Proposal",
        category: "Business Dev",
        preview: "I've been following {company}'s growth and believe we could...",
    },
];

const ChooseTemplate = ({ onNext, onBack }: StepProps) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleNext = () => {
        const template = templates.find(t => t.id === selected);
        onNext({ template });
    };

    return (
        <div>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose a Template
                </h2>
                <p className="text-gray-500">
                    Pick a starting point. You can customize it in the next step.
                </p>
            </div>

            {/* Template Selection */}
            <div className="space-y-3 mb-8">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => setSelected(template.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selected === template.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">{template.name}</span>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                        {template.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {template.preview}
                                </p>
                            </div>
                            <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${selected === template.id
                                        ? "border-primary bg-primary text-white"
                                        : "border-gray-300"
                                    }`}
                            >
                                {selected === template.id && <Check className="w-4 h-4" />}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleNext} disabled={!selected} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default ChooseTemplate;
