import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Target, Lock, Sparkles, TrendingUp, TrendingDown } from "lucide-react";

interface GoalMetric {
    name: string;
    goal: number;
    actual: number;
    unit: string;
}

const PerformanceGoals = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const goals: GoalMetric[] = [
        { name: "Open Rate", goal: 45, actual: 34, unit: "%" },
        { name: "Reply Rate", goal: 10, actual: 8.2, unit: "%" },
    ];

    const proFeatures = [
        "AI Subject Line Optimizer",
        "Send Time Optimization",
        "Advanced Analytics",
    ];

    const handleUnlock = () => {
        toast({
            title: "Unlock Performance Tools ⚡",
            description: "Upgrade to Pro for AI-powered optimization",
        });
        navigate("/pricing");
    };

    const handleGoalClick = (goal: GoalMetric) => {
        toast({
            title: `${goal.name} Analytics`,
            description: `Current: ${goal.actual}${goal.unit} | Goal: ${goal.goal}${goal.unit}`,
        });
        navigate("/analytics");
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Performance vs Goals
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal) => {
                        const diff = goal.actual - goal.goal;
                        const progressPercent = (goal.actual / goal.goal) * 100;
                        const isNegative = diff < 0;

                        return (
                            <div
                                key={goal.name}
                                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleGoalClick(goal)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{goal.name} Goal</span>
                                    <span className="text-xs text-gray-500">{goal.goal}{goal.unit}</span>
                                </div>
                                <Progress value={Math.min(progressPercent, 100)} className="h-2 mb-2" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Your Rate: {goal.actual}{goal.unit}
                                    </span>
                                    <span className={`text-xs font-medium flex items-center gap-1 ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
                                        {isNegative ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                        ({diff > 0 ? '+' : ''}{diff.toFixed(1)}{goal.unit})
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pro Features That Help */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Pro Features That Help</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {proFeatures.map((feature) => (
                            <div
                                key={feature}
                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg"
                            >
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {feature}
                            </div>
                        ))}
                    </div>
                    <Button
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 gap-2"
                        onClick={handleUnlock}
                    >
                        <Lock className="w-4 h-4" />
                        Unlock Performance Tools
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PerformanceGoals;
