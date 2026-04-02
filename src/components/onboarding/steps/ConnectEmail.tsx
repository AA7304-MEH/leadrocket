
import { Button } from "@/components/ui/button";
import { Mail, Chrome, Square } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const ConnectEmail = ({ onNext }: StepProps) => {
    const handleConnect = (provider: 'gmail' | 'outlook') => {
        // TODO: Implement OAuth flow
        console.log(`Connecting to ${provider}...`);
        onNext({ emailProvider: provider, emailConnected: true });
    };

    const handleSkip = () => {
        onNext({ emailConnected: false });
    };

    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Email
            </h2>
            <p className="text-gray-500 mb-8">
                We'll send emails on your behalf. Your inbox stays yours.
            </p>

            <div className="space-y-3 max-w-sm mx-auto">
                <Button
                    variant="outline"
                    className="w-full h-14 text-base justify-start gap-4 hover:border-primary hover:bg-primary/5"
                    onClick={() => handleConnect('gmail')}
                >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                            <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                        </svg>
                    </div>
                    <span>Continue with Gmail</span>
                </Button>

                <Button
                    variant="outline"
                    className="w-full h-14 text-base justify-start gap-4 hover:border-primary hover:bg-primary/5"
                    onClick={() => handleConnect('outlook')}
                >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Square className="w-4 h-4 text-white" />
                    </div>
                    <span>Continue with Outlook</span>
                </Button>
            </div>

            <Button
                variant="link"
                className="mt-6 text-gray-400 hover:text-gray-600"
                onClick={handleSkip}
            >
                Skip for now (use demo mode)
            </Button>
        </div>
    );
};

export default ConnectEmail;
