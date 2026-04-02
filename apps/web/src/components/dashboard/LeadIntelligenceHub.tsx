import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    Filter,
    TrendingUp,
    Building2,
    Mail,
    Phone,
    Linkedin,
    Sparkles,
    ChevronRight,
    Star,
    Clock,
    DollarSign,
    Zap
} from "lucide-react";

interface LeadProps {
    id: string;
    name: string;
    company: string;
    score: number;
    status: "hot" | "warm" | "cold";
    enrichedData?: {
        funding?: string;
        growth?: string;
        triggerEvent?: string;
    };
    lastContact?: string;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-amber-600 bg-amber-100";
    return "text-gray-600 bg-gray-100";
};

const getStatusBadge = (status: LeadProps["status"]) => {
    const styles = {
        hot: "bg-red-100 text-red-700 border-red-200",
        warm: "bg-amber-100 text-amber-700 border-amber-200",
        cold: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return styles[status];
};

const LeadCard = ({ lead }: { lead: LeadProps }) => (
    <div className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{lead.name}</h4>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusBadge(lead.status)}`}>
                        {lead.status.toUpperCase()}
                    </Badge>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{lead.company}</span>
                </div>

                {/* Enrichment Preview */}
                {lead.enrichedData && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {lead.enrichedData.funding && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px]">
                                <DollarSign className="w-2.5 h-2.5" />
                                {lead.enrichedData.funding}
                            </span>
                        )}
                        {lead.enrichedData.growth && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">
                                <TrendingUp className="w-2.5 h-2.5" />
                                {lead.enrichedData.growth}
                            </span>
                        )}
                        {lead.enrichedData.triggerEvent && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px]">
                                <Zap className="w-2.5 h-2.5" />
                                {lead.enrichedData.triggerEvent}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Score Circle */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getScoreColor(lead.score)}`}>
                {lead.score}
            </div>
        </div>

        {/* Actions */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Mail className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Phone className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Linkedin className="w-3.5 h-3.5" />
                </Button>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {lead.lastContact || "Never contacted"}
            </div>
        </div>
    </div>
);

const LeadIntelligenceHub = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const leads: LeadProps[] = [
        {
            id: "1",
            name: "Sarah Chen",
            company: "TechScale Inc",
            score: 92,
            status: "hot",
            enrichedData: {
                funding: "$15M Series B",
                growth: "+220% YoY",
                triggerEvent: "Hired new CMO"
            },
            lastContact: "2 days ago"
        },
        {
            id: "2",
            name: "Michael Torres",
            company: "CloudFlow Systems",
            score: 78,
            status: "warm",
            enrichedData: {
                funding: "$5M Seed",
                growth: "+85% YoY"
            },
            lastContact: "1 week ago"
        },
        {
            id: "3",
            name: "Emily Richards",
            company: "DataSync Pro",
            score: 65,
            status: "warm",
            enrichedData: {
                triggerEvent: "Expanding team"
            },
            lastContact: "3 days ago"
        },
        {
            id: "4",
            name: "James Wilson",
            company: "StartupHub",
            score: 45,
            status: "cold",
            lastContact: "2 weeks ago"
        }
    ];

    const stats = [
        { label: "Hot Leads", value: 8, icon: <Star className="w-4 h-4 text-red-500" />, color: "bg-red-50" },
        { label: "This Week", value: 23, icon: <TrendingUp className="w-4 h-4 text-green-500" />, color: "bg-green-50" },
        { label: "Enriched", value: 156, icon: <Sparkles className="w-4 h-4 text-purple-500" />, color: "bg-purple-50" },
    ];

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Lead Intelligence
                    </CardTitle>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                        View All
                        <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`${stat.color} rounded-lg p-2.5 text-center`}>
                            <div className="flex items-center justify-center mb-1">
                                {stat.icon}
                            </div>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            <p className="text-[10px] text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 h-8 text-sm"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>

                {/* Lead List */}
                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>

                {/* AI Suggestion */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-3 border border-primary/10">
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                            <p className="text-xs font-medium text-gray-800">AI Recommendation</p>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Sarah Chen shows high intent signals. Send a partnership proposal within 48 hours for best results.
                            </p>
                            <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                                Send AI-crafted email →
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeadIntelligenceHub;
