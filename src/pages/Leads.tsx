import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Search,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Target,
  MessageSquare,
  Download,
  Mail,
  Copy,
  Eye,
  Pencil,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { leadService } from '@/services/leadService';
import { Lead } from '@/types';
import { toast } from 'sonner';

const Leads: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateFilters, setGenerateFilters] = useState({
    industry: '',
    location: ''
  });

  // Email Draft State
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    status: 'new',
    priority: 'medium',
    source: 'manual'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchLeads();
  }, [user, navigate]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const data = await leadService.getLeads();
      setLeads(data.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingLeadId) {
        await leadService.updateLead(editingLeadId, formData);
        toast.success('Lead updated successfully');
      } else {
        await leadService.createLead(formData);
        toast.success('Lead created successfully');
      }
      setIsDialogOpen(false);
      setEditingLeadId(null);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        status: 'new',
        priority: 'medium',
        source: 'manual'
      });
      fetchLeads();
    } catch (error) {
      toast.error(editingLeadId ? 'Failed to update lead' : 'Failed to create lead');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLeadId(lead._id);
    setFormData({
      companyName: lead.companyName,
      contactName: lead.contactName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status,
      priority: lead.priority,
      source: lead.source
    });
    setIsDialogOpen(true);
  };

  const handleGenerateLeads = async () => {
    try {
      setIsGenerating(true);
      await leadService.generateLeads(generateFilters);
      toast.success('AI Leads generated successfully');
      setIsGenerateDialogOpen(false);
      setGenerateFilters({ industry: '', location: '' });
      fetchLeads();
    } catch (error) {
      toast.error('Failed to generate leads');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    // Define CSV headers
    const headers = [
      'Company Name',
      'Contact Name',
      'Email',
      'Phone',
      'Industry',
      'Location',
      'Company Size',
      'Status',
      'Source',
      'Sales Pitch',
      'Pain Points',
      'Score',
      'Score Reason'
    ];

    // Convert leads to CSV rows
    const csvRows = leads.map(lead => [
      `"${lead.companyName || ''}"`,
      `"${lead.contactName || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.industry || ''}"`,
      `"${lead.location || ''}"`,
      `"${lead.companySize || ''}"`,
      `"${lead.status || ''}"`,
      `"${lead.source || ''}"`,
      `"${(lead.salesPitch || '').replace(/"/g, '""')}"`,
      `"${(lead.painPoints || []).join('; ').replace(/"/g, '""')}"`,
      `"${lead.score || ''}"`,
      `"${(lead.scoreReason || '').replace(/"/g, '""')}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDraftEmail = async (leadId: string) => {
    try {
      setIsDrafting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/leads/${leadId}/draft-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to draft email');

      const data = await response.json();
      setEmailDraft(data.data);
      setIsEmailDialogOpen(true);
    } catch (error) {
      toast.error('Failed to generate email draft');
      console.error(error);
    } finally {
      setIsDrafting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleExpand = (id: string) => {
    setExpandedLeadId(expandedLeadId === id ? null : id);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">Manage and track your potential customers.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Leads
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Target Audience</DialogTitle>
                  <DialogDescription>
                    Specify the industry and location to generate targeted leads.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="targetIndustry" className="text-right">
                      Industry
                    </Label>
                    <Input
                      id="targetIndustry"
                      value={generateFilters.industry}
                      onChange={(e) => setGenerateFilters(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Real Estate"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="targetLocation" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="targetLocation"
                      value={generateFilters.location}
                      onChange={(e) => setGenerateFilters(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. New York"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleGenerateLeads} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Leads
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingLeadId(null);
                  setFormData({
                    companyName: '',
                    contactName: '',
                    email: '',
                    phone: '',
                    status: 'new',
                    priority: 'medium',
                    source: 'manual'
                  });
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingLeadId ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new lead here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="companyName" className="text-right">
                        Company
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contactName" className="text-right">
                        Contact
                      </Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange('priority', value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingLeadId ? 'Update Lead' : 'Save Lead'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>
              A list of all your leads and their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No leads found. Create one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <React.Fragment key={lead._id}>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleExpand(lead._id)}>
                        <TableCell>
                          {expandedLeadId === lead._id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{lead.companyName}</span>
                            {lead.location && (
                              <span className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {lead.location}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{lead.contactName}</span>
                            <span className="text-xs text-muted-foreground">{lead.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                  lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                    lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                              {lead.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {lead.score !== undefined && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold
                                ${lead.score >= 80 ? 'bg-green-100 text-green-800' :
                                  lead.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'}`}>
                                {lead.score}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                                lead.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                  'bg-green-100 text-green-800'}`}>
                              {lead.priority}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(lead.createdAt || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(lead._id);
                              }}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(lead);
                              }}
                              title="Edit Lead"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDraftEmail(lead._id);
                              }}
                              disabled={isDrafting}
                              title="Draft Cold Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  toast.info("Enriching lead...");
                                  await fetch(`/api/leads/${lead._id}/enrich`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                                  toast.success("Lead enriched!");
                                  fetchLeads();
                                } catch (err) {
                                  toast.error("Failed to enrich");
                                }
                              }}
                              title="Enrich & Predict Score"
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedLeadId === lead._id && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={7} className="p-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="flex items-center font-semibold text-primary mb-2">
                                    <Target className="h-4 w-4 mr-2" />
                                    Sales Pitch
                                  </h4>
                                  <p className="text-sm text-muted-foreground bg-white p-3 rounded-md border shadow-sm">
                                    {lead.salesPitch || "No sales pitch available."}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="flex items-center font-semibold text-primary mb-2">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Pain Points
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-muted-foreground bg-white p-3 rounded-md border shadow-sm">
                                    {lead.painPoints && lead.painPoints.length > 0 ? (
                                      lead.painPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                      ))
                                    ) : (
                                      <li>No pain points identified.</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="flex items-center font-semibold text-primary mb-2">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Company Details
                                  </h4>
                                  <div className="bg-white p-3 rounded-md border shadow-sm space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Size:</span>
                                      <span className="font-medium">{lead.companySize || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Industry:</span>
                                      <span className="font-medium">{lead.industry || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Location:</span>
                                      <span className="font-medium">{lead.location || "Unknown"}</span>
                                    </div>
                                    {lead.scoreReason && (
                                      <div className="pt-2 mt-2 border-t">
                                        <span className="text-xs font-semibold text-muted-foreground block mb-1">Score Reason:</span>
                                        <p className="text-sm">{lead.scoreReason}</p>
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    className="w-full mt-4"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDraftEmail(lead._id);
                                    }}
                                    disabled={isDrafting}
                                  >
                                    {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                    Draft Cold Email
                                  </Button>
                                </div>
                                <div className="mt-4">
                                  <h4 className="flex items-center font-semibold text-primary mb-2">
                                    <ShieldAlert className="h-4 w-4 mr-2" />
                                    Competitor Intel
                                  </h4>
                                  <div className={`p-3 rounded-md border shadow-sm ${lead.competitorInsights ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                                    {lead.competitorInsights ? (
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center text-red-800">
                                          <span className="text-sm font-bold">Detected: {lead.competitorInsights.detectedCompetitor}</span>
                                          <span className="text-[10px] uppercase">Active recently</span>
                                        </div>
                                        <p className="text-xs text-red-600">"{lead.competitorInsights.detectedTemplate}"</p>
                                        <div className="bg-white/50 p-2 rounded text-xs text-red-900 border border-red-100">
                                          <strong>Counter Strategy:</strong> {lead.competitorInsights.counterStrategy}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <p className="text-xs text-muted-foreground mb-2">No active threats detected.</p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="w-full text-xs h-7"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            const text = prompt("Paste email/message content to scan:");
                                            if (!text) return;
                                            try {
                                              toast.info("Scanning for competitors...");
                                              const res = await fetch(`/api/leads/${lead._id}/analyze-competitors`, {
                                                method: 'POST',
                                                headers: {
                                                  'Content-Type': 'application/json',
                                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                },
                                                body: JSON.stringify({ text })
                                              });
                                              const data = await res.json();
                                              if (data.competitorFound) {
                                                toast.error(`Alert: ${data.insight.name} detected!`);
                                              } else {
                                                toast.success("No competitors found.");
                                              }
                                              fetchLeads();
                                            } catch (err) {
                                              toast.error("Scan failed");
                                            }
                                          }}
                                        >
                                          Scan Content
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>AI Email Draft</DialogTitle>
              <DialogDescription>
                Review and copy your personalized cold email.
              </DialogDescription>
            </DialogHeader>
            {emailDraft && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">Subject</Label>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(emailDraft.subject)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {emailDraft.subject}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">Body</Label>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(emailDraft.body)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap h-[300px] overflow-y-auto">
                    {emailDraft.body}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Close</Button>
              <Button onClick={() => {
                copyToClipboard(`${emailDraft?.subject}\n\n${emailDraft?.body}`);
                toast.success('Full email copied');
              }}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Leads;