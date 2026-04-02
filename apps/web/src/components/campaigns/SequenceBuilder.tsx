import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Mail,
    Clock,
    Plus,
    Trash2,
    GripVertical,
    Sparkles,
    ArrowRight,
    Settings,
    Beaker,
    Lock
} from "lucide-react";

interface EmailStepProps {
    id: string;
    day: number;
    type: string;
    subject: string;
    content: string;
    trigger?: string;
    variants?: number;
}

interface SequenceBuilderProps {
    onSave?: (steps: EmailStepProps[]) => void;
}

const EmailStep = ({
    step,
    index,
    onUpdate,
    onDelete
}: {
    step: EmailStepProps;
    index: number;
    onUpdate: (id: string, data: Partial<EmailStepProps>) => void;
    onDelete: (id: string) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const stepTypes = [
        { value: "initial", label: "Initial Outreach", color: "bg-blue-100 text-blue-700" },
        { value: "followup", label: "Follow-up", color: "bg-amber-100 text-amber-700" },
        { value: "value", label: "Value-Add", color: "bg-green-100 text-green-700" },
        { value: "breakup", label: "Breakup Email", color: "bg-red-100 text-red-700" },
    ];

    const currentType = stepTypes.find(t => t.value === step.type) || stepTypes[0];

    return (
        <div className="relative group">
            {/* Connection Line */}
            {index > 0 && (
                <div className="absolute left-6 -top-4 w-0.5 h-4 bg-gray-200" />
            )}

            <Card className={`border-2 transition-all ${isExpanded ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                            <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-primary" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">Day {step.day}</span>
                                    <Badge className={currentType.color}>{currentType.label}</Badge>
                                    {step.variants && step.variants > 1 && (
                                        <Badge variant="outline" className="gap-1">
                                            <Beaker className="w-3 h-3" />
                                            {step.variants} variants
                                        </Badge>
                                    )}
                                </div>
                                {!isExpanded && step.subject && (
                                    <p className="text-sm text-gray-500 truncate">{step.subject}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onDelete(step.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Day</label>
                                    <Input
                                        type="number"
                                        value={step.day}
                                        onChange={(e) => onUpdate(step.id, { day: parseInt(e.target.value) })}
                                        min={1}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={step.type}
                                        onChange={(e) => onUpdate(step.id, { type: e.target.value })}
                                    >
                                        {stepTypes.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject Line</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={step.subject}
                                        onChange={(e) => onUpdate(step.id, { subject: e.target.value })}
                                        placeholder="Enter subject line..."
                                    />
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Content</label>
                                <Textarea
                                    value={step.content}
                                    onChange={(e) => onUpdate(step.id, { content: e.target.value })}
                                    placeholder="Write your email content..."
                                    rows={4}
                                />
                                <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Generate with AI
                                </Button>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Trigger Condition</label>
                                <select
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={step.trigger || "none"}
                                    onChange={(e) => onUpdate(step.id, { trigger: e.target.value })}
                                >
                                    <option value="none">Send regardless</option>
                                    <option value="no_open">If no open</option>
                                    <option value="no_reply">If no reply</option>
                                    <option value="opened">If opened (no reply)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Arrow to next */}
            <div className="absolute left-6 -bottom-4 w-0.5 h-4 bg-gray-200" />
        </div>
    );
};

const SequenceBuilder = ({ onSave }: SequenceBuilderProps) => {
    const [steps, setSteps] = useState<EmailStepProps[]>([
        { id: "1", day: 1, type: "initial", subject: "Quick question about {{company}}", content: "", variants: 2 },
        { id: "2", day: 3, type: "followup", subject: "Following up", content: "", trigger: "no_reply" },
        { id: "3", day: 7, type: "breakup", subject: "Should I close your file?", content: "", trigger: "no_reply" },
    ]);

    const addStep = () => {
        const lastDay = steps.length > 0 ? steps[steps.length - 1].day : 0;
        const newStep: EmailStepProps = {
            id: String(Date.now()),
            day: lastDay + 3,
            type: "followup",
            subject: "",
            content: "",
        };
        setSteps([...steps, newStep]);
    };

    const updateStep = (id: string, data: Partial<EmailStepProps>) => {
        setSteps(steps.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const deleteStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Email Sequence Builder
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                            <Beaker className="w-4 h-4" />
                            A/B Test
                            <Lock className="w-3 h-3 ml-1" />
                        </Button>
                        <Button size="sm" onClick={() => onSave?.(steps)}>
                            Save Sequence
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Timeline */}
                <div className="relative space-y-6 pb-4">
                    {steps.map((step, index) => (
                        <EmailStep
                            key={step.id}
                            step={step}
                            index={index}
                            onUpdate={updateStep}
                            onDelete={deleteStep}
                        />
                    ))}
                </div>

                {/* Add Step Button */}
                <Button
                    variant="outline"
                    className="w-full gap-2 border-dashed"
                    onClick={addStep}
                >
                    <Plus className="w-4 h-4" />
                    Add Email Step
                </Button>

                {/* Sequence Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total sequence length:</span>
                        <span className="font-medium">{steps.length > 0 ? steps[steps.length - 1].day : 0} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Total emails:</span>
                        <span className="font-medium">{steps.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">A/B test variants:</span>
                        <span className="font-medium">{steps.reduce((acc, s) => acc + (s.variants || 1), 0)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SequenceBuilder;
