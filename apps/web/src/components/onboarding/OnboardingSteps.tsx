
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  Sparkles, 
  Rocket, 
  ChevronRight, 
  ChevronLeft,
  Briefcase,
  Globe,
  Upload,
  Plus,
  ArrowRight,
  TrendingUp,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SuccessMeter from "./SuccessMeter";
import confetti from "canvas-confetti";

// -------------------------------------------------------------------
// Step 1: Welcome
// -------------------------------------------------------------------
export const WelcomeStep = ({ onNext, data }: { onNext: (data: any) => void; data: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
        <Rocket className="w-10 h-10 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">
        Welcome to LeadRockets, <span className="text-indigo-600">{data.userName || "Founder"}</span>!
      </h1>
      <p className="text-lg text-slate-500 max-w-md mx-auto">
        Let’s get your growth engine started. We’ll have your first campaign ready in under 10 minutes.
      </p>
      <Button 
        size="lg" 
        onClick={() => onNext({})}
        className="h-14 px-10 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
      >
        Let’s set up your first campaign <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </motion.div>
  );
};

// -------------------------------------------------------------------
// Step 2: Company Setup
// -------------------------------------------------------------------
const industryDefaults: Record<string, string> = {
  saas: "Founders, Product Managers, and Growth Leads at Series A/B startups.",
  healthcare: "Clinic Managers, Private Practice Owners, and Hospital Administrators.",
  real_estate: "High-net-worth Property Investors, Home Owners, and Real Estate Agents.",
  finance: "CFOs, Asset Managers, and Compliance Officers at Mid-market firms.",
  ecommerce: "DTC Brand Owners and Marketing Directors at e-commerce companies.",
  other: "Small and medium business owners looking for growth."
};

export const CompanyStep = ({ onNext, onBack, data }: { onNext: (data: any) => void; onBack: () => void; data: any }) => {
  const [company, setCompany] = useState(data.company || "");
  const [industry, setIndustry] = useState(data.industry || "");
  const [audience, setAudience] = useState(data.audience || "");

  useEffect(() => {
    if (industry && !audience) {
      setAudience(industryDefaults[industry] || "");
    }
  }, [industry]);

  const isValid = company && industry && audience;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-900">Tell us about your company</h2>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input 
            id="company" 
            placeholder="e.g. Acme Growth" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-12 border-slate-200 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saas">SaaS & Software</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience Description</Label>
          <Textarea 
            id="audience" 
            placeholder="Who are we reaching out to?" 
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="min-h-[100px] border-slate-200 focus:border-indigo-500 transition-all font-medium"
          />
          <p className="text-xs text-slate-400 italic">
            <Sparkles className="w-3 h-3 inline mr-1" /> Smart pre-filled based on your industry.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button variant="ghost" onClick={onBack} size="lg">Back</Button>
        <Button 
          disabled={!isValid} 
          onClick={() => onNext({ company, industry, audience })}
          size="lg"
          className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700"
        >
          Sounds right <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// -------------------------------------------------------------------
// Step 3: Import or Create Leads
// -------------------------------------------------------------------
export const LeadsStep = ({ onNext, onBack, data }: { onNext: (data: any) => void; onBack: () => void; data: any }) => {
  const [method, setMethod] = useState<"import" | "manual" | null>(null);
  const [leads, setLeads] = useState(data.leads || [{ name: "", email: "", company: "" }]);

  const addLeadRow = () => {
    if (leads.length < 5) {
      setLeads([...leads, { name: "", email: "", company: "" }]);
    }
  };

  const updateLead = (index: number, field: string, value: string) => {
    const newLeads = [...leads];
    newLeads[index] = { ...newLeads[index], [field]: value };
    setLeads(newLeads);
  };

  const isValid = method === "import" || (method === "manual" && leads[0].name && leads[0].email);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-900">Who are you targeting?</h2>
      </div>

      {!method ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => setMethod("import")}
            className="p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group group block text-left"
          >
            <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 mb-4 transition-colors" />
            <h3 className="font-bold text-lg text-slate-800">Import CSV</h3>
            <p className="text-sm text-slate-500">Perfect for large lists. Download our sample template.</p>
          </button>
          <button 
            onClick={() => setMethod("manual")}
            className="p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group text-left"
          >
            <Plus className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 mb-4 transition-colors" />
            <h3 className="font-bold text-lg text-slate-800">Add Manually</h3>
            <p className="text-sm text-slate-500">Quickly add 1-5 leads to test the waters.</p>
          </button>
        </div>
      ) : method === "import" ? (
        <div className="space-y-4">
          <div className="p-12 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl text-center">
            <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <p className="font-bold text-slate-700">Drop your CSV file here</p>
            <p className="text-sm text-slate-400 mb-4">or click to browse</p>
            <Button variant="outline" size="sm">Select File</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Requirements: Name, Email, Company</span>
            <button className="text-xs font-bold text-indigo-600 hover:underline">Download Template CSV</button>
          </div>
          <Button variant="ghost" onClick={() => setMethod(null)} className="w-full">Change Method</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
            {leads.map((lead: any, idx: number) => (
              <div key={idx} className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Input 
                  placeholder="Full Name" 
                  value={lead.name}
                  onChange={(e) => updateLead(idx, "name", e.target.value)}
                  className="bg-white border-slate-200"
                />
                <Input 
                  placeholder="Email" 
                  value={lead.email}
                  onChange={(e) => updateLead(idx, "email", e.target.value)}
                  className="bg-white border-slate-200"
                />
                <Input 
                  placeholder="Company" 
                  value={lead.company}
                  onChange={(e) => updateLead(idx, "company", e.target.value)}
                  className="bg-white border-slate-200"
                />
              </div>
            ))}
          </div>
          {leads.length < 5 && (
            <Button variant="outline" onClick={addLeadRow} className="w-full border-dashed">
              <Plus className="w-4 h-4 mr-2" /> Add another lead
            </Button>
          )}
          <Button variant="ghost" onClick={() => setMethod(null)} className="w-full">Change Method</Button>
        </div>
      )}

      <div className="flex gap-3 pt-6 border-t border-slate-100">
        <Button variant="ghost" onClick={onBack} size="lg">Back</Button>
        <Button 
          disabled={!isValid} 
          onClick={() => onNext({ leads })}
          size="lg"
          className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700"
        >
          Next step <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// -------------------------------------------------------------------
