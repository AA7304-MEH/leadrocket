
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Star } from 'lucide-react';

const mockTemplates = [
    {
        id: 1,
        title: "Cold Outreach for SaaS",
        subject: "Quick question about {company}",
        body: "Hi {first_name},\n\nI noticed you're leading sales at {company}. I was wondering how you're currently handling cold outreach?\n\nWe help companies like yours get 3x more replies with AI personalization.\n\nWorth a quick chat?\n\nBest,\n[Your Name]",
        tags: ["SaaS", "Cold"]
    },
    {
        id: 2,
        title: "Partnership Inquiry",
        subject: "Partnering with {company}?",
        body: "Hey {first_name},\n\nI've been following {company} for a while and love what you're doing in the {industry} space.\n\nI think there could be some great synergy between us. Open to a 10-min call to explore a potential partnership?\n\nCheers,\n[Your Name]",
        tags: ["Partnership", "Networking"]
    },
    {
        id: 3,
        title: "Follow-up (Value Add)",
        subject: "Thought you'd like this",
        body: "Hi {first_name},\n\nI saw this article about {industry_trend} and thought of our conversation. \n\nCheck it out here: [Link]\n\nLet me know what you think!\n\nBest,\n[Your Name]",
        tags: ["Follow-up", "Value"]
    },
];

export const TemplateList = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {mockTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    {template.title}
                                    {template.id === 1 && <Badge variant="secondary" className="text-xs font-normal"><Star className="w-3 h-3 mr-1 text-yellow-500" /> Popular</Badge>}
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {template.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-[10px] text-slate-500">{tag}</Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 p-4 rounded-md border text-sm font-mono text-slate-700 whitespace-pre-wrap">
                                <div className="mb-2 text-slate-500 select-none">Subject: <span className="text-slate-900">{template.subject}</span></div>
                                {template.body}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="outline" className="w-full text-sm h-9">
                                Use this Template
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
