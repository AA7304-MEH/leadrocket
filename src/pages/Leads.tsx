
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeadImportModal from "@/components/leads/LeadImportModal";
import LeadDetailsModal from "@/components/leads/LeadDetailsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus, Upload, Search, MoreHorizontal, Users, ShieldCheck,
  ShieldX, Mail, Trash2, Send, Filter, CheckCircle, XCircle, Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  verificationStatus: 'verified' | 'unverified' | 'invalid' | 'pending';
  source: string;
  createdAt: string;
  lastContacted?: string;
}

const mockLeads: Lead[] = [
  { id: "1", firstName: "Sarah", lastName: "Chen", email: "sarah@techcorp.com", company: "TechCorp", title: "CEO", verificationStatus: "verified", source: "CSV Import", createdAt: "2 days ago" },
  { id: "2", firstName: "Mike", lastName: "Rodriguez", email: "mike@startupxyz.io", company: "StartupXYZ", title: "CTO", verificationStatus: "verified", source: "Manual", createdAt: "1 week ago" },
  { id: "3", firstName: "Jessica", lastName: "Lee", email: "jessica@growthlabs.com", company: "GrowthLabs", title: "VP Sales", verificationStatus: "unverified", source: "CSV Import", createdAt: "3 days ago" },
  { id: "4", firstName: "Alex", lastName: "Johnson", email: "alex@innovate.co", company: "Innovate Co", title: "Director", verificationStatus: "invalid", source: "LinkedIn", createdAt: "1 week ago" },
  { id: "5", firstName: "Emma", lastName: "Wilson", email: "emma@futuretech.io", company: "FutureTech", title: "Founder", verificationStatus: "pending", source: "CSV Import", createdAt: "Just now" },
  { id: "6", firstName: "David", lastName: "Park", email: "david@scaleup.com", company: "ScaleUp", title: "CMO", verificationStatus: "verified", source: "API", createdAt: "5 days ago" },
];

const verificationBadges = {
  verified: { icon: <ShieldCheck className="w-3 h-3" />, className: "bg-green-100 text-green-700", label: "Verified" },
  unverified: { icon: <Clock className="w-3 h-3" />, className: "bg-gray-100 text-gray-700", label: "Unverified" },
  invalid: { icon: <ShieldX className="w-3 h-3" />, className: "bg-red-100 text-red-700", label: "Invalid" },
  pending: { icon: <Clock className="w-3 h-3" />, className: "bg-amber-100 text-amber-700", label: "Pending" },
};

const Leads = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsModalOpen(true);
  };

  const handleImportComplete = (newLeads: Lead[]) => {
    setLeads([...newLeads, ...leads]);
  };

  const handleDeleteSelected = () => {
    setLeads(leads.filter((l) => !selectedLeads.includes(l.id)));
    setSelectedLeads([]);
  };

  const stats = {
    total: leads.length,
    verified: leads.filter((l) => l.verificationStatus === "verified").length,
    unverified: leads.filter((l) => l.verificationStatus === "unverified").length,
    invalid: leads.filter((l) => l.verificationStatus === "invalid").length,
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Manage and verify your contacts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportModalOpen(true)} className="gap-2">
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button onClick={() => setImportModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
              <p className="text-sm text-gray-500">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.unverified}</p>
              <p className="text-sm text-gray-500">Unverified</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.invalid}</p>
              <p className="text-sm text-gray-500">Invalid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          {selectedLeads.length > 0 && (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <Send className="w-4 h-4" /> Add to Campaign
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700" onClick={handleDeleteSelected}>
                <Trash2 className="w-4 h-4" /> Delete ({selectedLeads.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-12 px-4 py-4">
                    <Checkbox
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onCheckedChange={selectAll}
                    />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">Company</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">Source</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-4">Added</th>
                  <th className="w-12 px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLeads.map((lead) => {
                  const badge = verificationBadges[lead.verificationStatus];
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleLeadClick(lead)}>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleLead(lead.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                            {lead.firstName[0]}{lead.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                            <p className="text-sm text-gray-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{lead.company}</p>
                        <p className="text-sm text-gray-500">{lead.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={`gap-1 ${badge.className}`}>
                          {badge.icon}
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{lead.source}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{lead.createdAt}</td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Send Email</DropdownMenuItem>
                            <DropdownMenuItem><ShieldCheck className="w-4 h-4 mr-2" /> Verify</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <LeadImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportComplete}
      />
      <LeadDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        lead={selectedLead}
      />
    </DashboardLayout>
  );
};

export default Leads;