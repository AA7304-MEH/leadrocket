
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search, Star, Lock, Copy, Eye, Filter, TrendingUp, Mail, Users, Briefcase,
    Sparkles, ArrowRight
} from "lucide-react";
import { useUpgrade } from "@/contexts/UpgradeContext";
import { toast } from "sonner";

interface Template {
    id: string;
    name: string;
    category: 'cold-outreach' | 'follow-up' | 'networking' | 'sales';
    subject: string;
    preview: string;
    openRate: number;
    replyRate: number;
    isPro: boolean;
    isNew?: boolean;
    isTrending?: boolean;
}

const templates: Template[] = [
    {
        id: "1",
        name: "The Curiosity Hook",
        category: "cold-outreach",
        subject: "Quick question about {company}",
        preview: "Hi {first_name}, I noticed {company} is doing impressive work in...",
        openRate: 45.2,
        replyRate: 12.8,
        isPro: false,
        isTrending: true,
    },
    {
        id: "2",
        name: "Value-First Intro",
        category: "cold-outreach",
        subject: "Idea for {company}",
        preview: "Hey {first_name}, I came across your profile and had a quick idea...",
        openRate: 38.5,
        replyRate: 9.4,
        isPro: false,
    },
    {
        id: "3",
        name: "The Soft Follow-Up",
        category: "follow-up",
        subject: "Re: {previous_subject}",
        preview: "Hi {first_name}, just wanted to follow up on my previous email...",
        openRate: 52.1,
        replyRate: 15.3,
        isPro: false,
    },
    {
        id: "4",
        name: "Break-Up Email",
        category: "follow-up",
        subject: "Should I close your file?",
        preview: "Hi {first_name}, I haven't heard back and want to respect your time...",
        openRate: 61.2,
        replyRate: 18.7,
        isPro: true,
    },
    {
        id: "5",
        name: "Mutual Connection",
        category: "networking",
        subject: "{mutual_connection} suggested we connect",
        preview: "Hi {first_name}, {mutual_connection} mentioned you'd be a great person...",
        openRate: 55.8,
        replyRate: 22.1,
        isPro: true,
        isNew: true,
    },
    {
        id: "6",
        name: "Conference Follow-Up",
        category: "networking",
        subject: "Great meeting you at {event}",
        preview: "Hi {first_name}, it was great chatting with you at {event}...",
        openRate: 48.3,
        replyRate: 14.2,
        isPro: false,
    },
    {
        id: "7",
        name: "Case Study Pitch",
        category: "sales",
        subject: "How {similar_company} increased replies by 3X",
        preview: "Hi {first_name}, I wanted to share a quick case study that might...",
        openRate: 42.1,
        replyRate: 11.5,
        isPro: true,
    },
    {
        id: "8",
        name: "ROI Calculator",
        category: "sales",
        subject: "Quick ROI calculation for {company}",
        preview: "Hi {first_name}, I ran some numbers and wanted to share...",
        openRate: 39.7,
        replyRate: 10.2,
        isPro: true,
    },
];

const categoryIcons = {
    'cold-outreach': <Mail className="w-4 h-4" />,
    'follow-up': <ArrowRight className="w-4 h-4" />,
    'networking': <Users className="w-4 h-4" />,
    'sales': <Briefcase className="w-4 h-4" />,
};

const categoryLabels = {
    'cold-outreach': 'Cold Outreach',
    'follow-up': 'Follow-Up',
    'networking': 'Networking',
    'sales': 'Sales',
};

const Templates = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const { showUpgrade } = useUpgrade();

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleUseTemplate = (template: Template) => {
        if (template.isPro) {
            showUpgrade("general");
        } else {
            toast.success(`Template "${template.name}" copied to clipboard!`);
        }
    };

    const handlePreview = (template: Template) => {
        toast.info(`Previewing: ${template.name}`);
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
                    <p className="text-gray-500">High-converting templates for every situation.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Sparkles className="w-4 h-4" /> AI Generate
                    </Button>
                </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
                <TabsList>
                    <TabsTrigger value="all">All Templates</TabsTrigger>
                    <TabsTrigger value="cold-outreach" className="gap-2">
                        <Mail className="w-4 h-4" /> Cold Outreach
                    </TabsTrigger>
                    <TabsTrigger value="follow-up" className="gap-2">
                        <ArrowRight className="w-4 h-4" /> Follow-Up
                    </TabsTrigger>
                    <TabsTrigger value="networking" className="gap-2">
                        <Users className="w-4 h-4" /> Networking
                    </TabsTrigger>
                    <TabsTrigger value="sales" className="gap-2">
                        <Briefcase className="w-4 h-4" /> Sales
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                        <CardContent className="p-0">
                            {/* Header */}
                            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 bg-primary/10 rounded text-primary">
                                            {categoryIcons[template.category]}
                                        </span>
                                        <span className="text-xs text-gray-500">{categoryLabels[template.category]}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {template.isNew && (
                                            <Badge className="bg-green-100 text-green-700 text-xs">New</Badge>
                                        )}
                                        {template.isTrending && (
                                            <Badge className="bg-orange-100 text-orange-700 text-xs gap-1">
                                                <TrendingUp className="w-3 h-3" /> Trending
                                            </Badge>
                                        )}
                                        {template.isPro && (
                                            <Badge className="bg-amber-100 text-amber-700 text-xs gap-1">
                                                <Lock className="w-3 h-3" /> Pro
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Subject: {template.subject}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {template.preview}
                                </p>

                                {/* Stats */}
                                <div className="flex gap-4 mb-4">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium">{template.openRate}%</span>
                                        <span className="text-gray-400">open</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Mail className="w-4 h-4 text-green-500" />
                                        <span className="font-medium">{template.replyRate}%</span>
                                        <span className="text-gray-400">reply</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={() => handlePreview(template)}
                                    >
                                        <Eye className="w-4 h-4" /> Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        className={`flex-1 gap-2 ${template.isPro ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}`}
                                        onClick={() => handleUseTemplate(template)}
                                    >
                                        {template.isPro ? (
                                            <>
                                                <Lock className="w-4 h-4" /> Unlock
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" /> Use
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Templates;
