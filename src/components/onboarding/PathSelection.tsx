
import { User, Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PathSelectionProps {
    onSelect: (path: string) => void;
}

const PathSelection = ({ onSelect }: PathSelectionProps) => {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to LeadRockets</h1>
            <p className="text-gray-600 mb-8">How will you be using the platform?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-md" onClick={() => onSelect("founder")}>
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle>Founder</CardTitle>
                        <CardDescription>I'm doing my own outreach</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-md" onClick={() => onSelect("agency")}>
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                        <CardTitle>Agency</CardTitle>
                        <CardDescription>Sending for clients</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-md" onClick={() => onSelect("sales-team")}>
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle>Sales Team</CardTitle>
                        <CardDescription>Managing a sales team</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default PathSelection;
