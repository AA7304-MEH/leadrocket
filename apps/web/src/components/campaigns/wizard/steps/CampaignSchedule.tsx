
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, ArrowLeft, ArrowRight, Zap, Lock } from "lucide-react";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    onLaunch: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const CampaignSchedule = ({ data, onNext, onBack }: StepProps) => {
    const [scheduleType, setScheduleType] = useState(data.scheduleType || "now");
    const [timezone, setTimezone] = useState(data.timezone || "America/New_York");
    const [sendWindow, setSendWindow] = useState(data.sendWindow || "9-17");

    const handleNext = () => {
        onNext({ scheduleType, timezone, sendWindow });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Schedule Your Campaign</h3>
                <p className="text-sm text-gray-500">Choose when to send your emails.</p>
            </div>

            {/* Send Timing */}
            <div className="space-y-4">
                <Label>When to send</Label>
                <RadioGroup value={scheduleType} onValueChange={setScheduleType} className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary/50 cursor-pointer">
                        <RadioGroupItem value="now" id="now" />
                        <div className="flex-1">
                            <label htmlFor="now" className="font-medium text-gray-900 cursor-pointer">
                                Send Immediately
                            </label>
                            <p className="text-sm text-gray-500">Start sending as soon as you launch.</p>
                        </div>
                        <Zap className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary/50 cursor-pointer">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <div className="flex-1">
                            <label htmlFor="scheduled" className="font-medium text-gray-900 cursor-pointer">
                                Schedule for Later
                            </label>
                            <p className="text-sm text-gray-500">Pick a specific date and time.</p>
                        </div>
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-60 cursor-not-allowed">
                        <RadioGroupItem value="optimized" id="optimized" disabled />
                        <div className="flex-1">
                            <label htmlFor="optimized" className="font-medium text-gray-500">
                                AI-Optimized Timing
                            </label>
                            <p className="text-sm text-gray-400">Let AI pick the best time for each lead.</p>
                        </div>
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Pro</span>
                    </div>
                </RadioGroup>
            </div>

            {/* Timezone */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Send Window</Label>
                    <Select value={sendWindow} onValueChange={setSendWindow}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9-17">9 AM - 5 PM (Business Hours)</SelectItem>
                            <SelectItem value="8-12">8 AM - 12 PM (Morning)</SelectItem>
                            <SelectItem value="12-17">12 PM - 5 PM (Afternoon)</SelectItem>
                            <SelectItem value="all">Any Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleNext} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default CampaignSchedule;
