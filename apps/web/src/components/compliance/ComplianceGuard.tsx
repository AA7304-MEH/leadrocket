
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Warning {
    detected: string;
    level: 'Low' | 'Medium' | 'High';
    category: string;
    suggestion: string;
}

interface AuditResult {
    score: number;
    riskLevel: string;
    warnings: Warning[];
}

export const ComplianceGuard: React.FC = () => {
    const [content, setContent] = useState('');
    const [result, setResult] = useState<AuditResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAudit = async () => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            const response = await fetch('/api/compliance/audit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });
            const data = await response.json();
            if (data.success) {
                setResult(data.data);
                toast.success('Audit complete');
            }
        } catch (error) {
            toast.error('Audit failed');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        if (level === 'High') return 'bg-red-100 text-red-800 border-red-200';
        if (level === 'Medium') return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    return (
        <Card className="h-full border-t-4 border-t-blue-500">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            Predictive Compliance Guard
                        </CardTitle>
                        <CardDescription>AI Legal & Spam Risk Detector</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Draft your email content here to check for risks..."
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex justify-between items-center">
                    <Button onClick={handleAudit} disabled={loading || !content}>
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Scan for Risks
                    </Button>
                    {result && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Risk Score:</span>
                            <Badge variant={result.score > 80 ? 'default' : 'destructive'} className={result.score > 80 ? 'bg-green-600' : ''}>
                                {result.score}/100
                            </Badge>
                        </div>
                    )}
                </div>

                {result && (
                    <div className={`mt-4 p-4 rounded-lg border ${result.riskLevel === 'High' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            {result.riskLevel === 'Low' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                            Audit Results ({result.riskLevel} Risk)
                        </h4>

                        {result.warnings.length === 0 ? (
                            <p className="text-sm text-green-700">No content risks detected. Good to go!</p>
                        ) : (
                            <div className="space-y-3">
                                {result.warnings.map((warn, i) => (
                                    <div key={i} className="flex gap-3 text-sm bg-white p-2 rounded border shadow-sm">
                                        <div className="mt-1"><AlertTriangle className="h-3 w-3 text-orange-500" /></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={getRiskColor(warn.level)}>{warn.category}</Badge>
                                                <span className="font-mono text-xs bg-slate-100 px-1 rounded">"{warn.detected}"</span>
                                            </div>
                                            <p className="text-slate-600">Tip: {warn.suggestion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
