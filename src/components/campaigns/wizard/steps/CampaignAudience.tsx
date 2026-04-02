
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, ArrowLeft, ArrowRight, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StepProps {
    data: Record<string, any>;
    onNext: (data?: Record<string, any>) => void;
    onBack: () => void;
    onLaunch: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

interface Lead {
    id: string;
    name: string;
    email: string;
    company: string;
    verified: boolean;
}

const mockLeads: Lead[] = [
    { id: "1", name: "Sarah Chen", email: "sarah@techcorp.com", company: "TechCorp", verified: true },
    { id: "2", name: "Mike Rodriguez", email: "mike@startupxyz.io", company: "StartupXYZ", verified: true },
    { id: "3", name: "Jessica Lee", email: "jessica@growthlabs.com", company: "GrowthLabs", verified: false },
    { id: "4", name: "Alex Johnson", email: "alex@innovate.co", company: "Innovate Co", verified: true },
    { id: "5", name: "Emma Wilson", email: "emma@futuretech.io", company: "FutureTech", verified: true },
];

const CampaignAudience = ({ data, onNext, onBack }: StepProps) => {
    const [selectedLeads, setSelectedLeads] = useState<string[]>(data.selectedLeads || []);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLeads = mockLeads.filter(
        (lead) =>
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleLead = (leadId: string) => {
        setSelectedLeads((prev) =>
            prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
        );
    };

    const selectAll = () => {
        if (selectedLeads.length === filteredLeads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(filteredLeads.map((l) => l.id));
        }
    };

    const handleNext = () => {
        const leads = mockLeads.filter((l) => selectedLeads.includes(l.id));
        onNext({ selectedLeads, leads });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Select Your Audience</h3>
                <p className="text-sm text-gray-500">Choose which leads to include in this campaign.</p>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" /> Import CSV
                </Button>
            </div>

            {/* Lead List */}
            <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {/* Select All Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                    <Checkbox
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onCheckedChange={selectAll}
                    />
                    <span className="text-sm font-medium text-gray-700">
                        {selectedLeads.length} of {filteredLeads.length} selected
                    </span>
                </div>

                {/* Lead Rows */}
                {filteredLeads.map((lead) => (
                    <div
                        key={lead.id}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer ${selectedLeads.includes(lead.id) ? "bg-primary/5" : ""
                            }`}
                        onClick={() => toggleLead(lead.id)}
                    >
                        <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={() => toggleLead(lead.id)}
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-500">
                                {lead.email} • {lead.company}
                            </p>
                        </div>
                        {lead.verified ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Verified</span>
                        ) : (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Unverified</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleNext} disabled={selectedLeads.length === 0} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default CampaignAudience;
