import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Sparkles,
    ArrowUpRight,
    Lock,
    Mail,
    Server,
    Globe
} from "lucide-react";

interface SpamIssue {
    severity: "high" | "medium" | "low";
    issue: string;
    fix: string;
}

interface DomainHealth {
    domain: string;
    score: number;
    status: "healthy" | "warning" | "critical";
    issues: string[];
}

const DeliverabilityOptimizer = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [spamScore, setSpamScore] = useState(2.4);

    const spamIssues: SpamIssue[] = [
        {
            severity: "high",
            issue: "Too many exclamation points (5 found)",
            fix: "Remove or reduce exclamation marks"
        },
        {
            severity: "medium",
            issue: "Subject line too long (78 chars)",
            fix: "Shorten to under 50 characters"
        },
        {
            severity: "low",
            issue: "Missing unsubscribe link",
            fix: "Add {{unsubscribe}} merge tag"
        },
    ];

    const domains: DomainHealth[] = [
        {
            domain: "sales.yourcompany.com",
            score: 92,
            status: "healthy",
            issues: []
        },
        {
            domain: "outreach.yourcompany.com",
            score: 68,
            status: "warning",
            issues: ["Low sending volume", "New domain (3 weeks old)"]
        },
        {
            domain: "cold.yourcompany.com",
            score: 45,
            status: "critical",
            issues: ["High bounce rate (8%)", "On 2 blacklists", "No SPF record"]
        },
    ];

    const recommendations = [
        {
            title: "Warm up 2 new domains",
            description: "Gradually increase sending volume over 4-6 weeks",
            impact: "+15% deliverability",
            isPro: false
        },
        {
            title: "Clean bounce list",
            description: "12 emails have bounced recently - remove them",
            impact: "-2% bounce rate",
            isPro: false
        },
        {
            title: "Enable DKIM signing",
            description: "Add cryptographic signature to improve trust",
            impact: "+8% inbox placement",
            isPro: true
        },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high": return "bg-red-100 text-red-700 border-red-200";
            case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
            case "low": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "healthy": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case "critical": return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-amber-600";
        return "text-red-600";
    };

    const runCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            setSpamScore(2.1);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Spam Score Checker */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Spam Score Checker
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={runCheck}
                            disabled={isChecking}
                        >
                            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                            {isChecking ? "Checking..." : "Re-check"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Score Display */}
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${spamScore < 3 ? 'text-green-600' : spamScore < 5 ? 'text-amber-600' : 'text-red-600'}`}>
                                {spamScore}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Score (lower is better)</div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Spam likelihood</span>
                                <Badge className={spamScore < 3 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                                    {spamScore < 3 ? 'Low Risk' : spamScore < 5 ? 'Medium Risk' : 'High Risk'}
                                </Badge>
                            </div>
                            <Progress value={Math.max(0, 100 - (spamScore * 10))} className="h-2" />
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Issues Found</h4>
                        {spamIssues.map((issue, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium">{issue.issue}</p>
                                        <p className="text-xs mt-1 opacity-80">Fix: {issue.fix}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Auto-fix
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Sender Reputation */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Sender Reputation
                        </CardTitle>
                        <Badge variant="outline" className="gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            24/7 Monitoring
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Domains List */}
                    <div className="space-y-3">
                        {domains.map((domain) => (
                            <div key={domain.domain} className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(domain.status)}
                                        <div>
                                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                                <Server className="w-3.5 h-3.5 text-gray-400" />
                                                {domain.domain}
                                            </p>
                                            {domain.issues.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {domain.issues.join(" • ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xl font-bold ${getScoreColor(domain.score)}`}>
                                            {domain.score}
                                        </span>
                                        <span className="text-xs text-gray-400">/100</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h4>
                        <div className="space-y-2">
                            {recommendations.map((rec, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                {rec.title}
                                                {rec.isPro && (
                                                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                        <Lock className="w-2.5 h-2.5 mr-0.5" />
                                                        PRO
                                                    </Badge>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">{rec.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-green-600">{rec.impact}</span>
                                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeliverabilityOptimizer;
