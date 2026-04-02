
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Mail, ShieldCheck, Sparkles, Users, AlertTriangle, Check } from "lucide-react";

interface UsageMetric {
    label: string;
    current: number;
    max: number;
    icon: React.ElementType;
}

const PlanUsage = () => {
    // Mock data - TODO: Replace with AuthContext
    const metrics: UsageMetric[] = [
        { label: "Emails", current: 80, max: 100, icon: Mail },
        { label: "Verifications", current: 15, max: 100, icon: ShieldCheck },
        { label: "AI Credits", current: 0, max: 10, icon: Sparkles },
        { label: "Team Members", current: 0, max: 1, icon: Users },
    ];

    const proFeatures = [
        "2,000 emails/month",
        "Unlimited AI Personalization",
        "Email Verification (500/month)",
        "Priority Support",
        "A/B Testing",
    ];

    const getProgressColor = (percent: number) => {
        if (percent >= 80) return "bg-red-500";
        if (percent >= 60) return "bg-amber-500";
        return "bg-primary";
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Your Plan: Free
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Monthly Limits */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Limits</p>
                    {metrics.map((metric) => {
                        const percent = (metric.current / metric.max) * 100;
                        return (
                            <div key={metric.label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                        <metric.icon className="w-4 h-4 text-gray-400" />
                                        {metric.label}
                                    </span>
                                    <span className="text-gray-500">{metric.current}/{metric.max}</span>
                                </div>
                                <Progress value={percent} className={`h-2 ${percent >= 80 ? '[&>div]:bg-red-500' : ''}`} />
                            </div>
                        );
                    })}
                </div>

                {/* Warning */}
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800 font-medium">
                        You'll hit email limit in 2 days!
                    </p>
                </div>

                {/* Pro Plan Features */}
                <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Pro Plan ($19/month):</p>
                    <ul className="space-y-2">
                        {proFeatures.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-xs text-gray-600">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Upgrade CTA */}
                <Link to="/pricing">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-shadow">
                        👉 Upgrade to Pro - 30-Day Trial
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default PlanUsage;
