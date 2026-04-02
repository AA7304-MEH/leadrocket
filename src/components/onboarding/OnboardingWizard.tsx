import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Zap } from "lucide-react";

// Viral Steps
import { WelcomeVideoStep } from "./steps/viral/WelcomeVideoStep";
import { PainPointStep } from "./steps/viral/PainPointStep";
import { ValueDemoStep } from "./steps/viral/ValueDemoStep";
import { QuickSetupStep } from "./steps/viral/QuickSetupStep";

interface OnboardingWizardProps {
    onComplete: () => void;
}

const steps = [
    { id: 1, name: "Welcome", description: "Methodology", component: WelcomeVideoStep },
    { id: 2, name: "Challenges", description: "Personalization", component: PainPointStep },
    { id: 3, name: "Demo", description: "See Value", component: ValueDemoStep },
    { id: 4, name: "Setup", description: "Auto-Import", component: QuickSetupStep },
];

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepData, setStepData] = useState<Record<string, any>>({});

    const progress = (currentStep / steps.length) * 100;
    const CurrentStepComponent = steps[currentStep - 1].component;

    const handleNext = (data?: Record<string, any>) => {
        if (data) {
            setStepData((prev) => ({ ...prev, ...data }));
        }

        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Zap className="w-8 h-8 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-900">LeadRockets</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Viral Growth Engine 🚀
                    </h1>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2 px-1">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center ${step.id <= currentStep ? "text-indigo-600" : "text-gray-400"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 transition-all ${step.id < currentStep
                                        ? "bg-indigo-600 text-white"
                                        : step.id === currentStep
                                            ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                                            : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={progress} className="h-2 bg-indigo-100" />
                </div>

                {/* Step Content Card */}
                <Card className="shadow-2xl border-gray-100 backdrop-blur-sm bg-white/90">
                    <CardContent className="p-8">
                        <CurrentStepComponent
                            onNext={handleNext}
                        />
                    </CardContent>
                </Card>

                {/* Time Estimate */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Step {currentStep} of {steps.length} • {steps[currentStep - 1].description}
                </p>
            </div>
        </div>
    );
};

export default OnboardingWizard;