// Step 4: Create Campaign
// -------------------------------------------------------------------
const industryTemplates: Record<string, { subject: string; body: string }> = {
  saas: { 
    subject: "Revolutionize your workflow?", 
    body: "Hi {first_name}, I noticed your work at {company} and I think we can help you boost your productivity with our AI-driven solutions..."
  },
  healthcare: { 
    subject: "Elevate patient care at {company}", 
    body: "Hello {first_name}, I'm reaching out because we help private practices like yours streamline administrative tasks so you can focus on patients..."
  },
  real_estate: { 
    subject: "New investment opportunities in {industry}", 
    body: "Hi {first_name}, given your interest in the real estate market at {company}, I wanted to share some exclusive listings focused on modern investors..."
  },
  finance: { 
    subject: "Scaling your asset management", 
    body: "Dear {first_name}, I've been following the growth of {company} and believe our compliance-driven platform can help your CFO scale effectively..."
  },
  ecommerce: { 
    subject: "Boost your DTC conversions", 
    body: "Hey {first_name}, love what {company} is doing! We help brands increase their repeat customer rate by 30% through automated engagement..."
  },
  other: { 
    subject: "A quick question about {company}", 
    body: "Hi {first_name}, I'm interested in learning more about how your team handles outreach. Would you be open to a 5-minute chat?"
  }
};

export const CampaignStep = ({ onNext, onBack, data }: { onNext: (data: any) => void; onBack: () => void; data: any }) => {
  const template = industryTemplates[data.industry || "other"];
  const [subject, setSubject] = useState(data.subject || template.subject);
  const [body, setBody] = useState(data.body || template.body);
  const [score, setScore] = useState(45);

  useEffect(() => {
    // Simple Predictive Scoring Algorithm (Heuristic)
    let s = 40;
    if (subject.includes("{first_name}")) s += 15;
    if (subject.includes("?")) s += 10;
    if (subject.length > 10 && subject.length < 50) s += 10;
    if (body.includes("{company}")) s += 10;
    if (body.length > 100) s += 5;
    if (body.includes("?")) s += 5;
    if (subject.toLowerCase().includes("free") || subject.toLowerCase().includes("winner")) s -= 20;
    
    setScore(Math.min(98, Math.max(10, s)));
  }, [subject, body]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-900">Your First Campaign</h2>
        </div>
        <div className="hidden sm:block">
           <SuccessMeter score={score} />
        </div>
      </div>

      <div className="sm:hidden flex justify-center mb-6">
        <SuccessMeter score={score} />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Subject Line</Label>
          <Input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-12 border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <Label>Message Body</Label>
          <Textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[160px] border-slate-200 font-medium leading-relaxed"
          />
        </div>
      </div>

      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3 items-start">
        <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-indigo-900">AI Recommendation</p>
          <p className="text-xs text-indigo-700 leading-normal">
            Shortening your subject line to under 40 characters typically boosts open rates by 12% in the <strong>{data.industry || "SaaS"}</strong> space.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-slate-100">
        <Button variant="ghost" onClick={onBack} size="lg">Back</Button>
        <Button 
          onClick={() => onNext({ subject, body, successScore: score })}
          size="lg"
          className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
        >
          Review Campaign <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// -------------------------------------------------------------------
// Final Screen: Completion
// -------------------------------------------------------------------
export const CompletionStep = ({ data, onFinish }: { data: any; onFinish: (mode: "send" | "preview") => void }) => {
  useEffect(() => {
    // Launch confetti!
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#6366f1", "#a855f7", "#ec4899"]
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#6366f1", "#a855f7", "#ec4899"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8 py-10"
    >
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
          You're ready to launch 🚀
        </h1>
        <p className="text-slate-500 font-medium">Your campaign is perfectly calibrated.</p>
      </div>

      <div className="max-w-xs mx-auto p-6 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-indigo-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
        <div className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
          {data.successScore || 0}%
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <Sparkles key={i} className={`w-4 h-4 ${i <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="h-14 font-bold border-2"
          onClick={() => onFinish("preview")}
        >
          Preview First
        </Button>
        <Button 
          size="lg" 
          className="h-14 px-12 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200"
          onClick={() => onFinish("send")}
        >
          Send Campaign Now
        </Button>
      </div>
    </motion.div>
  );
};
