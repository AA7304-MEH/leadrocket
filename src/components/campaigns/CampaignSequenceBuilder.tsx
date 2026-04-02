import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Mail,
    Clock,
    Plus,
    Trash2,
    GripVertical,
    ChevronUp,
    ChevronDown,
    Copy,
    Sparkles,
    Send,
    Calendar
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface EmailStep {
    id: string;
    order: number;
    subject: string;
    content: string;
    delay: number;
    delayUnit: 'hours' | 'days';
    status: 'draft' | 'ready' | 'sent';
}

interface CampaignSequenceBuilderProps {
    campaignId?: string;
    initialSteps?: EmailStep[];
    onSave: (steps: EmailStep[]) => void;
    onSend?: () => void;
}

const CampaignSequenceBuilder: React.FC<CampaignSequenceBuilderProps> = ({
    campaignId,
    initialSteps = [],
    onSave,
    onSend
}) => {
    const { toast } = useToast();
    const [steps, setSteps] = useState<EmailStep[]>(initialSteps.length > 0 ? initialSteps : [
        {
            id: '1',
            order: 1,
            subject: '',
            content: '',
            delay: 0,
            delayUnit: 'days',
            status: 'draft'
        }
    ]);
    const [activeStep, setActiveStep] = useState<string>(steps[0]?.id || '1');
    const [isSaving, setIsSaving] = useState(false);

    const addStep = () => {
        const newStep: EmailStep = {
            id: Date.now().toString(),
            order: steps.length + 1,
            subject: '',
            content: '',
            delay: steps.length === 0 ? 0 : 2,
            delayUnit: 'days',
            status: 'draft'
        };
        setSteps([...steps, newStep]);
        setActiveStep(newStep.id);
        toast({ title: "Step Added", description: `Email step ${newStep.order} created` });
    };

    const removeStep = (stepId: string) => {
        if (steps.length === 1) {
            toast({ title: "Cannot Remove", description: "Campaign must have at least one email" });
            return;
        }
        const newSteps = steps.filter(s => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 }));
        setSteps(newSteps);
        if (activeStep === stepId) {
            setActiveStep(newSteps[0].id);
        }
        toast({ title: "Step Removed", description: "Email step deleted" });
    };

    const duplicateStep = (stepId: string) => {
        const stepToCopy = steps.find(s => s.id === stepId);
        if (!stepToCopy) return;

        const newStep: EmailStep = {
            ...stepToCopy,
            id: Date.now().toString(),
            order: steps.length + 1,
            subject: `${stepToCopy.subject} (Copy)`,
            status: 'draft'
        };
        setSteps([...steps, newStep]);
        setActiveStep(newStep.id);
        toast({ title: "Step Duplicated", description: "Email step copied" });
    };

    const moveStep = (stepId: string, direction: 'up' | 'down') => {
        const currentIndex = steps.findIndex(s => s.id === stepId);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === steps.length - 1)
        ) return;

        const newSteps = [...steps];
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        [newSteps[currentIndex], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[currentIndex]];

        setSteps(newSteps.map((s, i) => ({ ...s, order: i + 1 })));
    };

    const updateStep = (stepId: string, updates: Partial<EmailStep>) => {
        setSteps(steps.map(s => s.id === stepId ? { ...s, ...updates } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(steps);
            toast({ title: "Sequence Saved ✅", description: `${steps.length} email steps saved` });
        } catch {
            toast({ title: "Save Failed", description: "Could not save sequence" });
        } finally {
            setIsSaving(false);
        }
    };

    const activeStepData = steps.find(s => s.id === activeStep);

    const generateAIContent = async () => {
        toast({ title: "AI Generating... ✨", description: "Creating personalized content" });
        // Simulate AI generation
        setTimeout(() => {
            if (activeStepData) {
                updateStep(activeStep, {
                    subject: activeStepData.order === 1
                        ? "Quick question about {{company}}"
                        : `Following up on my last email, {{first_name}}`,
                    content: activeStepData.order === 1
                        ? `Hi {{first_name}},\n\nI noticed {{company}} is doing great things in {{industry}}. I wanted to reach out because...\n\nWould you be open to a quick 15-minute call this week?\n\nBest,\n{{sender_name}}`
                        : `Hi {{first_name}},\n\nJust wanted to follow up on my previous email. I know you're busy, so I'll keep this brief.\n\n[Insert value proposition]\n\nWould love to connect if you have a few minutes.\n\nBest,\n{{sender_name}}`
                });
                toast({ title: "AI Content Ready! 🎯", description: "Personalized email generated" });
            }
        }, 1500);
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full">
            {/* Steps Timeline */}
            <div className="col-span-4 space-y-3">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Email Sequence</h3>
                    <Badge variant="outline">{steps.length} steps</Badge>
                </div>

                <div className="space-y-2">
                    {steps.map((step, index) => (
                        <Card
                            key={step.id}
                            className={`cursor-pointer transition-all ${activeStep === step.id
                                    ? 'ring-2 ring-primary bg-primary/5'
                                    : 'hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveStep(step.id)}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.status === 'ready'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {step.order}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium truncate">
                                                {step.subject || `Email ${step.order}`}
                                            </span>
                                        </div>
                                        {index > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                Wait {step.delay} {step.delayUnit}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveStep(step.id, 'up'); }}
                                            className="p-1 hover:bg-gray-200 rounded"
                                            disabled={index === 0}
                                        >
                                            <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveStep(step.id, 'down'); }}
                                            className="p-1 hover:bg-gray-200 rounded"
                                            disabled={index === steps.length - 1}
                                        >
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button variant="outline" className="w-full gap-2" onClick={addStep}>
                    <Plus className="w-4 h-4" />
                    Add Follow-up Email
                </Button>
            </div>

            {/* Email Editor */}
            <div className="col-span-8">
                {activeStepData && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Email {activeStepData.order}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => duplicateStep(activeStepData.id)}
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        Duplicate
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => removeStep(activeStepData.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Delay Setting */}
                            {activeStepData.order > 1 && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Wait</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={activeStepData.delay}
                                        onChange={(e) => updateStep(activeStepData.id, { delay: parseInt(e.target.value) || 1 })}
                                        className="w-20"
                                    />
                                    <Select
                                        value={activeStepData.delayUnit}
                                        onValueChange={(value: 'hours' | 'days') => updateStep(activeStepData.id, { delayUnit: value })}
                                    >
                                        <SelectTrigger className="w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hours">hours</SelectItem>
                                            <SelectItem value="days">days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm text-gray-600">after previous email</span>
                                </div>
                            )}

                            {/* Subject Line */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject Line</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter subject line... Use {{first_name}} for personalization"
                                        value={activeStepData.subject}
                                        onChange={(e) => updateStep(activeStepData.id, { subject: e.target.value })}
                                    />
                                    <Button variant="outline" size="icon" onClick={generateAIContent}>
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </Button>
                                </div>
                            </div>

                            {/* Email Content */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Content</label>
                                <Textarea
                                    placeholder="Write your email content here... Use {{first_name}}, {{company}}, {{industry}} for personalization"
                                    value={activeStepData.content}
                                    onChange={(e) => updateStep(activeStepData.id, { content: e.target.value })}
                                    className="min-h-[300px] font-mono text-sm"
                                />
                            </div>

                            {/* Variable Tags */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-gray-500">Available variables:</span>
                                {['{{first_name}}', '{{last_name}}', '{{company}}', '{{title}}', '{{industry}}'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            updateStep(activeStepData.id, {
                                                content: activeStepData.content + ' ' + tag
                                            });
                                        }}
                                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Sequence: {steps.length} emails over {
                            steps.slice(1).reduce((acc, s) => acc + (s.delayUnit === 'days' ? s.delay : s.delay / 24), 0)
                        } days
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <Button onClick={onSend} className="gap-2">
                            <Send className="w-4 h-4" />
                            Launch Campaign
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignSequenceBuilder;
