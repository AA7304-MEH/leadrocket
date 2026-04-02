import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileText, Lock, Plus, ArrowRight } from "lucide-react";

interface Template {
    id: string;
    name: string;
    replyRate: number;
    lastUsed: string;
    isPro: boolean;
}

const TemplatesWidget = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const templates: Template[] = [
        { id: "1", name: "Social Media Outreach", replyRate: 12.5, lastUsed: "Today", isPro: true },
        { id: "2", name: "Conference Follow-up", replyRate: 9.8, lastUsed: "2 days ago", isPro: false },
        { id: "3", name: "Partnership Proposal", replyRate: 15.2, lastUsed: "1 week ago", isPro: true },
        { id: "4", name: "Cold Outreach V2", replyRate: 7.3, lastUsed: "Yesterday", isPro: false },
    ];

    const handleUseTemplate = (template: Template) => {
        if (template.isPro) {
            toast({
                title: "Pro Template 🔒",
                description: "Upgrade to Pro to use this template",
            });
            navigate("/pricing");
            return;
        }

        toast({
            title: "Template Selected! 📝",
            description: `"${template.name}" ready to use in your campaign`,
        });
        navigate("/campaigns");
    };

    const handleCreateTemplate = () => {
        toast({
            title: "Create Template",
            description: "Opening template editor...",
        });
        navigate("/templates");
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Top Templates
                    </CardTitle>
                    <span className="text-xs text-gray-500">Performance | Last Used</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => handleUseTemplate(template)}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                    {template.name}
                                    {template.isPro && <Lock className="w-3 h-3 text-amber-500" />}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Reply Rate: {template.replyRate}% • {template.lastUsed}
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant={template.isPro ? "outline" : "default"}
                                className="gap-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUseTemplate(template);
                                }}
                            >
                                {template.isPro ? (
                                    <>
                                        <Lock className="w-3 h-3" /> Unlock
                                    </>
                                ) : (
                                    "Use Template"
                                )}
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="w-full mt-4 gap-2"
                    onClick={handleCreateTemplate}
                >
                    <Plus className="w-4 h-4" />
                    Create New Template
                </Button>
            </CardContent>
        </Card>
    );
};

export default TemplatesWidget;
