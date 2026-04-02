import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface StepProps {
    onNext: (data?: any) => void;
}

export const WelcomeVideoStep: React.FC<StepProps> = ({ onNext }) => {
    return (
        <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Welcome to LeadRockets 🚀</h2>

            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl mx-auto max-w-lg group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-left">
                    <p className="font-bold">Founder's Welcome</p>
                    <p className="text-sm opacity-80">Watch how to 10X your outreach</p>
                </div>
                {/* Simulated video background */}
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 opacity-80" />
            </div>

            <p className="text-muted-foreground max-w-md mx-auto">
                Discover the power of viral growth and AI automation in 90 seconds.
            </p>

            <Button onClick={() => onNext()} size="lg" className="w-full max-w-xs animate-pulse">
                Let's Go!
            </Button>

            <button onClick={() => onNext()} className="text-sm text-muted-foreground hover:underline block w-full mt-4">
                Skip Video
            </button>
        </div>
    );
};
