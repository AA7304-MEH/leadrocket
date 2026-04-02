import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
    FlaskConical,
    Mail,
    TrendingUp,
    Trophy,
    Plus,
    Trash2,
    BarChart3,
    Play,
    Pause,
    CheckCircle
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ABVariant {
    id: string;
    name: string;
    subject: string;
    content: string;
    weight: number;
    stats: {
        sent: number;
        opens: number;
        clicks: number;
        replies: number;
    };
}

interface ABTestBuilderProps {
    campaignId?: string;
    onSave: (variants: ABVariant[], settings: ABTestSettings) => void;
    onStart?: () => void;
}

interface ABTestSettings {
    testType: 'subject' | 'content' | 'full';
    sampleSize: number;
    winnerCriteria: 'open_rate' | 'click_rate' | 'reply_rate';
    autoDeclareWinner: boolean;
    testDuration: number;
}

const ABTestBuilder: React.FC<ABTestBuilderProps> = ({
    campaignId,
    onSave,
    onStart
}) => {
    const { toast } = useToast();
    const [isRunning, setIsRunning] = useState(false);

    const [variants, setVariants] = useState<ABVariant[]>([
        {
            id: 'A',
            name: 'Variant A',
            subject: 'Quick question about {{company}}',
            content: 'Hi {{first_name}},\n\nI noticed...',
            weight: 50,
            stats: { sent: 0, opens: 0, clicks: 0, replies: 0 }
        },
        {
            id: 'B',
            name: 'Variant B',
            subject: '{{first_name}}, saw your work at {{company}}',
            content: 'Hey {{first_name}},\n\nI came across...',
            weight: 50,
            stats: { sent: 0, opens: 0, clicks: 0, replies: 0 }
        }
    ]);

    const [settings, setSettings] = useState<ABTestSettings>({
        testType: 'subject',
        sampleSize: 20,
        winnerCriteria: 'open_rate',
        autoDeclareWinner: true,
        testDuration: 24
    });

    const [activeVariant, setActiveVariant] = useState('A');

    const addVariant = () => {
        if (variants.length >= 4) {
            toast({ title: "Maximum Reached", description: "You can have up to 4 variants" });
            return;
        }

        const letters = ['A', 'B', 'C', 'D'];
        const nextLetter = letters[variants.length];
        const newWeight = Math.floor(100 / (variants.length + 1));

        const newVariant: ABVariant = {
            id: nextLetter,
            name: `Variant ${nextLetter}`,
            subject: '',
            content: '',
            weight: newWeight,
            stats: { sent: 0, opens: 0, clicks: 0, replies: 0 }
        };

        const updatedVariants = variants.map(v => ({ ...v, weight: newWeight }));
        setVariants([...updatedVariants, newVariant]);
        setActiveVariant(nextLetter);
        toast({ title: "Variant Added", description: `Variant ${nextLetter} created` });
    };

    const removeVariant = (variantId: string) => {
        if (variants.length <= 2) {
            toast({ title: "Cannot Remove", description: "A/B test needs at least 2 variants" });
            return;
        }

        const newWeight = Math.floor(100 / (variants.length - 1));
        const updatedVariants = variants
            .filter(v => v.id !== variantId)
            .map(v => ({ ...v, weight: newWeight }));

        setVariants(updatedVariants);
        if (activeVariant === variantId) {
            setActiveVariant(updatedVariants[0].id);
        }
    };

    const updateVariant = (variantId: string, updates: Partial<ABVariant>) => {
        setVariants(variants.map(v => v.id === variantId ? { ...v, ...updates } : v));
    };

    const calculateWinProbability = (variant: ABVariant): number => {
        const totalOpens = variants.reduce((acc, v) => acc + v.stats.opens, 0);
        if (totalOpens === 0) return 0;
        return Math.round((variant.stats.opens / Math.max(totalOpens, 1)) * 100);
    };

    const getOpenRate = (variant: ABVariant): number => {
        if (variant.stats.sent === 0) return 0;
        return Math.round((variant.stats.opens / variant.stats.sent) * 100);
    };

    const handleStartTest = () => {
        setIsRunning(true);
        // Simulate test starting
        toast({ title: "A/B Test Started! 🚀", description: "Emails are being sent to your sample" });

        // Simulate results coming in
        setTimeout(() => {
            setVariants(prev => prev.map((v, i) => ({
                ...v,
                stats: {
                    sent: 50,
                    opens: 15 + (i * 5) + Math.floor(Math.random() * 10),
                    clicks: 5 + (i * 2) + Math.floor(Math.random() * 5),
                    replies: 2 + Math.floor(Math.random() * 3)
                }
            })));
        }, 2000);

        onStart?.();
    };

    const activeVariantData = variants.find(v => v.id === activeVariant);

    return (
        <div className="space-y-6">
            {/* Test Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-primary" />
                        A/B Test Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Test Type</label>
                            <Select
                                value={settings.testType}
                                onValueChange={(value: 'subject' | 'content' | 'full') =>
                                    setSettings({ ...settings, testType: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="subject">Subject Line Only</SelectItem>
                                    <SelectItem value="content">Email Content</SelectItem>
                                    <SelectItem value="full">Full Email</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sample Size (%)</label>
                            <Select
                                value={settings.sampleSize.toString()}
                                onValueChange={(value) =>
                                    setSettings({ ...settings, sampleSize: parseInt(value) })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10% of leads</SelectItem>
                                    <SelectItem value="20">20% of leads</SelectItem>
                                    <SelectItem value="30">30% of leads</SelectItem>
                                    <SelectItem value="50">50% of leads</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Winner Criteria</label>
                            <Select
                                value={settings.winnerCriteria}
                                onValueChange={(value: 'open_rate' | 'click_rate' | 'reply_rate') =>
                                    setSettings({ ...settings, winnerCriteria: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open_rate">Highest Open Rate</SelectItem>
                                    <SelectItem value="click_rate">Highest Click Rate</SelectItem>
                                    <SelectItem value="reply_rate">Highest Reply Rate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Test Duration</label>
                            <Select
                                value={settings.testDuration.toString()}
                                onValueChange={(value) =>
                                    setSettings({ ...settings, testDuration: parseInt(value) })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12">12 hours</SelectItem>
                                    <SelectItem value="24">24 hours</SelectItem>
                                    <SelectItem value="48">48 hours</SelectItem>
                                    <SelectItem value="72">72 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Variants */}
            <div className="grid grid-cols-12 gap-6">
                {/* Variant Tabs */}
                <div className="col-span-3 space-y-2">
                    {variants.map((variant) => (
                        <Card
                            key={variant.id}
                            className={`cursor-pointer transition-all ${activeVariant === variant.id
                                    ? 'ring-2 ring-primary bg-primary/5'
                                    : 'hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveVariant(variant.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${variant.id === 'A' ? 'bg-blue-100 text-blue-700' :
                                                variant.id === 'B' ? 'bg-purple-100 text-purple-700' :
                                                    variant.id === 'C' ? 'bg-green-100 text-green-700' :
                                                        'bg-orange-100 text-orange-700'
                                            }`}>
                                            {variant.id}
                                        </div>
                                        <span className="font-medium">{variant.name}</span>
                                    </div>
                                    {variants.length > 2 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeVariant(variant.id); }}
                                            className="p-1 hover:bg-red-100 rounded text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {isRunning && (
                                    <div className="space-y-2 mt-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Open Rate</span>
                                            <span className="font-medium">{getOpenRate(variant)}%</span>
                                        </div>
                                        <Progress value={getOpenRate(variant)} className="h-1.5" />
                                        <div className="flex justify-between text-xs mt-2">
                                            <span className="text-gray-500">Win Probability</span>
                                            <span className="font-medium text-primary">{calculateWinProbability(variant)}%</span>
                                        </div>
                                    </div>
                                )}

                                <Badge variant="outline" className="mt-2">
                                    {variant.weight}% traffic
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}

                    <Button variant="outline" className="w-full gap-2" onClick={addVariant}>
                        <Plus className="w-4 h-4" />
                        Add Variant
                    </Button>
                </div>

                {/* Variant Editor */}
                <div className="col-span-9">
                    {activeVariantData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    {activeVariantData.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject Line</label>
                                    <Input
                                        placeholder="Enter subject line..."
                                        value={activeVariantData.subject}
                                        onChange={(e) => updateVariant(activeVariantData.id, { subject: e.target.value })}
                                        disabled={isRunning}
                                    />
                                </div>

                                {settings.testType !== 'subject' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Content</label>
                                        <Textarea
                                            placeholder="Write your email content..."
                                            value={activeVariantData.content}
                                            onChange={(e) => updateVariant(activeVariantData.id, { content: e.target.value })}
                                            className="min-h-[200px]"
                                            disabled={isRunning}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Results Panel (when running) */}
            {isRunning && (
                <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Live Results
                            <Badge className="bg-green-100 text-green-700 ml-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                Running
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            {variants.map((variant) => (
                                <div
                                    key={variant.id}
                                    className={`p-4 rounded-lg bg-white border-2 ${calculateWinProbability(variant) === Math.max(...variants.map(v => calculateWinProbability(v)))
                                            ? 'border-green-500'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="font-bold">{variant.name}</span>
                                        {calculateWinProbability(variant) === Math.max(...variants.map(v => calculateWinProbability(v))) && (
                                            <Trophy className="w-4 h-4 text-amber-500" />
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Sent</p>
                                            <p className="font-semibold">{variant.stats.sent}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Opens</p>
                                            <p className="font-semibold">{variant.stats.opens}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Clicks</p>
                                            <p className="font-semibold">{variant.stats.clicks}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Replies</p>
                                            <p className="font-semibold">{variant.stats.replies}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                    {variants.length} variants • {settings.sampleSize}% sample • Winner by {settings.winnerCriteria.replace('_', ' ')}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onSave(variants, settings)}
                    >
                        Save Test
                    </Button>
                    {!isRunning ? (
                        <Button onClick={handleStartTest} className="gap-2">
                            <Play className="w-4 h-4" />
                            Start A/B Test
                        </Button>
                    ) : (
                        <Button variant="destructive" onClick={() => setIsRunning(false)} className="gap-2">
                            <Pause className="w-4 h-4" />
                            Stop Test
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ABTestBuilder;
