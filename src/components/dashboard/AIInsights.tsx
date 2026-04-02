
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Flame, AlertTriangle, Lightbulb, Lock, Sparkles } from "lucide-react";

interface InsightProps {
    type: 'opportunity' | 'alert' | 'suggestion';
    title: string;
    description: string;
    action?: string;
    isPro?: boolean;
}

const InsightCard = ({ type, title, description, action, isPro }: InsightProps) => {
    const icons = {
        opportunity: <Flame className="w-4 h-4 text-orange-500" />,
        alert: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        suggestion: <Lightbulb className="w-4 h-4 text-blue-500" />,
    };

    const bgColors = {
        opportunity: "bg-orange-50 border-orange-100",
        alert: "bg-amber-50 border-amber-100",
        suggestion: "bg-blue-50 border-blue-100",
    };

    return (
        <div className={`p-3 rounded-lg border ${bgColors[type]}`}>
            <div className="flex items-start gap-2">
                <div className="mt-0.5">{icons[type]}</div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-600 mt-1">{description}</p>
                    {action && (
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 mt-2 text-xs font-medium"
                            disabled={isPro}
                        >
                            {isPro && <Lock className="w-3 h-3 mr-1" />}
                            {action}
                            {isPro && <span className="ml-1 text-amber-600">🔒</span>}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const AIInsights = () => {
    const insights: InsightProps[] = [
        {
            type: "opportunity",
            title: "Top Opportunity",
            description: "Your open rate drops 40% after 3 PM. Schedule emails before 2 PM for better results.",
        },
        {
            type: "alert",
            title: "Domain Health Alert",
            description: "2 sender domains have poor reputation (score: 5/10).",
            action: "Warmup now - Pro Feature",
            isPro: true,
        },
        {
            type: "suggestion",
            title: "Personalization Tip",
            description: "Add personalized opening lines to 'Conference Follow-up' campaign.",
            action: "AI Personalize - 5 credits left",
        },
    ];

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    AI Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {insights.map((insight, index) => (
                    <InsightCard key={index} {...insight} />
                ))}

                <Button variant="outline" className="w-full mt-4 gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate More Insights
                </Button>
            </CardContent>
        </Card>
    );
};

export default AIInsights;
