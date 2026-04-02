
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Star } from "lucide-react";

const templates = [
    { id: 1, name: "SaaS Cold Outreach #1", replyRate: "12%", stars: 5 },
    { id: 2, name: "Partnership Request", replyRate: "8%", stars: 4 },
    { id: 3, name: "Follow-up Strategy", replyRate: "15%", stars: 5 },
];

const TopTemplates = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Templates</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {templates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-sm">{template.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-green-600 font-bold">{template.replyRate} Reply Rate</span>
                                    <div className="flex text-yellow-400">
                                        {[...Array(template.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="link" className="w-full text-primary" size="sm">View All Templates</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopTemplates;
