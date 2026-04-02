import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
    BrainCircuit,
    Send,
    Sparkles,
    Wand2,
    MessageSquare,
    Mail,
    Lock,
    ChevronRight,
    Loader2
} from "lucide-react";

interface QuickPromptProps {
    text: string;
    onClick: () => void;
}

const QuickPrompt = ({ text, onClick }: QuickPromptProps) => (
    <button
        onClick={onClick}
        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
    >
        {text}
    </button>
);

interface AIToolCardProps {
    title: string;
    description: string;
    usage: string;
    icon: React.ReactNode;
    isPro?: boolean;
    onClick?: () => void;
}

const AIToolCard = ({ title, description, usage, icon, isPro, onClick }: AIToolCardProps) => (
    <div
        className={`p-3 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${isPro ? 'opacity-75' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    {isPro && <Badge variant="outline" className="text-[10px] px-1.5 py-0">PRO</Badge>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                <p className="text-xs text-primary mt-1.5 font-medium">{usage}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
        </div>
    </div>
);

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${role === 'user'
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
            {content}
        </div>
    </div>
);

const AICopilot = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessageProps[]>([
        {
            role: "assistant",
            content: "Hi! I'm your email AI assistant. What would you like to improve today?"
        }
    ]);

    const quickPrompts = [
        "Write a follow-up email",
        "Improve my subject line",
        "Analyze campaign performance",
        "Generate lead list ideas"
    ];

    const handleToolClick = (tool: string, isPro?: boolean) => {
        if (isPro) {
            toast({
                title: "Pro Feature 🔒",
                description: `${tool} requires a Pro subscription`,
            });
            navigate("/pricing");
            return;
        }

        toast({
            title: `${tool} ✨`,
            description: "Opening AI tool...",
        });

        // Simulate tool activation
        setMessages(prev => [...prev, {
            role: "assistant",
            content: `I'm now running ${tool}. How would you like me to help?`
        }]);
    };

    const aiTools: (AIToolCardProps & { key: string })[] = [
        {
            key: "personalizer",
            title: "Email Personalizer",
            description: "AI writes opening lines based on LinkedIn profile",
            usage: "3/5 credits used",
            icon: <Wand2 className="w-4 h-4" />,
            onClick: () => handleToolClick("Email Personalizer")
        },
        {
            key: "subject",
            title: "Subject Line Generator",
            description: "10 AI-generated subject lines in 30s",
            usage: "Unlimited",
            icon: <MessageSquare className="w-4 h-4" />,
            onClick: () => handleToolClick("Subject Line Generator")
        },
        {
            key: "sequence",
            title: "Email Sequence Builder",
            description: "Create multi-step campaigns with AI",
            usage: "Pro Feature",
            icon: <Mail className="w-4 h-4" />,
            isPro: true,
            onClick: () => handleToolClick("Email Sequence Builder", true)
        }
    ];

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        // Simulate AI response with contextual answers
        setTimeout(() => {
            let response = "I can help with that! Based on your current campaign performance, I recommend focusing on personalized subject lines. Your open rate could improve by 25% with more compelling first lines. Would you like me to generate some options?";

            if (userMessage.toLowerCase().includes("follow-up")) {
                response = "Here's a follow-up email template:\n\nSubject: Quick follow-up on [Topic]\n\nHi [Name],\n\nI wanted to circle back on my previous email. I noticed you opened it - did anything catch your interest?\n\nI'd love to schedule a quick 15-minute call to discuss how we can help [Company] achieve [Goal].\n\nBest,\n[Your Name]";
            } else if (userMessage.toLowerCase().includes("subject")) {
                response = "Here are 5 subject line ideas:\n\n1. \"Quick question about [Company]'s growth\"\n2. \"[Name], saw your recent post on LinkedIn\"\n3. \"Idea for [Company] - 2 min read\"\n4. \"Can I share something with you?\"\n5. \"[Mutual connection] suggested I reach out\"";
            } else if (userMessage.toLowerCase().includes("campaign") || userMessage.toLowerCase().includes("performance")) {
                response = "Looking at your campaigns:\n\n📊 Open Rate: 34% (industry avg: 28%)\n📩 Reply Rate: 8.2% (goal: 10%)\n🎯 Top performing: \"Q1 Outreach\" campaign\n\nRecommendation: Try A/B testing subject lines to hit your 10% reply goal.";
            }

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
            setIsLoading(false);
        }, 1500);
    };

    const handleQuickPrompt = (text: string) => {
        setInput(text);
        // Auto-send after a brief delay
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "user", content: text }]);
            setIsLoading(true);

            setTimeout(() => {
                let response = "I can help with that!";
                if (text.includes("follow-up")) {
                    response = "I'll draft a follow-up email for you. Which lead would you like to follow up with?";
                } else if (text.includes("subject")) {
                    response = "Let me generate some compelling subject lines. What's the main topic of your email?";
                } else if (text.includes("campaign")) {
                    response = "I'll analyze your campaign performance. Your best performer is 'Q1 Outreach' with 42% open rate!";
                } else if (text.includes("lead")) {
                    response = "Great idea! Based on your ICP, I suggest targeting: Tech startups (50-200 employees), Recently funded companies, and Companies hiring for sales roles.";
                }
                setMessages(prev => [...prev, { role: "assistant", content: response }]);
                setIsLoading(false);
                setInput("");
            }, 1500);
        }, 100);
    };

    const handleUpgrade = () => {
        toast({
            title: "Unlock Unlimited AI ⚡",
            description: "Upgrade to Pro for unlimited AI credits",
        });
        navigate("/pricing");
    };

    return (
        <Card className="shadow-sm border-gray-200 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    AI Copilot
                    <Badge variant="secondary" className="ml-auto text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                        Online
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-[120px] max-h-[200px]">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} {...msg} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((prompt) => (
                        <QuickPrompt key={prompt} text={prompt} onClick={() => handleQuickPrompt(prompt)} />
                    ))}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask AI anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                    />
                    <Button size="icon" onClick={handleSend} disabled={isLoading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>

                {/* AI Tools */}
                <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">AI Writing Tools</span>
                    </div>
                    <div className="space-y-2">
                        {aiTools.map((tool) => (
                            <AIToolCard key={tool.key} {...tool} />
                        ))}
                    </div>
                </div>

                {/* Credit Usage */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-3 border border-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-700">Daily AI Credits</p>
                            <p className="text-lg font-bold text-gray-900">3/5 <span className="text-xs font-normal text-gray-500">remaining</span></p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={handleUpgrade}
                        >
                            <Lock className="w-3 h-3 mr-1" />
                            Upgrade for Unlimited
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AICopilot;
