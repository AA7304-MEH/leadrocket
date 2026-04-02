import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface StepProps {
    onNext: (data?: any) => void;
}

export const ValueDemoStep: React.FC<StepProps> = ({ onNext }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">See the Difference</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 opacity-70">
                    <div className="text-xs font-bold text-red-600 mb-2 uppercase">Generic Template</div>
                    <p className="text-sm text-gray-600 font-mono text-xs mb-4">
                        Hi [Name],<br /><br />
                        I'm writing to see if you have time for a call...
                    </p>
                    <div className="text-red-600 font-bold text-sm">3% Reply Rate</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-lg relative transform scale-105">
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                        AI Personalized
                    </div>
                    <div className="text-xs font-bold text-green-700 mb-2 uppercase">LeadRockets Magic</div>
                    <p className="text-sm text-gray-800 font-mono text-xs mb-4">
                        Hi Sarah,<br /><br />
                        Congrats on the $15M raised! I saw your post about hiring engineers...
                    </p>
                    <div className="text-green-700 font-bold text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" /> 24% Reply Rate
                    </div>
                </div>
            </div>

            <div className="text-center pt-4">
                <Button onClick={() => onNext()} size="lg" className="w-full">
                    Start Setup <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
