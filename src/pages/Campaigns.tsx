import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CampaignWizard from "@/components/campaigns/wizard/CampaignWizard";
import CampaignSequenceBuilder from "@/components/campaigns/CampaignSequenceBuilder";
import ABTestBuilder from "@/components/campaigns/ABTestBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Send, Pause, Play, BarChart3, MoreHorizontal, Mail, Users, Clock, ListOrdered, FlaskConical, Sparkles } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed' | 'draft';
    sent: number;
    total: number;
    openRate: number;
    replyRate: number;
    createdAt: string;
}

const mockCampaigns: Campaign[] = [
    {
        id: "1",
        name: "Q1 Outreach",
        status: "active",
        sent: 45,
        total: 100,
        openRate: 34.5,
        replyRate: 8.2,
        createdAt: "2 days ago",
    },
    {
        id: "2",
        name: "Conference Follow-up",
        status: "completed",
        sent: 200,
        total: 200,
        openRate: 42.0,
        replyRate: 12.5,
        createdAt: "1 week ago",
    },
    {
        id: "3",
        name: "Partnership Proposal",
        status: "paused",
        sent: 25,
        total: 50,
        openRate: 28.0,
        replyRate: 4.0,
        createdAt: "3 days ago",
    },
    {
        id: "4",
        name: "Product Launch",
        status: "draft",
        sent: 0,
        total: 75,
        openRate: 0,
        replyRate: 0,
        createdAt: "Just now",
    },
];

const statusColors = {
    active: "bg-green-100 text-green-700",
    paused: "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
    draft: "bg-gray-100 text-gray-700",
};

const statusIcons = {
    active: <Play className="w-3 h-3" />,
    paused: <Pause className="w-3 h-3" />,
    completed: <BarChart3 className="w-3 h-3" />,
    draft: <Clock className="w-3 h-3" />,
};

const Campaigns = () => {
    const { toast } = useToast();
    const [wizardOpen, setWizardOpen] = useState(false);
    const [campaigns, setCampaigns] = useState(mockCampaigns);
    const [activeTab, setActiveTab] = useState("campaigns");

    const handleCampaignComplete = (data: Record<string, any>) => {
        const newCampaign: Campaign = {
            id: String(campaigns.length + 1),
            name: data.name || "New Campaign",
            status: data.scheduleType === "now" ? "active" : "draft",
            sent: 0,
            total: data.leads?.length || 0,
            openRate: 0,
            replyRate: 0,
            createdAt: "Just now",
        };
        setCampaigns([newCampaign, ...campaigns]);
    };

    const handleSequenceSave = (steps: any[]) => {
        toast({ title: "Sequence Saved ✅", description: `${steps.length} email steps saved` });
    };

    const handleABTestSave = (variants: any[], settings: any) => {
        toast({ title: "A/B Test Saved ✅", description: `${variants.length} variants configured` });
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                    <p className="text-gray-500">Manage and monitor your email campaigns.</p>
                </div>
                <Button onClick={() => setWizardOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> New Campaign
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="campaigns" className="gap-2">
                        <Mail className="w-4 h-4" />
                        All Campaigns
                    </TabsTrigger>
                    <TabsTrigger value="sequence" className="gap-2">
                        <ListOrdered className="w-4 h-4" />
                        Sequence Builder
                    </TabsTrigger>
                    <TabsTrigger value="abtest" className="gap-2">
                        <FlaskConical className="w-4 h-4" />
                        A/B Testing
                        <Badge variant="secondary" className="text-xs ml-1">Pro</Badge>
                    </TabsTrigger>
                </TabsList>

                {/* All Campaigns Tab */}
                <TabsContent value="campaigns" className="space-y-6">
                    {/* Campaign Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Send className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                                    <p className="text-sm text-gray-500">Total Campaigns</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Play className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {campaigns.filter(c => c.status === 'active').length}
                                    </p>
                                    <p className="text-sm text-gray-500">Active</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {campaigns.reduce((acc, c) => acc + c.sent, 0)}
                                    </p>
                                    <p className="text-sm text-gray-500">Emails Sent</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Users className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(campaigns.reduce((acc, c) => acc + c.replyRate, 0) / campaigns.filter(c => c.replyRate > 0).length || 0).toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-gray-500">Avg Reply Rate</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Campaigns List */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Campaign</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Progress</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Open Rate</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Reply Rate</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{campaign.name}</p>
                                                    <p className="text-sm text-gray-500">{campaign.createdAt}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`gap-1 ${statusColors[campaign.status]}`}>
                                                        {statusIcons[campaign.status]}
                                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary rounded-full"
                                                                style={{ width: `${(campaign.sent / campaign.total) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {campaign.sent}/{campaign.total}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">{campaign.openRate}%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">{campaign.replyRate}%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setActiveTab('sequence')}>
                                                                <ListOrdered className="w-4 h-4 mr-2" />
                                                                Edit Sequence
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setActiveTab('abtest')}>
                                                                <FlaskConical className="w-4 h-4 mr-2" />
                                                                Run A/B Test
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                {campaign.status === 'active' ? 'Pause' : 'Resume'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Sequence Builder Tab */}
                <TabsContent value="sequence">
                    <Card>
                        <CardContent className="p-6">
                            <CampaignSequenceBuilder
                                onSave={handleSequenceSave}
                                onSend={() => toast({ title: "Campaign Launched! 🚀", description: "Your sequence is now sending" })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* A/B Testing Tab */}
                <TabsContent value="abtest">
                    <ABTestBuilder
                        onSave={handleABTestSave}
                        onStart={() => toast({ title: "A/B Test Started! 🧪", description: "Test is now running" })}
                    />
                </TabsContent>
            </Tabs>

            {/* Campaign Wizard Modal */}
            <CampaignWizard
                open={wizardOpen}
                onClose={() => setWizardOpen(false)}
                onComplete={handleCampaignComplete}
            />
        </DashboardLayout>
    );
};

export default Campaigns;
