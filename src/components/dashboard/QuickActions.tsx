import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Zap, Upload, PenLine, BrainCircuit, BarChart3, Lock, FlaskConical, Users } from "lucide-react";

interface ActionItem {
    label: string;
    icon: React.ReactNode;
    href: string;
    isPro?: boolean;
}

const QuickActions = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const freeActions: ActionItem[] = [
        { label: "Import Leads", icon: <Upload className="w-4 h-4" />, href: "/leads" },
        { label: "Create Campaign", icon: <PenLine className="w-4 h-4" />, href: "/campaigns" },
        { label: "AI Assistant", icon: <BrainCircuit className="w-4 h-4" />, href: "/dashboard" },
        { label: "View Reports", icon: <BarChart3 className="w-4 h-4" />, href: "/analytics" },
    ];

    const proActions: ActionItem[] = [
        { label: "Generate 50 Variants", icon: <FlaskConical className="w-4 h-4" />, href: "#", isPro: true },
        { label: "A/B Test Setup", icon: <Zap className="w-4 h-4" />, href: "#", isPro: true },
        { label: "Competitor Analysis", icon: <Users className="w-4 h-4" />, href: "#", isPro: true },
    ];

    const handleActionClick = (action: ActionItem) => {
        if (action.isPro) {
            toast({
                title: "Pro Feature 🔒",
                description: `${action.label} requires a Pro subscription`,
            });
            navigate("/pricing");
            return;
        }

        toast({
            title: action.label,
            description: `Navigating to ${action.label}...`,
        });
        navigate(action.href);
    };

    const handleProClick = (action: ActionItem) => {
        toast({
            title: "Upgrade to Pro ⚡",
            description: `Unlock ${action.label} and more!`,
        });
        navigate("/pricing");
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Free Actions */}
                <div className="grid grid-cols-2 gap-2">
                    {freeActions.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            className="w-full justify-start gap-2 h-11"
                            onClick={() => handleActionClick(action)}
                        >
                            {action.icon}
                            <span className="text-xs">{action.label}</span>
                        </Button>
                    ))}
                </div>

                {/* Pro Actions */}
                <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                        AI Tools (Pro Features)
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {proActions.map((action) => (
                            <Button
                                key={action.label}
                                variant="ghost"
                                className="w-full justify-start gap-2 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                onClick={() => handleProClick(action)}
                            >
                                <Lock className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-xs">{action.label}</span>
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-3">
                        Unlock AI Tools with Pro
                    </p>
                    <Button
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-sm"
                        onClick={() => navigate("/pricing")}
                    >
                        Upgrade Now
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
