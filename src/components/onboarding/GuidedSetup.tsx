
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Mail, Video, Send, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const steps = [
    { id: 1, name: "Import Leads", icon: Upload },
    { id: 2, name: "Choose Template", icon: Mail },
    { id: 3, name: "Personalization", icon: Video },
    { id: 4, name: "Test Send", icon: Send },
    { id: 5, name: "Schedule", icon: Calendar },
];

const GuidedSetup = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const progress = (currentStep / steps.length) * 100;

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Redirect to dashboard
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
                    <span>Start</span>
                    <span>Finish</span>
                </div>
            </div>

            <Card>
                <CardContent className="p-8">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {(() => {
                                const Icon = steps[currentStep - 1].icon;
                                return Icon ? <Icon className="w-5 h-5" /> : null;
                            })()}
                        </div>
                        <h2 className="text-xl font-bold">{steps[currentStep - 1].name}</h2>
                    </div>

                    {currentStep === 1 && (
                        <div className="text-center border-2 border-dashed rounded-lg p-12">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Import leads</h3>
                            <p className="mt-1 text-sm text-gray-500">Drag and drop or check our sample CSV</p>
                            <Button className="mt-4" variant="secondary">Upload CSV</Button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="p-4 border rounded hover:border-primary cursor-pointer">
                                <h4 className="font-bold">AI Suggested: SaaS Outreach</h4>
                                <p className="text-sm text-gray-500">Optimized for B2B founders</p>
                            </div>
                            <div className="p-4 border rounded hover:border-primary cursor-pointer">
                                <h4 className="font-bold">Networking & Partnerships</h4>
                                <p className="text-sm text-gray-500">Casual and friendly tone</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="text-center">
                            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-white">Tutorial Video Placeholder</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Watch how to personalize your emails in 90 seconds.</p>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Send a test email to yourself to check formatting.</p>
                            <Button variant="outline" className="w-full"><Send className="w-4 h-4 mr-2" /> Send Test Email</Button>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">
                                AI suggests sending at <strong>10:00 AM on Tuesday</strong> for highest open rates.
                            </div>
                            <Button className="w-full" size="lg" onClick={handleNext}>Launch Campaign 🚀</Button>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        <Button variant="ghost" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
                            Back
                        </Button>
                        {currentStep < 5 && (
                            <Button onClick={handleNext}>
                                Next Step
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GuidedSetup;
