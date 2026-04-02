
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, ShieldCheck, Building2, Briefcase, Calendar, Link2 } from "lucide-react";
import type { Lead } from "@/pages/Leads";

interface LeadDetailsModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
}

const verificationBadges = {
    verified: { className: "bg-green-100 text-green-700", label: "Verified" },
    unverified: { className: "bg-gray-100 text-gray-700", label: "Unverified" },
    invalid: { className: "bg-red-100 text-red-700", label: "Invalid" },
    pending: { className: "bg-amber-100 text-amber-700", label: "Pending" },
};

const LeadDetailsModal = ({ open, onClose, lead }: LeadDetailsModalProps) => {
    if (!lead) return null;

    const badge = verificationBadges[lead.verificationStatus];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Lead Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                            {lead.firstName[0]}{lead.lastName[0]}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {lead.firstName} {lead.lastName}
                        </h3>
                        <p className="text-gray-500">{lead.title} at {lead.company}</p>
                        <Badge className={`mt-2 ${badge.className}`}>{badge.label}</Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{lead.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Company</p>
                                <p className="font-medium text-gray-900">{lead.company}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Title</p>
                                <p className="font-medium text-gray-900">{lead.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Link2 className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Source</p>
                                <p className="font-medium text-gray-900">{lead.source}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Added</p>
                                <p className="font-medium text-gray-900">{lead.createdAt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2">
                            <ShieldCheck className="w-4 h-4" /> Verify
                        </Button>
                        <Button className="flex-1 gap-2">
                            <Send className="w-4 h-4" /> Send Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsModal;
