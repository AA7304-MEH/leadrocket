
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Send, Eye, Sparkles, Bold, Italic, Link2, List, Image, User, Building,
    Variable, Wand2, CheckCircle, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface EmailComposerProps {
    open: boolean;
    onClose: () => void;
    recipientName?: string;
    recipientEmail?: string;
    recipientCompany?: string;
}

const variableTags = [
    { label: "First Name", value: "{first_name}", icon: <User className="w-3 h-3" /> },
    { label: "Last Name", value: "{last_name}", icon: <User className="w-3 h-3" /> },
    { label: "Company", value: "{company}", icon: <Building className="w-3 h-3" /> },
    { label: "Title", value: "{title}", icon: <Building className="w-3 h-3" /> },
];

const EmailComposer = ({
    open,
    onClose,
    recipientName = "Sarah Chen",
    recipientEmail = "sarah@example.com",
    recipientCompany = "TechCorp"
}: EmailComposerProps) => {
    const [subject, setSubject] = useState("Quick question about {company}");
    const [body, setBody] = useState(`Hi {first_name},

I noticed that {company} is doing great work in the industry. I wanted to reach out because I think there's an opportunity for us to collaborate.

Would you be open to a quick 15-minute call this week?

Best,
John`);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");

    const insertVariable = (variable: string) => {
        setBody(prev => prev + variable);
    };

    const handleAIEnhance = async () => {
        setIsEnhancing(true);
        // Simulate AI enhancement
        await new Promise(resolve => setTimeout(resolve, 1500));
        setBody(prev => prev.replace(
            "I wanted to reach out because I think there's an opportunity for us to collaborate.",
            "I've been following your recent product launches and I believe there's a unique synergy between our solutions that could drive significant value for your team."
        ));
        setIsEnhancing(false);
        toast.success("Email enhanced with AI!");
    };

    const getPreviewContent = () => {
        let previewSubject = subject
            .replace("{first_name}", recipientName.split(" ")[0])
            .replace("{last_name}", recipientName.split(" ")[1] || "")
            .replace("{company}", recipientCompany)
            .replace("{title}", "VP of Sales");

        let previewBody = body
            .replace(/{first_name}/g, recipientName.split(" ")[0])
            .replace(/{last_name}/g, recipientName.split(" ")[1] || "")
            .replace(/{company}/g, recipientCompany)
            .replace(/{title}/g, "VP of Sales");

        return { subject: previewSubject, body: previewBody };
    };

    const preview = getPreviewContent();

    const handleSend = () => {
        toast.success("Email sent successfully!");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        Compose Email
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="w-full justify-start mb-4">
                        <TabsTrigger value="compose" className="gap-2">
                            <Send className="w-4 h-4" /> Compose
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2">
                            <Eye className="w-4 h-4" /> Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="compose" className="flex-1 flex flex-col overflow-hidden mt-0">
                        {/* To Field */}
                        <div className="mb-4">
                            <Label className="text-xs text-gray-500">To</Label>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <Badge variant="secondary" className="gap-1">
                                    <User className="w-3 h-3" />
                                    {recipientName}
                                </Badge>
                                <span className="text-sm text-gray-500">&lt;{recipientEmail}&gt;</span>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="mb-4">
                            <Label className="text-xs text-gray-500">Subject</Label>
                            <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject..."
                                className="mt-1"
                            />
                        </div>

                        {/* Variable Tags */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-xs text-gray-500">Insert:</span>
                            {variableTags.map((tag) => (
                                <Button
                                    key={tag.value}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => insertVariable(tag.value)}
                                >
                                    {tag.icon}
                                    {tag.label}
                                </Button>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="flex items-center gap-1 mb-2 p-1 bg-gray-50 rounded">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <Bold className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <Italic className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <Link2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <List className="w-4 h-4" />
                                </Button>
                                <div className="flex-1" />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-primary"
                                    onClick={handleAIEnhance}
                                    disabled={isEnhancing}
                                >
                                    {isEnhancing ? (
                                        <>
                                            <Wand2 className="w-4 h-4 animate-pulse" />
                                            Enhancing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            AI Enhance
                                        </>
                                    )}
                                </Button>
                            </div>
                            <Textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="flex-1 min-h-[200px] resize-none font-mono text-sm"
                                placeholder="Write your email..."
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="flex-1 overflow-auto mt-0">
                        <div className="bg-gray-50 rounded-lg p-6 border">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="border-b pb-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <span className="font-medium">To:</span>
                                        {recipientName} &lt;{recipientEmail}&gt;
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-medium">Subject:</span>
                                        {preview.subject}
                                    </div>
                                </div>
                                <div className="whitespace-pre-wrap text-gray-700">
                                    {preview.body}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-green-600">All variables will be replaced with real values</span>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="text-sm text-gray-500">
                        Sending to 1 recipient
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend} className="gap-2">
                            <Send className="w-4 h-4" />
                            Send Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EmailComposer;
