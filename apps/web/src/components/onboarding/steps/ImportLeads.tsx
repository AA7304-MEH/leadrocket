
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Upload, Plus, X, ArrowLeft, ArrowRight } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

interface Lead {
    email: string;
    firstName: string;
    company: string;
}

const ImportLeads = ({ onNext, onBack }: StepProps) => {
    const [leads, setLeads] = useState<Lead[]>([
        { email: "", firstName: "", company: "" }
    ]);

    const addLead = () => {
        if (leads.length < 5) {
            setLeads([...leads, { email: "", firstName: "", company: "" }]);
        }
    };

    const removeLead = (index: number) => {
        setLeads(leads.filter((_, i) => i !== index));
    };

    const updateLead = (index: number, field: keyof Lead, value: string) => {
        const updated = [...leads];
        updated[index][field] = value;
        setLeads(updated);
    };

    const handleNext = () => {
        const validLeads = leads.filter(l => l.email.trim() !== "");
        onNext({ leads: validLeads });
    };

    const useSampleLeads = () => {
        setLeads([
            { email: "sarah@techcorp.com", firstName: "Sarah", company: "TechCorp" },
            { email: "mike@startupxyz.io", firstName: "Mike", company: "StartupXYZ" },
            { email: "jessica@growthlabs.com", firstName: "Jessica", company: "GrowthLabs" },
        ]);
    };

    return (
        <div>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Add Your First Leads
                </h2>
                <p className="text-gray-500">
                    Add up to 5 leads to test. You can import more later via CSV.
                </p>
            </div>

            {/* Lead Inputs */}
            <div className="space-y-4 mb-6">
                {leads.map((lead, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                            <Input
                                placeholder="Email *"
                                value={lead.email}
                                onChange={(e) => updateLead(index, 'email', e.target.value)}
                            />
                            <Input
                                placeholder="First Name"
                                value={lead.firstName}
                                onChange={(e) => updateLead(index, 'firstName', e.target.value)}
                            />
                            <Input
                                placeholder="Company"
                                value={lead.company}
                                onChange={(e) => updateLead(index, 'company', e.target.value)}
                            />
                        </div>
                        {leads.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLead(index)}
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add More / Sample Buttons */}
            <div className="flex gap-2 mb-8">
                {leads.length < 5 && (
                    <Button variant="outline" size="sm" onClick={addLead} className="gap-1">
                        <Plus className="w-4 h-4" /> Add Lead
                    </Button>
                )}
                <Button variant="ghost" size="sm" onClick={useSampleLeads} className="text-primary">
                    Use Sample Leads
                </Button>
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

export default ImportLeads;
