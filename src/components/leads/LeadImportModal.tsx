
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, FileText, CheckCircle, Loader2, X } from "lucide-react";
import type { Lead } from "@/pages/Leads";

interface LeadImportModalProps {
    open: boolean;
    onClose: () => void;
    onImport: (leads: Lead[]) => void;
}

const LeadImportModal = ({ open, onClose, onImport }: LeadImportModalProps) => {
    const [tab, setTab] = useState("manual");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [manualLead, setManualLead] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        title: "",
    });

    const handleManualSubmit = () => {
        const newLead: Lead = {
            id: String(Date.now()),
            ...manualLead,
            verificationStatus: "pending",
            source: "Manual",
            createdAt: "Just now",
        };
        onImport([newLead]);
        setManualLead({ firstName: "", lastName: "", email: "", company: "", title: "" });
        onClose();
    };

    const handleCSVUpload = () => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
            // Mock imported leads
            const importedLeads: Lead[] = [
                { id: String(Date.now() + 1), firstName: "John", lastName: "Doe", email: "john@example.com", company: "Example Inc", title: "Manager", verificationStatus: "pending", source: "CSV Import", createdAt: "Just now" },
                { id: String(Date.now() + 2), firstName: "Jane", lastName: "Smith", email: "jane@sample.co", company: "Sample Co", title: "Director", verificationStatus: "pending", source: "CSV Import", createdAt: "Just now" },
            ];
            setTimeout(() => {
                onImport(importedLeads);
                setUploadComplete(false);
                onClose();
            }, 1500);
        }, 2000);
    };

    const isManualValid = manualLead.email.trim() && manualLead.firstName.trim();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Leads</DialogTitle>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="manual" className="gap-2">
                            <Plus className="w-4 h-4" /> Manual Entry
                        </TabsTrigger>
                        <TabsTrigger value="csv" className="gap-2">
                            <Upload className="w-4 h-4" /> CSV Upload
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name *</Label>
                                <Input
                                    value={manualLead.firstName}
                                    onChange={(e) => setManualLead({ ...manualLead, firstName: e.target.value })}
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={manualLead.lastName}
                                    onChange={(e) => setManualLead({ ...manualLead, lastName: e.target.value })}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                value={manualLead.email}
                                onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                    value={manualLead.company}
                                    onChange={(e) => setManualLead({ ...manualLead, company: e.target.value })}
                                    placeholder="Acme Inc"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={manualLead.title}
                                    onChange={(e) => setManualLead({ ...manualLead, title: e.target.value })}
                                    placeholder="CEO"
                                />
                            </div>
                        </div>
                        <Button onClick={handleManualSubmit} disabled={!isManualValid} className="w-full">
                            Add Lead
                        </Button>
                    </TabsContent>

                    <TabsContent value="csv" className="mt-4">
                        {uploadComplete ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <p className="font-medium text-gray-900">2 leads imported!</p>
                                <p className="text-sm text-gray-500">Verification in progress...</p>
                            </div>
                        ) : isUploading ? (
                            <div className="text-center py-8">
                                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                                <p className="font-medium text-gray-900">Processing CSV...</p>
                                <p className="text-sm text-gray-500">This may take a moment</p>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 cursor-pointer transition-colors"
                                onClick={handleCSVUpload}
                            >
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="font-medium text-gray-900">Drop your CSV here</p>
                                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                                <Button variant="outline" size="sm">Select File</Button>
                                <p className="text-xs text-gray-400 mt-4">
                                    Required columns: email. Optional: first_name, last_name, company, title
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default LeadImportModal;
