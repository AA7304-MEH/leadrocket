import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Check, ChevronRight, ChevronLeft, Sparkles, 
  Rocket, Globe, DollarSign 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PublishTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PublishTemplateModal({ open, onOpenChange }: PublishTemplateModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Template submitted for review! 🚀");
      onOpenChange(false);
      setStep(1);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0A0A0A] border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
        <div className="flex h-[600px]">
          {/* Sidebar Progress */}
          <div className="w-48 bg-[#111111] border-r border-white/5 p-8 flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Steps</h3>
            <StepIndicator current={step} target={1} label="Identity" />
            <StepIndicator current={step} target={2} label="Packaging" />
            <StepIndicator current={step} target={3} label="Review" />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-10 pb-6">
              <DialogTitle className="text-3xl font-black tracking-tighter text-white">
                {step === 1 && "Define your template"}
                {step === 2 && "Configure packaging"}
                {step === 3 && "Final verification"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Share your high-impact sequences with the world
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 px-10 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Template Title</Label>
                      <Input placeholder="e.g. High-Ticket SaaS Closer" className="bg-white/5 border-white/5 h-14 rounded-xl px-6 font-bold text-white focus:border-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Industry</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="agency">Agency</SelectItem>
                            <SelectItem value="realestate">Real Estate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Type</Label>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="cold">Cold Outreach</SelectItem>
                            <SelectItem value="nurture">Nurture</SelectItem>
                            <SelectItem value="viral">Viral Loop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</Label>
                      <Textarea placeholder="What makes this sequence special?" className="bg-white/5 border-white/5 min-h-[120px] rounded-xl p-4 font-bold text-slate-300 focus:border-blue-500" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pricing Model</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <PriceOption selected label="Free" value="0" />
                        <PriceOption label="Starter" value="9" />
                        <PriceOption label="Pro" value="29" />
                      </div>
                    </div>
                    <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">AI-Enhanced Listing</h4>
                      </div>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed">Our AI will automatically generate a high-impact cover image and metadata for your template based on your description.</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center justify-center h-full text-center py-10 gap-6"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center ring-4 ring-emerald-500/20">
                      <Rocket className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white tracking-tight">Ready for Launch</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-sm">By submitting, your template will undergo a brief quality audit before being visible to the LeadRockets community.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] rounded-xl border border-white/5">
                      <Globe className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visibility: Public</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DialogFooter className="p-10 pt-6 flex items-center justify-between sm:justify-between bg-[#111111]/50 border-t border-white/5">
              {step > 1 ? (
                <Button variant="ghost" onClick={prevStep} className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 border-none">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : <div />}
              
              {step < 3 ? (
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 h-14 px-12 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/30"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ current, target, label }: { current: number, target: number, label: string }) {
  const active = current >= target;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 ${active ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-600'}`}>
          {current > target ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-black">{target}</span>}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-white' : 'text-slate-600'}`}>{label}</span>
      </div>
      {target < 3 && <div className={`ml-[11px] w-px h-8 ${current > target ? 'bg-blue-600' : 'bg-white/5'}`} />}
    </div>
  );
}

function PriceOption({ label, value, selected = false }: { label: string, value: string, selected?: boolean }) {
  return (
    <button className={`p-6 rounded-2xl border flex flex-col gap-2 text-left transition-all group ${selected ? 'bg-blue-600/10 border-blue-600' : 'bg-white/3 border-white/5 hover:border-white/20'}`}>
      <span className={`text-[9px] font-black uppercase tracking-widest ${selected ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'}`}>{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-black ${selected ? 'text-white' : 'text-slate-300'}`}>${value}</span>
        {value !== "0" && <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-500 transition-colors">/one-time</span>}
      </div>
    </button>
  );
}
