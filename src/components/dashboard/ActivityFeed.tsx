import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Activity, Mail, UserPlus, MessageSquare, Rocket, BellOff, Bell } from "lucide-react";

interface ActivityItem {
    id: string;
    type: 'email_opened' | 'lead_imported' | 'reply' | 'campaign_complete';
    message: string;
    timestamp: string;
    detail?: string;
    link?: string;
}

const ActivityFeed = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isPaused, setIsPaused] = useState(false);

    const activities: ActivityItem[] = [
        {
            id: '1',
            type: 'email_opened',
            message: 'Email opened by Mark@Acme.com',
            timestamp: 'Just now',
            link: '/leads'
        },
        {
            id: '2',
            type: 'lead_imported',
            message: 'Lead imported: 45 new leads',
            timestamp: '2 min ago',
            link: '/leads'
        },
        {
            id: '3',
            type: 'reply',
            message: 'Reply: "Let\'s schedule a call"',
            timestamp: '5 min ago',
            detail: 'View Conversation',
            link: '/leads'
        },
        {
            id: '4',
            type: 'campaign_complete',
            message: 'Campaign "Q1 Outreach" completed',
            timestamp: '15 min ago',
            detail: '200/200 emails sent',
            link: '/campaigns'
        }
    ];

    const getIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'email_opened': return <Mail className="w-4 h-4 text-blue-500" />;
            case 'lead_imported': return <UserPlus className="w-4 h-4 text-green-500" />;
            case 'reply': return <MessageSquare className="w-4 h-4 text-purple-500" />;
            case 'campaign_complete': return <Rocket className="w-4 h-4 text-orange-500" />;
        }
    };

    const handleActivityClick = (activity: ActivityItem) => {
        toast({
            title: "Opening Details",
            description: activity.message,
        });
        if (activity.link) {
            navigate(activity.link);
        }
    };

    const toggleNotifications = () => {
        setIsPaused(!isPaused);
        toast({
            title: isPaused ? "Notifications Resumed 🔔" : "Notifications Paused 🔕",
            description: isPaused ? "You'll receive activity updates" : "Activity notifications paused",
        });
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Real-time Activity
                    {!isPaused && (
                        <span className="relative flex h-2 w-2 ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex gap-3 items-start cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                            onClick={() => handleActivityClick(activity)}
                        >
                            <div className="mt-0.5 p-2 bg-gray-50 rounded-full">
                                {getIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                {activity.detail && (
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-xs text-primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleActivityClick(activity);
                                        }}
                                    >
                                        {activity.detail} →
                                    </Button>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">{activity.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm text-gray-500 gap-2"
                    onClick={toggleNotifications}
                >
                    {isPaused ? (
                        <>
                            <Bell className="w-4 h-4" />
                            Resume Notifications
                        </>
                    ) : (
                        <>
                            <BellOff className="w-4 h-4" />
                            Pause Notifications
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;
