import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Target, Send, Sparkles, UserPlus, ArrowRight } from "lucide-react";

interface Opportunity {
    id: string;
    name: string;
    company: string;
    status: string;
    action: string;
    actionType: "followup" | "ai-draft" | "add-campaign";
    actionIcon: React.ReactNode;
}

const EngagementOpportunities = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const opportunities: Opportunity[] = [
        {
            id: "1",
            name: "Sarah Chen",
            company: "TechCorp",
            status: "Opened 3 emails, clicked links. No reply yet.",
            action: "Send Follow-up",
            actionType: "followup",
            actionIcon: <Send className="w-3.5 h-3.5" />,
        },
        {
            id: "2",
            name: "Mike Rodriguez",
            company: "StartupXYZ",
            status: "Replied 'Interesting...' • No follow-up in 5 days",
            action: "AI Draft Reply",
            actionType: "ai-draft",
            actionIcon: <Sparkles className="w-3.5 h-3.5" />,
        },
        {
            id: "3",
            name: "Jessica Lee",
            company: "GrowthLabs",
            status: "Company just raised $5M. Perfect timing!",
            action: "Add to Campaign",
            actionType: "add-campaign",
            actionIcon: <UserPlus className="w-3.5 h-3.5" />,
        },
    ];

    const handleAction = (opp: Opportunity) => {
        switch (opp.actionType) {
            case "followup":
                toast({
                    title: "Follow-up Sent! ✉️",
                    description: `Follow-up email drafted for ${opp.name}`,
                });
                break;
            case "ai-draft":
                toast({
                    title: "AI Draft Created! ✨",
                    description: `AI is generating a reply for ${opp.name}`,
                });
                break;
            case "add-campaign":
                toast({
                    title: "Added to Campaign! 🎯",
                    description: `${opp.name} added to your active campaign`,
                });
                break;
        }
    };

    const handleViewAll = () => {
        toast({
            title: "Opening Leads Page",
            description: "View all engagement opportunities",
        });
        navigate("/leads");
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Top Engagement Opportunities
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {opportunities.map((opp, index) => (
                        <div
                            key={opp.id}
                            className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {opp.name} - {opp.company}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{opp.status}</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 flex-shrink-0"
                                onClick={() => handleAction(opp)}
                            >
                                {opp.actionIcon}
                                {opp.action}
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    variant="link"
                    className="w-full mt-4 text-sm gap-1"
                    onClick={handleViewAll}
                >
                    View All 15 Opportunities <ArrowRight className="w-4 h-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default EngagementOpportunities;
