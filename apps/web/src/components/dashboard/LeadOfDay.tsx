
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, ExternalLink } from "lucide-react";

const LeadOfDay = () => {
    return (
        <Card className="bg-gradient-to-br from-primary/5 to-white border-primary/20">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-primary">Lead of the Day 🚀</CardTitle>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">High Intent</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold">John Doe</h4>
                        <p className="text-sm text-gray-500">CEO @ Stealth Startup</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Just posted about needing a cold email solution on LinkedIn. Perfect timing.
                </p>
                <div className="flex gap-2">
                    <Button size="sm" className="w-full gap-2">
                        <Linkedin className="w-4 h-4" /> Connect
                    </Button>
                    <Button size="sm" variant="outline" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" /> Visit Website
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeadOfDay;
