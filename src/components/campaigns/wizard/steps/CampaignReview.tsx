
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket, Users, Mail, Clock, FileText, CheckCircle } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    onLaunch: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const CampaignReview = ({ data, onBack, onLaunch }: StepProps) => {
    const leadCount = data.leads?.length || 0;

    const summaryItems = [
        {
            icon: <Mail className="w-4 h-4" />,
            label: "Campaign Name",
            value: data.name || "Untitled Campaign",
        },
        {
            icon: <FileText className="w-4 h-4" />,
            label: "Subject Line",
            value: data.subject || "No subject",
        },
        {
            icon: <Users className="w-4 h-4" />,
            label: "Recipients",
            value: `${leadCount} lead${leadCount !== 1 ? 's' : ''}`,
        },
        {
            icon: <Clock className="w-4 h-4" />,
            label: "Schedule",
            value: data.scheduleType === "now" ? "Send immediately" : "Scheduled",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Ready to Launch!</h3>
                <p className="text-sm text-gray-500">Review your campaign before sending.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                {summaryItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* Email Preview */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                    <p className="text-xs font-medium text-gray-500">Email Preview</p>
                </div>
                <div className="p-4 bg-white">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                        Subject: {data.subject}
                    </p>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {data.emailContent?.substring(0, 300)}...
                    </div>
                </div>
            </div>

            {/* Usage Warning */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-sm text-amber-800">
                    ⚡ This will use <strong>{leadCount}</strong> of your <strong>100</strong> monthly email quota (Free plan).
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                    onClick={onLaunch}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                    <Rocket className="w-4 h-4" /> Launch Campaign
                </Button>
            </div>
        </div>
    );
};

export default CampaignReview;
