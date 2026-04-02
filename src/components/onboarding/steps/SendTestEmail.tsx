
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, Loader2, ArrowLeft, Rocket } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const SendTestEmail = ({ data, onNext, onBack }: StepProps) => {
    const [testEmail, setTestEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSendTest = () => {
        if (!testEmail) return;

        setIsSending(true);
        // Simulate sending
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
        }, 2000);
    };

    const handleComplete = () => {
        onNext({ testEmailSent: isSent, testEmailAddress: testEmail });
    };

    if (isSent) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Test Email Sent! 🎉
                </h2>
                <p className="text-gray-500 mb-8">
                    Check your inbox at <strong>{testEmail}</strong>
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                    <Rocket className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">You're all set!</h3>
                    <p className="text-sm text-gray-600">
                        Your first campaign is ready. Head to the dashboard to launch it to all your leads.
                    </p>
                </div>

                <Button onClick={handleComplete} className="gap-2" size="lg">
                    Go to Dashboard <Rocket className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Send a Test Email
                </h2>
                <p className="text-gray-500">
                    Preview your email before launching to all leads.
                </p>
            </div>

            {/* Email Preview Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Your email will look like this:</p>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {data.emailContent?.substring(0, 200)}...
                </div>
            </div>

            {/* Send Test Section */}
            <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Send a test email to yourself:
                </label>
                <div className="flex gap-2">
                    <Input
                        type="email"
                        placeholder="your@email.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendTest}
                        disabled={!testEmail || isSending}
                        className="gap-2"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Send Test
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="ghost" onClick={handleComplete}>
                    Skip & Go to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default SendTestEmail;
