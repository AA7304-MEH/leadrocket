
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield, CheckCircle, XCircle, Clock, AlertTriangle, Upload, Mail, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useUpgrade } from "@/contexts/UpgradeContext";

interface VerificationResult {
    email: string;
    status: 'valid' | 'invalid' | 'risky' | 'unknown';
    reason?: string;
}

interface EmailVerificationModalProps {
    open: boolean;
    onClose: () => void;
    emails?: string[];
}

const EmailVerificationModal = ({ open, onClose, emails = [] }: EmailVerificationModalProps) => {
    const [inputEmails, setInputEmails] = useState(emails.join('\n'));
    const [isVerifying, setIsVerifying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<VerificationResult[]>([]);
    const { showUpgrade } = useUpgrade();

    useEffect(() => {
        if (emails.length > 0) {
            setInputEmails(emails.join('\n'));
        }
    }, [emails]);

    const handleVerify = async () => {
        const emailList = inputEmails.split('\n').filter(e => e.trim());

        if (emailList.length === 0) {
            toast.error("Please enter at least one email");
            return;
        }

        // Check limit (mock)
        if (emailList.length > 10) {
            showUpgrade("verification");
            return;
        }

        setIsVerifying(true);
        setProgress(0);
        setResults([]);

        // Simulate verification
        for (let i = 0; i < emailList.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setProgress(((i + 1) / emailList.length) * 100);

            // Mock result
            const statuses: ('valid' | 'invalid' | 'risky')[] = ['valid', 'valid', 'valid', 'invalid', 'risky'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const reasons = {
                valid: 'Email is valid and deliverable',
                invalid: 'Mailbox does not exist',
                risky: 'Email is a catch-all or disposable'
            };

            setResults(prev => [...prev, {
                email: emailList[i],
                status,
                reason: reasons[status]
            }]);
        }

        setIsVerifying(false);
        toast.success("Verification complete!");
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'valid':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'invalid':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'risky':
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'valid':
                return <Badge className="bg-green-100 text-green-700">Valid</Badge>;
            case 'invalid':
                return <Badge className="bg-red-100 text-red-700">Invalid</Badge>;
            case 'risky':
                return <Badge className="bg-amber-100 text-amber-700">Risky</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const validCount = results.filter(r => r.status === 'valid').length;
    const invalidCount = results.filter(r => r.status === 'invalid').length;
    const riskyCount = results.filter(r => r.status === 'risky').length;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Email Verification
                    </DialogTitle>
                </DialogHeader>

                {results.length === 0 ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">
                                Enter emails to verify (one per line):
                            </p>
                            <textarea
                                value={inputEmails}
                                onChange={(e) => setInputEmails(e.target.value)}
                                className="w-full h-40 p-3 border rounded-lg text-sm font-mono resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="john@example.com&#10;sarah@company.com&#10;mike@business.org"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Credits remaining: <strong>10/10</strong></span>
                            <Button variant="link" size="sm" className="p-0" onClick={() => showUpgrade("verification")}>
                                Get more
                            </Button>
                        </div>

                        {isVerifying && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-gray-500 text-center">
                                    Verifying emails... {Math.round(progress)}%
                                </p>
                            </div>
                        )}

                        <Button
                            className="w-full gap-2"
                            onClick={handleVerify}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    Verify Emails
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-3 text-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-green-600">{validCount}</p>
                                    <p className="text-xs text-gray-500">Valid</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-3 text-center">
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-red-600">{invalidCount}</p>
                                    <p className="text-xs text-gray-500">Invalid</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-3 text-center">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-amber-600">{riskyCount}</p>
                                    <p className="text-xs text-gray-500">Risky</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Results List */}
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {results.map((result, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(result.status)}
                                        <span className="text-sm font-mono">{result.email}</span>
                                    </div>
                                    {getStatusBadge(result.status)}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => setResults([])}>
                                Verify More
                            </Button>
                            <Button className="flex-1" onClick={onClose}>
                                Done
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EmailVerificationModal;
