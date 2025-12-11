
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, AlertCircle, Smile } from "lucide-react";

const emails = [
    {
        id: 1,
        from: "Sarah Smith",
        subject: "Re: Partnership?",
        snippet: "This sounds interesting, let's chat next week.",
        category: "Positive",
        sentiment: 85,
        suggestedReply: "Great! How does Tuesday at 10am work for you?",
    },
    {
        id: 2,
        from: "Mike Jones",
        subject: "Re: Quick question",
        snippet: "Not interested right now, please unsubscribe me.",
        category: "Unsubscribe",
        sentiment: 10,
        suggestedReply: "Unsubscribed successfully. Best of luck!",
    },
    {
        id: 3,
        from: "Emily Davis",
        subject: "Re: Hello",
        snippet: "Can you send more pricing info first?",
        category: "Objection",
        sentiment: 50,
        suggestedReply: "Sure, here is our pricing deck [Link]. Any specific budget range?",
    },
];

const ResponseIntelligence = () => {
    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Smile className="w-5 h-5 text-primary" />
                    Response Intelligence Center
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex gap-6 overflow-hidden">
                {/* List */}
                <div className="w-1/3 border-r pr-6 flex flex-col">
                    <h3 className="font-semibold mb-4 text-sm text-gray-500">Inbox (3)</h3>
                    <ScrollArea className="flex-1">
                        <div className="space-y-2">
                            {emails.map((email) => (
                                <div key={email.id} className="p-3 bg-white border rounded-lg cursor-pointer hover:border-primary transition-colors shadow-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-sm">{email.from}</span>
                                        <Badge variant={email.category === "Positive" ? "default" : email.category === "Unsubscribe" ? "destructive" : "secondary"}>
                                            {email.category}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-medium text-gray-900 truncate">{email.subject}</p>
                                    <p className="text-xs text-gray-500 truncate">{email.snippet}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Detail View (Mocking the first one selected) */}
                <div className="flex-1 flex flex-col p-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Sarah Smith</h2>
                            <p className="text-sm text-gray-500">CEO @ DesignCorp</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sentiment Score:</span>
                            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%]" />
                            </div>
                            <span className="font-bold text-green-600">85%</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mb-6 flex-1 border">
                        <p className="text-gray-800">This sounds interesting, let's chat next week. But I'm worried about the price.</p>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="outline" className="border-orange-500 text-orange-500">Objection: Pricing</Badge>
                            <Badge variant="outline" className="border-blue-500 text-blue-500">Intent: Meeting</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-purple-100 bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-purple-700 font-semibold">
                                <Sparkles className="w-4 h-4" /> Suggested Reply
                            </div>
                            <p className="text-sm text-gray-700 mb-3">Great! I'd love to chat. Regarding price, we have a startup tier. How does Tuesday at 10am work?</p>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full">Approve & Send</Button>
                            </div>
                        </div>

                        <div className="border p-4 rounded-lg bg-white">
                            <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                                <span className="text-lg">⚡</span> Recommended Actions
                            </div>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">📅 Propose 3 Calendar Slots</Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">📄 Send Pricing One-Pager</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Missing import fix
import { Sparkles } from "lucide-react";

export default ResponseIntelligence;
