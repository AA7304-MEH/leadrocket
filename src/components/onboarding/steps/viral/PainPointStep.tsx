import React from 'react';
import { Card } from '@/components/ui/card';

interface StepProps {
    onNext: (data?: any) => void;
}

const points = [
    { emoji: "😩", title: "Spending hours personalizing", id: 'personalization' },
    { emoji: "📉", title: "Emails get low replies", id: 'replies' },
    { emoji: "⏰", title: "Too much manual work", id: 'automation' }
];

export const PainPointStep: React.FC<StepProps> = ({ onNext }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What's your biggest challenge?</h2>

            <div className="grid gap-4">
                {points.map((point) => (
                    <Card
                        key={point.id}
                        className="p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 group"
                        onClick={() => onNext({ painPoint: point.id })}
                    >
                        <span className="text-4xl group-hover:scale-110 transition-transform">{point.emoji}</span>
                        <span className="font-semibold text-lg">{point.title}</span>
                    </Card>
                ))}
            </div>
        </div>
    );
};
