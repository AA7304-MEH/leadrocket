
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    TrendingUp, TrendingDown, Mail, Eye, Reply, Users, FileBarChart, Download,
    Calendar, ArrowUpRight, Target, Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MetricCard {
    label: string;
    value: string;
    change: number;
    changeLabel: string;
    icon: React.ReactNode;
}

const metrics: MetricCard[] = [
    { label: "Emails Sent", value: "1,247", change: 12.5, changeLabel: "vs last week", icon: <Mail className="w-5 h-5" /> },
    { label: "Open Rate", value: "34.2%", change: 3.1, changeLabel: "vs last week", icon: <Eye className="w-5 h-5" /> },
    { label: "Reply Rate", value: "8.7%", change: -1.2, changeLabel: "vs last week", icon: <Reply className="w-5 h-5" /> },
    { label: "Leads Generated", value: "42", change: 15.3, changeLabel: "vs last week", icon: <Users className="w-5 h-5" /> },
];

const campaignPerformance = [
    { name: "Q1 Outreach", sent: 450, opened: 180, replied: 32, status: "active" },
    { name: "Conference Follow-up", sent: 200, opened: 96, replied: 24, status: "completed" },
    { name: "Partnership Pitch", sent: 150, opened: 52, replied: 8, status: "active" },
    { name: "Product Launch", sent: 312, opened: 142, replied: 28, status: "paused" },
];

const topPerformingEmails = [
    { subject: "Quick question about {company}", openRate: 52.3, replyRate: 14.2 },
    { subject: "Idea for improving {goal}", openRate: 48.1, replyRate: 12.8 },
    { subject: "{mutual_connection} suggested we chat", openRate: 61.2, replyRate: 22.1 },
];

const Analytics = () => {
    const [timeRange, setTimeRange] = useState("7d");

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500">Track your outreach performance.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric) => (
                    <Card key={metric.label}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">{metric.label}</span>
                                <span className={`p-2 rounded-lg ${metric.change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {metric.icon}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                            <div className="flex items-center gap-1 text-sm">
                                {metric.change >= 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={metric.change >= 0 ? "text-green-600" : "text-red-600"}>
                                    {metric.change >= 0 ? "+" : ""}{metric.change}%
                                </span>
                                <span className="text-gray-400">{metric.changeLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Campaign Performance Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Campaign Performance</CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {campaignPerformance.map((campaign) => {
                                const openRate = ((campaign.opened / campaign.sent) * 100).toFixed(1);
                                const replyRate = ((campaign.replied / campaign.sent) * 100).toFixed(1);
                                return (
                                    <div key={campaign.name} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-gray-900">{campaign.name}</p>
                                                <Badge variant="outline" className={
                                                    campaign.status === 'active' ? 'border-green-500 text-green-600' :
                                                        campaign.status === 'completed' ? 'border-blue-500 text-blue-600' :
                                                            'border-amber-500 text-amber-600'
                                                }>
                                                    {campaign.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>{campaign.sent} sent</span>
                                                <span>{openRate}% opened</span>
                                                <span>{replyRate}% replied</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Emails */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Top Performing Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPerformingEmails.map((email, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-900 mb-2 text-sm">
                                        "{email.subject}"
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Open Rate</span>
                                                <span className="font-medium">{email.openRate}%</span>
                                            </div>
                                            <Progress value={email.openRate} className="h-1.5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Reply Rate</span>
                                                <span className="font-medium">{email.replyRate}%</span>
                                            </div>
                                            <Progress value={email.replyRate * 3} className="h-1.5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Goals Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5" /> Weekly Goals
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Emails Sent</span>
                                <span className="font-medium">1,247 / 1,500</span>
                            </div>
                            <Progress value={83} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Open Rate Target</span>
                                <span className="font-medium">34.2% / 35%</span>
                            </div>
                            <Progress value={97} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Replies</span>
                                <span className="font-medium">42 / 50</span>
                            </div>
                            <Progress value={84} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default Analytics;
