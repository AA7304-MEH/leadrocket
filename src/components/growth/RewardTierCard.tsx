import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock } from 'lucide-react';

interface RewardTierProps {
    name: string;
    invitesRequired: number;
    reward: string;
    currentInvites: number;
    benefits: string[];
}

export const RewardTierCard: React.FC<RewardTierProps> = ({
    name,
    invitesRequired,
    reward,
    currentInvites,
    benefits
}) => {
    const isUnlocked = currentInvites >= invitesRequired;

    return (
        <Card className={`relative overflow-hidden transition-all ${isUnlocked ? 'border-primary/50 shadow-md' : 'opacity-75'}`}>
            {isUnlocked && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                    UNLOCKED
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{name}</CardTitle>
                        <CardDescription>{invitesRequired} Invites Required</CardDescription>
                    </div>
                    {isUnlocked ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <span className="text-2xl font-bold">{reward}</span>
                </div>
                <ul className="space-y-2">
                    {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-primary" />
                            {benefit}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};
