import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { 
  X, Upload, FileText, CheckCircle2, 
  AlertCircle, ChevronRight, Loader2, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface LeadImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (count: number) => void;
}

type ImportStep = "upload" | "mapping" | "progress" | "complete";

export default function LeadImportModal({ open, onOpenChange, onImportComplete }: LeadImportModalProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importProgress, setImportProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setHeaders(Object.keys(results.data[0] || {}));
        autoMap(Object.keys(results.data[0] || {}));
        setStep("mapping");
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false 
  });

  const autoMap = (foundHeaders: string[]) => {
    const newMapping: Record<string, string> = {};
    const targetFields = ["name", "email", "company", "role"];
    
    foundHeaders.forEach(h => {
      const lower = h.toLowerCase();
      if (lower.includes("name") || lower.includes("full")) newMapping[h] = "name";
      if (lower.includes("email") || lower.includes("mail")) newMapping[h] = "email";
      if (lower.includes("company") || lower.includes("firm") || lower.includes("business")) newMapping[h] = "company";
      if (lower.includes("role") || lower.includes("title") || lower.includes("position")) newMapping[h] = "role";
    });
    setMapping(newMapping);
  };

  const startImport = async () => {
    setStep("progress");
    
    // Simulate import chunks
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setStep("complete");
    onImportComplete(csvData.length);
    toast.success(`Successfully imported ${csvData.length} leads!`);
  };

  const reset = () => {
    setStep("upload");
    setFileName(null);
    setCsvData([]);
    setHeaders([]);
    setMapping({});
    setImportProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0A0A0A] border-white/5 p-0 overflow-hidden rounded-[2.5rem]">
        <div className="p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black tracking-tighter text-white">Import Leads</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Upload a CSV file to grow your audience
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-[2rem] p-16 text-center cursor-pointer transition-all
                  ${isDragActive ? "border-blue-500 bg-blue-500/5" : "border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02]"}
                `}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Upload className={`w-8 h-8 ${isDragActive ? "text-blue-500" : "text-slate-500"}`} />
                </div>
                <h3 className="text-xl font-black tracking-tighter text-white mb-2">
                  {isDragActive ? "Drop the file here" : "Click or drag CSV file"}
                </h3>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-loose">
                  Ensure your file contains Email and Name columns <br /> Max file size: 50MB
                </p>
              </motion.div>
            )}

            {step === "mapping" && (
              <motion.div 
                key="mapping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm font-black text-white">{fileName}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{csvData.length} records found</div>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setStep("upload")} className="text-[10px] font-black uppercase text-slate-500 hover:text-white">Change File</Button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Map your columns</h4>
                  <div className="grid gap-3">
                    {["name", "email", "company", "role"].map(field => (
                      <div key={field} className="flex items-center justify-between p-4 bg-[#111111] rounded-2xl border border-white/5">
                        <span className="text-sm font-black text-white capitalize">{field}</span>
                        <select 
                          value={Object.keys(mapping).find(key => mapping[key] === field) || ""}
                          onChange={(e) => {
                            const newMapping = { ...mapping };
                            Object.keys(newMapping).forEach(key => {
                              if (newMapping[key] === field) delete newMapping[key];
                            });
                            newMapping[e.target.value] = field;
                            setMapping(newMapping);
                          }}
                          className="bg-white/5 border-none rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:ring-1 ring-blue-500/50"
                        >
                          <option value="">Select Column</option>
                          {headers.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={startImport}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/20 text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  Confirm Import
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === "progress" && (
              <motion.div 
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 space-y-8 text-center"
              >
                <div className="relative w-24 h-24 mx-auto">
                  <Loader2 className="w-24 h-24 text-blue-600 animate-spin opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black tracking-tighter text-white">{importProgress}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter text-white uppercase">Syncing to Cloud</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Optimizing profiles and cleaning invalid records...</p>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600"
                    animate={{ width: `${importProgress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 space-y-8 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter text-white uppercase">Mission Success</h3>
                  <p className="text-sm font-bold text-slate-400 capitalize">{csvData.length} leads are now ready for outreach</p>
                </div>
                <Button 
                  onClick={reset}
                  className="w-full h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  Back to Leads
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
