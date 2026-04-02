import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    TrendingUp,
    TrendingDown,
    Mail,
    RefreshCw,
    Zap,
    Eye,
    Target,
    MessageSquare,
    BarChart3
} from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

interface DeliverabilityFactor {
    name: string;
    score: number;
    weight: number;
    status: 'good' | 'warning' | 'critical';
    recommendation?: string;
}

interface SpamTestResult {
    provider: string;
    result: 'inbox' | 'spam' | 'promo';
    score: number;
}

const DeliverabilityMonitor: React.FC = () => {
    const { toast } = useToast();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [testEmail, setTestEmail] = useState('');

    const [overallScore] = useState(78);

    const [factors] = useState<DeliverabilityFactor[]>([
        { name: 'Sender Reputation', score: 92, weight: 35, status: 'good' },
        { name: 'Email Authentication', score: 100, weight: 20, status: 'good', recommendation: 'SPF, DKIM, DMARC all configured' },
        { name: 'Content Quality', score: 72, weight: 20, status: 'warning', recommendation: 'Reduce spam trigger words' },
        { name: 'Engagement Rate', score: 68, weight: 15, status: 'warning', recommendation: 'Improve subject lines' },
        { name: 'Bounce Rate', score: 65, weight: 10, status: 'warning', recommendation: 'Clean your email list' },
    ]);

    const [spamTests] = useState<SpamTestResult[]>([
        { provider: 'Gmail', result: 'inbox', score: 95 },
        { provider: 'Outlook', result: 'inbox', score: 88 },
        { provider: 'Yahoo', result: 'promo', score: 72 },
        { provider: 'Apple Mail', result: 'inbox', score: 90 },
    ]);

    const [recentIssues] = useState([
        { type: 'hard_bounce', count: 12, trend: 'up', percentage: 1.2 },
        { type: 'soft_bounce', count: 34, trend: 'down', percentage: 3.4 },
        { type: 'complaints', count: 2, trend: 'stable', percentage: 0.2 },
        { type: 'unsubscribes', count: 28, trend: 'up', percentage: 2.8 },
    ]);

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-amber-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-100';
        if (score >= 70) return 'bg-blue-100';
        if (score >= 50) return 'bg-amber-100';
        return 'bg-red-100';
    };

    const runSpamTest = async () => {
        if (!testEmail.trim()) {
            toast({ title: 'Enter email content', description: 'Please paste your email to test' });
            return;
        }

        setIsAnalyzing(true);
        toast({ title: 'Analyzing...', description: 'Running spam checks' });

        setTimeout(() => {
            setIsAnalyzing(false);
            toast({
                title: 'Analysis Complete ✅',
                description: 'Your email scored 82/100 - Good deliverability'
            });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Deliverability Monitor
                    </h2>
                    <p className="text-gray-500">Track and optimize your email deliverability</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                </Button>
            </div>

            {/* Overall Score */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4">
                    <Card className={`${getScoreBgColor(overallScore)} border-0`}>
                        <CardContent className="pt-6 text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        className="text-white/50"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={`${overallScore * 3.52} 352`}
                                        className={getScoreColor(overallScore)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                                        {overallScore}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-1">Deliverability Score</h3>
                            <p className={`text-sm ${getScoreColor(overallScore)}`}>
                                {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Score Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {factors.map((factor) => (
                                <div key={factor.name} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{factor.name}</span>
                                            {factor.status === 'good' && (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            )}
                                            {factor.status === 'warning' && (
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            )}
                                            {factor.status === 'critical' && (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <span className={`font-semibold ${getScoreColor(factor.score)}`}>
                                            {factor.score}%
                                        </span>
                                    </div>
                                    <Progress value={factor.score} className="h-2" />
                                    {factor.recommendation && factor.status !== 'good' && (
                                        <p className="text-xs text-gray-500">💡 {factor.recommendation}</p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="inbox">
                <TabsList>
                    <TabsTrigger value="inbox" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Inbox Placement
                    </TabsTrigger>
                    <TabsTrigger value="spam" className="gap-2">
                        <Zap className="w-4 h-4" />
                        Spam Test
                    </TabsTrigger>
                    <TabsTrigger value="issues" className="gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Issues
                    </TabsTrigger>
                </TabsList>

                {/* Inbox Placement */}
                <TabsContent value="inbox" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Inbox Placement by Provider
                                </span>
                                <Button size="sm" variant="outline">Run New Test</Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                {spamTests.map((test) => (
                                    <Card
                                        key={test.provider}
                                        className={`${test.result === 'inbox' ? 'bg-green-50 border-green-200' :
                                                test.result === 'promo' ? 'bg-amber-50 border-amber-200' :
                                                    'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <CardContent className="pt-4 text-center">
                                            <p className="font-medium mb-2">{test.provider}</p>
                                            <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${test.result === 'inbox' ? 'bg-green-100' :
                                                    test.result === 'promo' ? 'bg-amber-100' :
                                                        'bg-red-100'
                                                }`}>
                                                {test.result === 'inbox' && <CheckCircle className="w-6 h-6 text-green-600" />}
                                                {test.result === 'promo' && <MessageSquare className="w-6 h-6 text-amber-600" />}
                                                {test.result === 'spam' && <XCircle className="w-6 h-6 text-red-600" />}
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    test.result === 'inbox' ? 'bg-green-100 text-green-700 border-green-300' :
                                                        test.result === 'promo' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                                                            'bg-red-100 text-red-700 border-red-300'
                                                }
                                            >
                                                {test.result === 'inbox' ? 'Primary Inbox' :
                                                    test.result === 'promo' ? 'Promotions' : 'Spam'}
                                            </Badge>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Score: {test.score}/100
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Spam Test */}
                <TabsContent value="spam" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Email Spam Test
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Paste your email content here to check for spam triggers..."
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="min-h-[200px]"
                            />
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    We'll analyze your email against 50+ spam filters
                                </div>
                                <Button onClick={runSpamTest} disabled={isAnalyzing}>
                                    {isAnalyzing ? 'Analyzing...' : 'Check Spam Score'}
                                </Button>
                            </div>

                            {/* Sample Results */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-3">Common Spam Triggers to Avoid:</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {['FREE!!!', 'Act Now', 'Limited Time', 'Click Here', 'Congratulations', 'Winner'].map(word => (
                                        <Badge key={word} variant="outline" className="justify-center py-1">
                                            {word}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Issues */}
                <TabsContent value="issues" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Recent Deliverability Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                {recentIssues.map((issue) => (
                                    <Card key={issue.type}>
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-500 capitalize">
                                                    {issue.type.replace('_', ' ')}
                                                </span>
                                                {issue.trend === 'up' && (
                                                    <TrendingUp className="w-4 h-4 text-red-500" />
                                                )}
                                                {issue.trend === 'down' && (
                                                    <TrendingDown className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                            <p className="text-2xl font-bold">{issue.count}</p>
                                            <p className="text-sm text-gray-500">
                                                {issue.percentage}% of sent
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-amber-800">Action Required</h4>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Your bounce rate has increased by 15% this week. Consider cleaning your email list
                                            to maintain sender reputation.
                                        </p>
                                        <Button size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700">
                                            Clean Email List
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DeliverabilityMonitor;
