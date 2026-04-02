import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
    Sparkles,
    Zap,
    Users,
    Mail,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Loader2,
    Eye,
    RefreshCw,
    CreditCard,
    TrendingUp
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

interface Lead {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company: string;
    title: string;
    industry: string;
}

interface PersonalizationResult {
    leadId: string;
    original: string;
    personalized: string;
    changes: { type: string; from: string; to: string }[];
    score: number;
}

interface BulkPersonalizerProps {
    campaignId?: string;
    leads?: Lead[];
    emailContent: string;
    onComplete: (results: PersonalizationResult[]) => void;
}

const BulkPersonalizer: React.FC<BulkPersonalizerProps> = ({
    campaignId,
    leads = [],
    emailContent,
    onComplete
}) => {
    const { toast } = useToast();
    const [intensity, setIntensity] = useState([3]); // 1-5 scale
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<PersonalizationResult[]>([]);
    const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
    const [creditsAvailable] = useState(150);

    const [options, setOptions] = useState({
        personalizeOpening: true,
        personalizeSubject: true,
        personalizeBody: true,
        addCompanyMention: true,
        adjustTone: 'professional' as 'professional' | 'casual' | 'friendly'
    });

    // Mock leads for demo
    const sampleLeads: Lead[] = leads.length > 0 ? leads : [
        { id: '1', email: 'john@acme.com', first_name: 'John', last_name: 'Smith', company: 'Acme Corp', title: 'VP Sales', industry: 'Technology' },
        { id: '2', email: 'sarah@techstart.io', first_name: 'Sarah', last_name: 'Johnson', company: 'TechStart', title: 'CEO', industry: 'SaaS' },
        { id: '3', email: 'mike@enterprise.co', first_name: 'Mike', last_name: 'Brown', company: 'Enterprise Solutions', title: 'Director', industry: 'Consulting' },
    ];

    const estimatedCredits = sampleLeads.length * intensity[0];
    const hasEnoughCredits = creditsAvailable >= estimatedCredits;

    const getIntensityLabel = (value: number): string => {
        if (value <= 1) return 'Light';
        if (value <= 2) return 'Moderate';
        if (value <= 3) return 'Standard';
        if (value <= 4) return 'Heavy';
        return 'Maximum';
    };

    const generatePersonalization = async () => {
        setIsProcessing(true);
        setProgress(0);
        setResults([]);

        // Simulate AI personalization for each lead
        for (let i = 0; i < sampleLeads.length; i++) {
            const lead = sampleLeads[i];

            await new Promise(resolve => setTimeout(resolve, 800));

            const personalized = generatePersonalizedEmail(lead, emailContent || getTemplateEmail(), intensity[0]);

            setResults(prev => [...prev, personalized]);
            setProgress(((i + 1) / sampleLeads.length) * 100);
        }

        setIsProcessing(false);
        toast({
            title: "Personalization Complete! ✨",
            description: `${sampleLeads.length} emails personalized successfully`
        });
    };

    const getTemplateEmail = () => `Hi {{first_name}},

I noticed your company is doing great things in your industry. I wanted to reach out because we help companies like yours improve their outreach.

Would you be open to a quick 15-minute call to discuss how we could help {{company}}?

Best regards,
Alex`;

    const generatePersonalizedEmail = (lead: Lead, template: string, intensity: number): PersonalizationResult => {
        const changes: { type: string; from: string; to: string }[] = [];
        let personalized = template;

        // Variable replacement
        personalized = personalized.replace(/\{\{first_name\}\}/g, lead.first_name);
        personalized = personalized.replace(/\{\{last_name\}\}/g, lead.last_name);
        personalized = personalized.replace(/\{\{company\}\}/g, lead.company);
        personalized = personalized.replace(/\{\{title\}\}/g, lead.title);
        personalized = personalized.replace(/\{\{industry\}\}/g, lead.industry);

        // AI-style personalizations based on intensity
        if (intensity >= 2 && options.personalizeOpening) {
            const openings = [
                `Hi ${lead.first_name}, I came across ${lead.company}'s recent work in ${lead.industry} and was impressed.`,
                `Hi ${lead.first_name}, as a ${lead.title} at ${lead.company}, I thought you'd find this relevant.`,
                `Hi ${lead.first_name}, I noticed ${lead.company} is making waves in the ${lead.industry} space.`
            ];
            const newOpening = openings[Math.floor(Math.random() * openings.length)];
            personalized = personalized.replace(/Hi \{\{first_name\}\},\n\n[^\n]+/, newOpening);
            changes.push({ type: 'Opening', from: 'Generic greeting', to: 'Personalized intro' });
        }

        if (intensity >= 3 && options.addCompanyMention) {
            personalized = personalized.replace(
                'companies like yours',
                `companies like ${lead.company} in the ${lead.industry} sector`
            );
            changes.push({ type: 'Company', from: 'Generic reference', to: 'Specific company mention' });
        }

        if (intensity >= 4) {
            personalized = personalized.replace(
                'improve their outreach',
                `boost ${lead.industry === 'SaaS' ? 'conversion rates' : 'lead generation'} by 40%`
            );
            changes.push({ type: 'Value Prop', from: 'Generic benefit', to: 'Industry-specific ROI' });
        }

        if (intensity >= 5) {
            personalized += `\n\nP.S. I saw ${lead.company}'s announcement last week - congrats on the growth!`;
            changes.push({ type: 'Postscript', from: 'None', to: 'Company-specific hook' });
        }

        const score = 60 + (intensity * 8) + Math.floor(Math.random() * 10);

        return {
            leadId: lead.id,
            original: template,
            personalized,
            changes,
            score: Math.min(score, 100)
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        AI Bulk Personalization
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Personalize emails for {sampleLeads.length} leads in seconds
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">AI Credits</p>
                        <p className="font-semibold">{creditsAvailable} available</p>
                    </div>
                    <Button variant="outline" size="sm">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Buy Credits
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Settings Panel */}
                <div className="col-span-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Personalization Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Intensity Slider */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Personalization Intensity</label>
                                    <Badge variant="outline">{getIntensityLabel(intensity[0])}</Badge>
                                </div>
                                <Slider
                                    value={intensity}
                                    onValueChange={setIntensity}
                                    min={1}
                                    max={5}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Light</span>
                                    <span>Maximum</span>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={options.personalizeOpening}
                                        onChange={(e) => setOptions({ ...options, personalizeOpening: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Personalize opening lines</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={options.personalizeSubject}
                                        onChange={(e) => setOptions({ ...options, personalizeSubject: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Personalize subject lines</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={options.addCompanyMention}
                                        onChange={(e) => setOptions({ ...options, addCompanyMention: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Add company-specific mentions</span>
                                </label>
                            </div>

                            {/* Tone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Tone</label>
                                <Select
                                    value={options.adjustTone}
                                    onValueChange={(value: 'professional' | 'casual' | 'friendly') =>
                                        setOptions({ ...options, adjustTone: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="friendly">Friendly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Credit Estimate */}
                    <Card className={!hasEnoughCredits ? 'border-red-200 bg-red-50' : 'bg-primary/5'}>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Estimated Cost</span>
                                <span className="font-bold text-lg">{estimatedCredits} credits</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{sampleLeads.length} leads × {intensity[0]} intensity</span>
                                {!hasEnoughCredits && (
                                    <span className="text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Not enough credits
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Button */}
                    <Button
                        className="w-full gap-2"
                        size="lg"
                        onClick={generatePersonalization}
                        disabled={isProcessing || !hasEnoughCredits}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Personalizing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                Personalize {sampleLeads.length} Emails
                            </>
                        )}
                    </Button>
                </div>

                {/* Preview Panel */}
                <div className="col-span-8">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Preview Results
                                </span>
                                {results.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={generatePersonalization}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Regenerate
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isProcessing && (
                                <div className="text-center py-12">
                                    <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                                    <p className="font-medium mb-2">AI is personalizing your emails...</p>
                                    <Progress value={progress} className="h-2 max-w-xs mx-auto" />
                                    <p className="text-sm text-gray-500 mt-2">
                                        {Math.round(progress)}% complete
                                    </p>
                                </div>
                            )}

                            {!isProcessing && results.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="font-medium">No previews yet</p>
                                    <p className="text-sm">Configure settings and click "Personalize" to see results</p>
                                </div>
                            )}

                            {!isProcessing && results.length > 0 && (
                                <Tabs defaultValue={results[0]?.leadId}>
                                    <TabsList className="mb-4">
                                        {results.map((result, i) => {
                                            const lead = sampleLeads.find(l => l.id === result.leadId);
                                            return (
                                                <TabsTrigger key={result.leadId} value={result.leadId}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{lead?.first_name}</span>
                                                        <Badge
                                                            variant="outline"
                                                            className={result.score >= 80 ? 'bg-green-100 text-green-700' : ''}
                                                        >
                                                            {result.score}%
                                                        </Badge>
                                                    </div>
                                                </TabsTrigger>
                                            );
                                        })}
                                    </TabsList>

                                    {results.map((result) => {
                                        const lead = sampleLeads.find(l => l.id === result.leadId);
                                        return (
                                            <TabsContent key={result.leadId} value={result.leadId}>
                                                <div className="space-y-4">
                                                    {/* Lead Info */}
                                                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                            {lead?.first_name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{lead?.first_name} {lead?.last_name}</p>
                                                            <p className="text-sm text-gray-500">{lead?.title} at {lead?.company}</p>
                                                        </div>
                                                        <div className="ml-auto flex items-center gap-2">
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm font-medium text-green-600">
                                                                Personalization Score: {result.score}%
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Changes Made */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.changes.map((change, i) => (
                                                            <Badge key={i} variant="secondary" className="gap-1">
                                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                                                {change.type}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    {/* Email Preview */}
                                                    <div className="p-4 bg-white border rounded-lg font-mono text-sm whitespace-pre-wrap">
                                                        {result.personalized}
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        );
                                    })}
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Apply to Campaign */}
            {results.length > 0 && !isProcessing && (
                <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="font-semibold">All {results.length} emails personalized!</p>
                                    <p className="text-sm text-gray-500">
                                        Average personalization score: {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%
                                    </p>
                                </div>
                            </div>
                            <Button onClick={() => onComplete(results)} className="gap-2">
                                Apply to Campaign
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BulkPersonalizer;
