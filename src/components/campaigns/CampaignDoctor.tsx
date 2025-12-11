
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CampaignDoctor = () => {
    const { toast } = useToast();
    const [campaign, setCampaign] = useState({
        subject: '',
        body: '',
        type: 'Cold Email'
    });
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!campaign.subject || !campaign.body) {
            toast({
                title: "Incomplete Input",
                description: "Please enter both a subject and body to analyze.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/doctor/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(campaign)
            });

            const data = await response.json();
            if (data.success) {
                setAnalysis(data.data);
                toast({
                    title: "Analysis Complete",
                    description: `Score: ${data.data.score}/100`,
                });
            } else {
                throw new Error(data.message || 'Analysis failed');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to analyze campaign. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const applyFixes = () => {
        if (analysis?.fixedContent) {
            setCampaign({
                ...campaign,
                subject: analysis.fixedContent.subject,
                body: analysis.fixedContent.body
            });
            toast({
                title: "Fixes Applied",
                description: "Campaign updated with AI suggestions.",
            });
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Draft</CardTitle>
                        <CardDescription>Paste your email here to get a diagnosis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Campaign Type</label>
                            <Input
                                value={campaign.type}
                                onChange={(e) => setCampaign({ ...campaign, type: e.target.value })}
                                placeholder="e.g. Cold Email, LinkedIn Connection"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject Line</label>
                            <Input
                                value={campaign.subject}
                                onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                                placeholder="Enter subject line..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Body</label>
                            <Textarea
                                value={campaign.body}
                                onChange={(e) => setCampaign({ ...campaign, body: e.target.value })}
                                placeholder="Hi [Name], ..."
                                className="min-h-[300px]"
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleAnalyze}
                            disabled={loading}
                        >
                            {loading ? (
                                <>Analyzing <Sparkles className="ml-2 w-4 h-4 animate-spin" /></>
                            ) : (
                                <>Analyze Campaign <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                {!analysis ? (
                    <Card className="h-full flex items-center justify-center bg-gray-50 border-dashed">
                        <CardContent className="text-center py-12">
                            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Ready to Diagnose</h3>
                            <p className="text-gray-500">Run an analysis to see your score and improvements.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>Diagnosis Results</CardTitle>
                                <Badge variant="outline" className="text-lg px-3 py-1">
                                    Score: <span className={`ml-1 font-bold ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{analysis.score}</span>/100
                                </Badge>
                            </div>
                            <Progress value={analysis.score} className={`h-2 mt-2 ${getScoreColor(analysis.score)}`} />
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="issues" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="issues">Issues & Fixes</TabsTrigger>
                                    <TabsTrigger value="preview">Optimized Preview</TabsTrigger>
                                </TabsList>
                                <TabsContent value="issues" className="space-y-4 mt-4">
                                    {analysis.issues.map((issue: any, index: number) => (
                                        <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg border">
                                            {issue.type === 'critical' ? (
                                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            ) : issue.type === 'warning' ? (
                                                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{issue.text}</p>
                                                <p className="text-sm text-gray-500 mt-1">💡 Fix: {issue.fix}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-100 mb-4">
                                            <span className="text-green-700 font-medium">Predicted Improvement</span>
                                            <span className="text-green-800 font-bold">+{analysis.predictedImprovement} Replies</span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="preview" className="space-y-4 mt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-gray-500 font-bold">New Subject</label>
                                            <div className="p-3 bg-white border rounded text-gray-900 font-medium">
                                                {analysis.fixedContent.subject}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-gray-500 font-bold">New Body</label>
                                            <div className="p-3 bg-white border rounded text-gray-900 whitespace-pre-wrap">
                                                {analysis.fixedContent.body}
                                            </div>
                                        </div>
                                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={applyFixes}>
                                            <CheckCircle className="mr-2 w-4 h-4" /> Apply All Fixes
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CampaignDoctor;
