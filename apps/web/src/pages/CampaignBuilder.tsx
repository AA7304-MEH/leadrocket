import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CampaignEditor from "@/components/campaigns/CampaignEditor";
import ArcMeter from "@/components/campaigns/ArcMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Save, Send, Calendar, Sparkles, 
  Lightbulb, CheckCircle2, AlertCircle, Info, ChevronRight,
  AlertTriangle, Loader2, Zap
} from "lucide-react";
import { useCampaigns, Campaign } from "@/hooks/useCampaigns";
import { useLeads } from "@/hooks/useLeads";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ShareWinModal from "@/components/campaigns/ShareWinModal";
import confetti from 'canvas-confetti';
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import api, { aiApi } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CampaignBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, createCampaign, updateCampaign, sendCampaign, isLoading: campaignsLoading } = useCampaigns();
  const { leadLists, isLoading: leadsLoading } = useLeads();
  const { profile } = useProfile();
  
  // State
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [suggestedSubjects, setSuggestedSubjects] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  // Debounce subject and body for AI scoring
  const debouncedSubject = useDebounce(subject, 800);
  const debouncedBody = useDebounce(body, 800);

  // Load existing campaign if editing
  useEffect(() => {
    if (id && campaigns.length > 0) {
      const existing = campaigns.find(c => c.id === id);
      if (existing) {
        setName(existing.name);
        setSubject(existing.subject_line);
        setBody(existing.body);
      }
    }
  }, [id, campaigns]);

  // AI Scoring Query
  const { data: scoreData, isLoading: scoring } = useQuery({
    queryKey: ['campaign-score', debouncedSubject, debouncedBody],
    queryFn: async () => {
      if (!debouncedSubject || !debouncedBody) return null;
      const res = await aiApi.scoreCampaign({
        subjectLine: debouncedSubject,
        body: debouncedBody,
        targetIndustry: profile?.industry ?? 'General',
        leadCount: leadLists.find(l => l.id === selectedListId)?.lead_count ?? 0,
        sendTime: scheduledDate
      });
      return res.data.data;
    },
    enabled: debouncedSubject.length > 5 && debouncedBody.length > 20
  });

  const handleSaveDraft = async () => {
    if (!name) return toast.error("Campaign name is required");
    setIsSaving(true);
    try {
      const campaignData: Partial<Campaign> = {
        name,
        subject_line: subject,
        body,
        status: 'draft',
        ai_score: scoreData?.overallScore || 0,
      };

      if (id) {
        await updateCampaign({ id, ...campaignData });
      } else {
        const newCampaign = await createCampaign(campaignData);
        if (newCampaign) navigate(`/campaigns/${newCampaign.id}/edit`, { replace: true });
      }
      toast.success("Draft saved successfully ✓");
    } catch (err: any) {
      toast.error(`Failed to save draft: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNow = async () => {
    if (!name || !subject || !body || !selectedListId) {
      return toast.error("Please fill in all fields and select a recipient list");
    }
    setShowConfirmSend(true);
  };

  const confirmSend = async () => {
    if (!id) {
      toast.error("Please save the campaign as a draft first");
      return;
    }
    setIsSending(true);
    setShowConfirmSend(false);
    try {
      await sendCampaign(id);
      
      if ((scoreData?.overallScore || 0) >= 80) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setShowShareModal(true), 1200);
      } else {
        navigate("/campaigns");
      }
    } catch (err: any) {
      toast.error(`Launch aborted: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleSend = async () => {
    if (!name || !subject || !body || !selectedListId) {
      return toast.error("Please fill in all fields and select a recipient list");
    }
    setShowScheduleDialog(true);
  };

  const confirmSchedule = async () => {
    if (!scheduledDate) return toast.error("Please select a date and time");
    setIsSaving(true);
    setShowScheduleDialog(false);
    try {
      const campaignData: Partial<Campaign> = {
        name,
        subject_line: subject,
        body,
        status: 'scheduled',
        send_time: new Date(scheduledDate).toISOString(),
      };

      if (id) {
        await updateCampaign({ id, ...campaignData });
      } else {
        await createCampaign(campaignData);
      }

      toast.success("Campaign scheduled successfully! 📅");
      navigate("/campaigns");
    } catch (err: any) {
      toast.error(`Failed to schedule: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemix = async () => {
    setIsRemixing(true);
    try {
      const res = await aiApi.remixCampaign({
        subjectLine: subject,
        body: body,
        industry: profile?.industry ?? 'General'
      });
      setSubject(res.data.data.subjectLine);
      setBody(res.data.data.body);
      toast.success("AI Remix complete! ✨");
    } catch (err) {
      toast.error("Remix failed.");
    } finally {
      setIsRemixing(false);
    }
  };

  const handleGenerateSubjects = async () => {
    const loadingToast = toast.loading("Generating hooks...");
    try {
      const res = await aiApi.generateSubjects({
        context: name || "New Campaign",
        industry: profile?.industry ?? 'General'
      });
      setSuggestedSubjects(res.data.data);
      setShowSuggestions(true);
    } catch (err) {
      toast.error("Generation failed.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto px-4 pb-20 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/campaigns")}
              className="text-slate-500 hover:text-white bg-white/5 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">
                {id ? "Edit Campaign" : "New Campaign"}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
                {id ? "Modify your sequence" : "Build your AI engine"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1 w-48">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1">Recipient List</Label>
              <Select value={selectedListId} onValueChange={setSelectedListId}>
                <SelectTrigger className="bg-white/5 border-white/5 h-10 rounded-xl text-xs font-bold text-white">
                  <SelectValue placeholder="Select List" />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-white/10 rounded-xl text-white">
                  {leadLists.map(list => (
                    <SelectItem key={list.id} value={list.id} className="text-xs font-bold focus:bg-white/5 focus:text-blue-500">
                      {list.name} ({list.lead_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left Panel - Editor (60%) */}
          <div className="lg:col-span-3 space-y-8">
            <section className="space-y-6 bg-[#111111] border border-white/5 p-8 rounded-3xl">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Campaign Identity</Label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Q4 Enterprise Outreach"
                  className="bg-transparent border-none text-2xl font-black tracking-tighter p-0 focus-visible:ring-0 placeholder:text-slate-800 h-auto text-white"
                />
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4 relative">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Subject Line</Label>
                  <button 
                    onClick={handleGenerateSubjects}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Lightbulb className="w-3 h-3" />
                    Generate hooks
                  </button>
                </div>
                <div className="relative group">
                  <Input 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter your compelling subject line..."
                    className="bg-white/5 border-white/5 h-14 rounded-2xl px-6 font-bold tracking-tight text-white focus:border-blue-500/50 transition-all"
                  />
                  {scoring && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full mt-4 p-6 bg-[#1A1A1A] border border-white/5 rounded-3xl z-50 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-white">AI Suggested Hooks</h4>
                        <button onClick={() => setShowSuggestions(false)} className="text-[9px] font-black uppercase text-slate-600 hover:text-white">Close</button>
                      </div>
                      <div className="space-y-3">
                        {suggestedSubjects.map((s, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setSubject(s);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-blue-600/10 hover:text-blue-400 transition-all font-bold tracking-tight text-sm text-white"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <CampaignEditor 
              content={body}
              onChange={setBody}
              onRemix={handleRemix}
              isRemixing={isRemixing}
            />
          </div>

          {/* Right Panel - AI Stats (40%) */}
          <div className="lg:col-span-2 space-y-8 sticky top-24">
            <section className="bg-[#111111] border border-white/5 rounded-3xl p-10 flex flex-col items-center">
              <ArcMeter score={scoreData?.overallScore || 0} />
              
              <div className="w-full mt-12 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <StatBar label="Subject" score={scoreData?.subjectScore || 0} />
                  <StatBar label="Body" score={scoreData?.bodyScore || 0} />
                  <StatBar label="Timing" score={scoreData?.timingScore || 0} />
                  <StatBar label="Audience" score={scoreData?.audienceScore || 0} />
                </div>

                <div className="h-px bg-white/5" />

                <div className="grid grid-cols-2 gap-6">
                  <StatItem label="Predicted Open" value={`${((scoreData?.predictedOpenRate || 0) * 100).toFixed(1)}%`} icon={<Info className="text-blue-500 w-4 h-4" />} />
                  <StatItem label="Predicted Reply" value={`${((scoreData?.predictedReplyRate || 0) * 100).toFixed(1)}%`} icon={<Info className="text-blue-500 w-4 h-4" />} />
                </div>

                {scoreData?.suggestions && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Suggestions</span>
                    <div className="flex flex-wrap gap-2">
                      {scoreData.suggestions.map((s: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-white/5 border-white/5 text-slate-400 text-[10px] py-1 px-3">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                    <Button 
                        onClick={handleRemix} 
                        disabled={isRemixing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black uppercase tracking-widest text-xs h-12 rounded-2xl gap-2"
                    >
                        {isRemixing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        ✦ Remix with AI
                    </Button>
                    <Button 
                        onClick={handleGenerateSubjects}
                        variant="outline"
                        className="w-full border-white/5 bg-white/5 text-white font-black uppercase tracking-widest text-xs h-12 rounded-2xl gap-2"
                    >
                        <Lightbulb className="w-4 h-4" />
                        💡 Generate Subjects
                    </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 h-24 bg-[#0A0A0A]/80 backdrop-blur-3xl border-t border-white/5 z-40 flex items-center justify-between px-12">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            disabled={isSaving}
            onClick={handleSaveDraft}
            className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save as Draft
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleScheduleSend}
            className="border-white/5 bg-white/2 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12 rounded-2xl gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Send
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] px-12 h-12 rounded-2xl shadow-xl shadow-blue-600/30 gap-2"
            disabled={isSending}
            onClick={handleSendNow}
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Now
          </Button>
        </div>
      </div>

      <ShareWinModal 
        isOpen={showShareModal}
        onClose={() => {
            setShowShareModal(false);
            navigate("/campaigns");
        }}
        campaignName={name || "New Campaign"}
        score={scoreData?.overallScore || 0}
      />

      <AlertDialog open={showConfirmSend} onOpenChange={setShowConfirmSend}>
        <AlertDialogContent className="bg-[#111111] border-white/5 rounded-3xl p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter text-white">Blast Off Confirmation</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-bold uppercase tracking-[0.1em] text-[10px] mt-2">
              You are about to send this campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-4">
            <AlertDialogCancel className="bg-transparent border-white/5 text-slate-500 hover:text-white hover:bg-white/5 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8">
              Wait, One Sec
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSend}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-12"
            >
              Confirm & Launch 🚀
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <AlertDialogContent className="bg-[#111111] border-white/5 rounded-3xl p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter text-white">Schedule Blast Off</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-bold uppercase tracking-[0.1em] text-[10px] mt-2">
              Select the date and time for automated launch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Launch Date & Time</Label>
              <Input 
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-white/5 border-white/5 h-14 rounded-2xl px-6 font-bold text-white focus:border-blue-500/50"
              />
            </div>
          </div>
          <AlertDialogFooter className="flex items-center gap-4">
            <AlertDialogCancel className="bg-transparent border-white/5 text-slate-500 hover:text-white hover:bg-white/5 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSchedule}
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-12"
            >
              Schedule Now 📅
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-black text-white">{value}</span>
      </div>
    </div>
  );
}

function StatBar({ label, score }: { label: string, score: number }) {
    const getColor = (s: number) => {
        if (s <= 40) return "bg-red-500";
        if (s <= 70) return "bg-amber-500";
        return "bg-emerald-500";
    };
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                <span>{label}</span>
                <span>{score}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className={cn("h-full", getColor(score))}
                />
            </div>
        </div>
    );
}
