import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface StepProps {
    onNext: (data?: any) => void;
}

export const QuickSetupStep: React.FC<StepProps> = ({ onNext }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing...');
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 2;
                if (next > 30 && next < 50) setStatus('Connecting to LinkedIn...');
                if (next > 50 && next < 80) setStatus('Scanning for decision makers...');
                if (next > 80 && next < 100) setStatus('Optimizing profiles...');
                if (next >= 100) {
                    clearInterval(timer);
                    setStatus('Ready!');
                    setComplete(true);
                    return 100;
                }
                return next;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6 text-center">
            {!complete ? (
                <>
                    <h2 className="text-2xl font-bold">Setting up your engine...</h2>
                    <div className="py-8">
                        <div className="flex justify-center mb-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                        <p className="text-muted-foreground mb-4">{status}</p>
                        <Progress value={progress} className="h-2 w-full max-w-sm mx-auto" />
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold">Setup Complete! 🎉</h2>
                    <div className="py-6 space-y-2">
                        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                            <CheckCircle2 className="w-5 h-5" /> 127 Potential Leads Found
                        </div>
                        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                            <CheckCircle2 className="w-5 h-5" /> Account Optimized for SaaS
                        </div>
                        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                            <CheckCircle2 className="w-5 h-5" /> 3 Viral Campaigns Ready
                        </div>
                    </div>
                    <Button onClick={() => onNext()} size="lg" className="w-full max-w-xs animate-bounce">
                        Go to Dashboard
                    </Button>
                </>
            )}
        </div>
    );
};
