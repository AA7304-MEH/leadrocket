
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, Send } from "lucide-react";

// Step components
import CampaignBasics from "./steps/CampaignBasics";
import CampaignAudience from "./steps/CampaignAudience";
import CampaignContent from "./steps/CampaignContent";
import CampaignSchedule from "./steps/CampaignSchedule";
import CampaignReview from "./steps/CampaignReview";

interface CampaignWizardProps {
    open: boolean;
    onClose: () => void;
    onComplete: (campaignData: Record<string, any>) => void;
}

const steps = [
    { id: 1, name: "Basics", component: CampaignBasics },
    { id: 2, name: "Audience", component: CampaignAudience },
    { id: 3, name: "Content", component: CampaignContent },
    { id: 4, name: "Schedule", component: CampaignSchedule },
    { id: 5, name: "Review", component: CampaignReview },
];

const CampaignWizard = ({ open, onClose, onComplete }: CampaignWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [campaignData, setCampaignData] = useState<Record<string, any>>({});

    const progress = (currentStep / steps.length) * 100;
    const CurrentStepComponent = steps[currentStep - 1].component;

    const handleNext = (data?: Record<string, any>) => {
        if (data) {
            setCampaignData((prev) => ({ ...prev, ...data }));
        }

        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleLaunch = () => {
        onComplete(campaignData);
        onClose();
        // Reset wizard
        setCurrentStep(1);
        setCampaignData({});
    };

    const handleClose = () => {
        onClose();
        // Reset after a delay to prevent flash
        setTimeout(() => {
            setCurrentStep(1);
            setCampaignData({});
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <Send className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Create Campaign</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Step Indicator */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between mb-3">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-2 ${step.id <= currentStep ? "text-primary" : "text-gray-400"
                                    }`}
                            >
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step.id < currentStep
                                            ? "bg-primary text-white"
                                            : step.id === currentStep
                                                ? "bg-primary/20 text-primary border-2 border-primary"
                                                : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {step.id < currentStep ? <Check className="w-3 h-3" /> : step.id}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{step.name}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>

                {/* Step Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <CurrentStepComponent
                        data={campaignData}
                        onNext={handleNext}
                        onBack={handleBack}
                        onLaunch={handleLaunch}
                        isFirstStep={currentStep === 1}
                        isLastStep={currentStep === steps.length}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CampaignWizard;
