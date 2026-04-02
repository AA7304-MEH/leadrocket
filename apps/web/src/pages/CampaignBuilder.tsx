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
  Lightbulb, CheckCircle2, AlertCircle, Info, ChevronRight
} from "lucide-react";
import { 
  analyzeSubjectLine, 
  SubjectLineAnalysis, 
  remixEmailBody,
  generateSubjectLines 
} from "@/lib/gemini";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import ShareWinModal from "@/components/campaigns/ShareWinModal";
import confetti from 'canvas-confetti';

export default function CampaignBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);
  
  // State
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [analysis, setAnalysis] = useState<SubjectLineAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [suggestedSubjects, setSuggestedSubjects] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // AI Analysis Effect
  const debouncedAnalysis = useCallback(
    debounce(async (val: string) => {
      if (val.length < 3) return;
      setIsAnalyzing(true);
      const res = await analyzeSubjectLine(val);
      setAnalysis(res);
      setIsAnalyzing(false);
    }, 800),
    []
  );

  useEffect(() => {
    debouncedAnalysis(subject);
  }, [subject, debouncedAnalysis]);

  const handleRemix = async () => {
    setIsRemixing(true);
    const newBody = await remixEmailBody(body);
    setBody(newBody);
    setIsRemixing(false);
    toast.success("AI Remix complete! ✨");
  };

  const handleGenerateSubjects = async () => {
    toast.loading("Generating hooks...");
    const subjects = await generateSubjectLines(name || "New Campaign", "B2B SaaS", "Lead Generation");
    setSuggestedSubjects(subjects);
    setShowSuggestions(true);
    toast.dismiss();
  };

  const handleSendNow = async () => {
    toast.loading("Sending campaign...");
    
    // Simulate send API call
    setTimeout(() => {
      toast.dismiss();
      toast.success("Campaign sent successfully! 🚀");
      
      if ((analysis?.score || 0) >= 80) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setShowShareModal(true), 1200);
      } else {
        navigate("/campaigns");
      }
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto px-4 pb-20">
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
                {isEditing ? "Edit Campaign" : "New Campaign"}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
                {isEditing ? "Modify your sequence" : "Build your AI engine"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 h-12 rounded-2xl">
              Preview
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12 rounded-2xl shadow-lg shadow-blue-600/20">
              Continue to Audience
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
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
                  className="bg-transparent border-none text-2xl font-black tracking-tighter p-0 focus-visible:ring-0 placeholder:text-slate-800 h-auto"
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
                  {isAnalyzing && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">AI Suggested Hooks</h4>
                      <div className="space-y-3">
                        {suggestedSubjects.map((s, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setSubject(s);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-blue-600/10 hover:text-blue-400 transition-all font-bold tracking-tight text-sm"
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
              <ArcMeter score={analysis?.score || 0} />
              
              <div className="w-full mt-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Feedback</span>
                    {analysis && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        AI Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-200 leading-relaxed italic">
                    {analysis?.feedback || "Start typing your subject line to receive expert AI feedback in real-time."}
                  </p>
                </div>

                {analysis?.suggestions && analysis.suggestions.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Suggested Fixes</span>
                    <div className="flex flex-wrap gap-3">
                      {analysis.suggestions.map((s, i) => (
                        <div key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-default">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-white/5" />

                <div className="grid grid-cols-2 gap-6">
                  <StatItem label="Audience Match" value="High" icon={<CheckCircle2 className="text-emerald-500 w-4 h-4" />} />
                  <StatItem label="Spam Risk" value="Low" icon={<CheckCircle2 className="text-emerald-500 w-4 h-4" />} />
                  <StatItem label="Deliverability" value="98%" icon={<Info className="text-blue-500 w-4 h-4" />} />
                  <StatItem label="Boredom Level" value="None" icon={<AlertCircle className="text-emerald-500 w-4 h-4" />} />
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/10 rounded-3xl p-8">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Expert Optimization Tip
              </h4>
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                Emails sent between 9:00 AM and 11:00 AM exhibit 34% higher engagement rates in your industry.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 h-24 bg-[#0A0A0A]/80 backdrop-blur-3xl border-t border-white/5 z-40 flex items-center justify-between px-12">
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] gap-2">
            <Save className="w-4 h-4" />
            Save as Draft
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-white/5 bg-white/2 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12 rounded-2xl gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Send
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] px-12 h-12 rounded-2xl shadow-xl shadow-blue-600/30 gap-2"
            onClick={handleSendNow}
          >
            <Send className="w-4 h-4" />
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
        score={analysis?.score || 0}
      />
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
