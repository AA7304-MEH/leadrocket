
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface UsageMetric {
    label: string;
    current: number;
    max: number;
    icon: React.ElementType;
    color: string;
}

const UsageMeter = () => {
    // TODO: Fetch real data from 'user.usage' in AuthContext or API
    const metrics: UsageMetric[] = [
        { label: "Emails Sent", current: 40, max: 100, icon: Mail, color: "text-blue-500" },
        { label: "Verifications", current: 10, max: 100, icon: ShieldCheck, color: "text-green-500" },
        { label: "AI Credits", current: 0, max: 10, icon: Zap, color: "text-purple-500" },
    ];

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    Plan Usage
                    <span className="text-xs font-normal px-2 py-1 bg-gray-100 rounded-full text-gray-600">Free Plan</span>
                </CardTitle>
                <CardDescription>
                    You'll hit limits in approx. 2 days based on current usage.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {metrics.map((metric) => (
                    <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="flex items-center gap-2 font-medium text-gray-700">
                                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                {metric.label}
                            </span>
                            <span className="text-gray-500">
                                {metric.current} / {metric.max}
                            </span>
                        </div>
                        <Progress value={(metric.current / metric.max) * 100} className="h-2" />
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Link to="/pricing" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                        ✨ Upgrade to Pro for Unlimited
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default UsageMeter;
