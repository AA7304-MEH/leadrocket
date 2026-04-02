import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Lightbulb,
    AlertTriangle,
    Sparkles,
    Clock,
    Lock
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

// Mock chart data
const chartData = [
    { date: "Mon", sent: 120, opens: 45, replies: 12 },
    { date: "Tue", sent: 180, opens: 72, replies: 18 },
    { date: "Wed", sent: 150, opens: 58, replies: 15 },
    { date: "Thu", sent: 200, opens: 85, replies: 22 },
    { date: "Fri", sent: 165, opens: 68, replies: 17 },
    { date: "Sat", sent: 80, opens: 28, replies: 6 },
    { date: "Sun", sent: 60, opens: 22, replies: 4 },
];

interface MetricCardProps {
    value: string;
    label: string;
    change: number;
    icon: string;
    onClick?: () => void;
}

const AnimatedMetricCard = ({ value, label, change, icon, onClick }: MetricCardProps) => {
    const isPositive = change >= 0;

    return (
        <div
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md group"
            onClick={onClick}
        >
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
            <div className={`flex items-center justify-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? '+' : ''}{change}% vs last week
            </div>
        </div>
    );
};

interface AISuggestionProps {
    type: "warning" | "opportunity";
    message: string;
    action: string;
    impact: string;
    implementTime: string;
    isPro?: boolean;
}

const AISuggestion = ({ type, message, action, impact, implementTime, isPro }: AISuggestionProps) => {
    const isWarning = type === "warning";

    return (
        <div className={`p-3 rounded-lg border ${isWarning ? 'bg-amber-50/50 border-amber-200' : 'bg-emerald-50/50 border-emerald-200'} transition-all hover:shadow-sm`}>
            <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-md ${isWarning ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                    {isWarning ?
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> :
                        <Lightbulb className="w-4 h-4 text-emerald-600" />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {impact}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {implementTime}
                        </span>
                    </div>
                    <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-2 text-xs font-medium"
                        disabled={isPro}
                    >
                        {isPro && <Lock className="w-3 h-3 mr-1" />}
                        {action}
                        {isPro && <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0">PRO</Badge>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const CampaignPerformance = () => {
    const [timeFilter, setTimeFilter] = useState<"7d" | "30d" | "quarter">("7d");

    const metrics = [
        { value: "1,245", label: "Emails Sent", change: 12, icon: "📨" },
        { value: "34%", label: "Open Rate", change: -11, icon: "📬" },
        { value: "8.2%", label: "Reply Rate", change: 2, icon: "💬" },
    ];

    const suggestions: AISuggestionProps[] = [
        {
            type: "warning",
            message: "Open rate dropped 15% on weekends",
            action: "Schedule weekday-only sends",
            impact: "+22% expected improvement",
            implementTime: "2 min"
        },
        {
            type: "opportunity",
            message: "Your top subject line has 45% open rate",
            action: "Apply to all campaigns",
            impact: "+31% more opens",
            implementTime: "1 min",
            isPro: false
        }
    ];

    const filters = [
        { label: "7D", value: "7d" as const },
        { label: "30D", value: "30d" as const },
        { label: "Quarter", value: "quarter" as const, isPro: true }
    ];

    return (
        <Card className="shadow-sm border-gray-200 overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Campaign Performance
                    </CardTitle>
                    <div className="flex gap-1">
                        {filters.map((filter) => (
                            <Button
                                key={filter.value}
                                variant={timeFilter === filter.value ? "default" : "ghost"}
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={() => !filter.isPro && setTimeFilter(filter.value)}
                                disabled={filter.isPro}
                            >
                                {filter.label}
                                {filter.isPro && <Lock className="w-3 h-3 ml-1" />}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                    {metrics.map((metric) => (
                        <AnimatedMetricCard key={metric.label} {...metric} />
                    ))}
                </div>

                {/* Performance Chart */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                            <Area
                                type="monotone"
                                dataKey="sent"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorSent)"
                                name="Sent"
                            />
                            <Area
                                type="monotone"
                                dataKey="opens"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorOpens)"
                                name="Opens"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Suggestions */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">AI Recommendations</span>
                    </div>
                    {suggestions.map((suggestion, index) => (
                        <AISuggestion key={index} {...suggestion} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default CampaignPerformance;
