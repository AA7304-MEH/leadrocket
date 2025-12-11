
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, BarChart } from "lucide-react";

const QuickActions = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:text-primary">
                        <Mail className="w-6 h-6" />
                        <span className="text-xs">Verify Emails</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:text-primary">
                        <RefreshCw className="w-6 h-6" />
                        <span className="text-xs">Generate Lines</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:text-primary">
                        <BarChart className="w-6 h-6" />
                        <span className="text-xs">Check Spam Score</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:text-primary">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-xs">New Campaign</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
