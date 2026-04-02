
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  WelcomeStep, 
  CompanyStep, 
  LeadsStep, 
  CampaignStep, 
  CompletionStep 
} from "./OnboardingSteps";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

const OnboardingWizardV2 = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: user?.name?.split(" ")[0] || "there",
    company: "",
    industry: "",
    audience: "",
    leads: [],
    subject: "",
    body: "",
    successScore: 0
  });

  const steps = [
    { id: 1, title: "Welcome", component: WelcomeStep },
    { id: 2, title: "Company", component: CompanyStep },
    { id: 3, title: "Leads", component: LeadsStep },
    { id: 4, title: "Campaign", component: CampaignStep },
    { id: 5, title: "Complete", component: CompletionStep }
  ];

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinish = (mode: "send" | "preview") => {
    console.log("Finishing onboarding with mode:", mode, formData);
    // Redirect to dashboard or campaign preview
    window.location.href = mode === "send" ? "/dashboard?launched=true" : "/campaigns/preview";
  };

  const progress = useMemo(() => {
    return (Math.min(currentStep, 4) / 4) * 100;
  }, [currentStep]);

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sticky Progress Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">LeadRockets</span>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="flex justify-between mb-1.5 px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Setup Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-slate-100" />
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
            {steps.slice(0, 4).map((s, i) => (
              <div 
                key={s.id} 
                className={`flex items-center gap-2 transition-colors duration-300 ${currentStep === s.id ? "text-indigo-600" : currentStep > s.id ? "text-emerald-500" : ""}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${currentStep >= s.id ? "border-current" : "border-slate-200"}`}>
                  {i + 1}
                </div>
                <span className={currentStep === s.id ? "opacity-100" : "opacity-40"}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full max-w-3xl mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden"
          >
            <div className="p-8 sm:p-12">
              <CurrentStepComponent 
                onNext={handleNext} 
                onBack={handleBack} 
                onFinish={handleFinish}
                data={formData} 
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Support Notice */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-slate-400 text-xs mt-12 font-medium"
        >
          Need help? <a href="#" className="text-indigo-500 hover:underline">Chat with a growth expert</a>
        </motion.p>
      </div>
    </div>
  );
};

export default OnboardingWizardV2;
