
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";

const DeliverabilityDashboard = () => {
    // Mock data
    const score = 92;
    const records = [
        { type: "SPF", status: "pass" },
        { type: "DKIM", status: "pass" },
        { type: "DMARC", status: "pass" },
        { type: "Blacklist", status: "pass" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" /> Sender Score
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-green-100 mb-4">
                        <span className="text-4xl font-bold text-green-600">{score}</span>
                    </div>
                    <p className="text-sm text-gray-500">Excellent Reputation</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Technical Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {records.map((record, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">{record.type}</span>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" /> Valid
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Warmup Progress</span>
                            <span>Day 14/30</span>
                        </div>
                        <Progress value={45} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Inbox Placement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="w-20 text-sm">Google</span>
                            <Progress value={95} className="h-2 flex-grow bg-gray-100" />
                            <span className="w-12 text-sm text-right">95%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-20 text-sm">Outlook</span>
                            <Progress value={88} className="h-2 flex-grow bg-gray-100" />
                            <span className="w-12 text-sm text-right">88%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-20 text-sm">Yahoo</span>
                            <Progress value={92} className="h-2 flex-grow bg-gray-100" />
                            <span className="w-12 text-sm text-right">92%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DeliverabilityDashboard
