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
import { useLeads } from "@/hooks/useLeads";

interface LeadImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportStep = "upload" | "mapping" | "progress" | "complete";

export default function LeadImportModal({ open, onOpenChange }: LeadImportModalProps) {
  const { bulkImport } = useLeads();
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
        if (results.data.length === 0) {
          toast.error("File is empty or invalid format");
          return;
        }
        setCsvData(results.data);
        const foundHeaders = Object.keys(results.data[0] || {});
        setHeaders(foundHeaders);
        autoMap(foundHeaders);
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
      const lower = h.toLowerCase().trim();
      if (lower.includes("name") || lower.includes("full") || lower === "name") newMapping[h] = "name";
      if (lower.includes("email") || lower.includes("mail") || lower === "email") newMapping[h] = "email";
      if (lower.includes("company") || lower.includes("firm") || lower.includes("business") || lower === "company") newMapping[h] = "company";
      if (lower.includes("role") || lower.includes("title") || lower.includes("position") || lower === "role") newMapping[h] = "role";
    });
    setMapping(newMapping);
  };

  const startImport = async () => {
    // Correctly check if email and name are mapped
    const emailHeader = Object.keys(mapping).find(key => mapping[key] === 'email');
    const nameHeader = Object.keys(mapping).find(key => mapping[key] === 'name');

    if (!emailHeader) {
      toast.error("Email column must be mapped");
      return;
    }

    setStep("progress");
    setImportProgress(20);

    try {
      const mappedData = csvData.map(row => ({
        name: row[nameHeader || ''] || 'Unknown',
        email: row[emailHeader] || '',
        company: row[Object.keys(mapping).find(key => mapping[key] === 'company') || ''] || '',
        role: row[Object.keys(mapping).find(key => mapping[key] === 'role') || ''] || '',
        status: 'active' as const,
        source: 'import'
      })).filter(lead => lead.email && lead.email.includes('@'));

      setImportProgress(50);

      await bulkImport(mappedData);

      setImportProgress(100);
      setStep("complete");
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`);
      setStep("upload");
    }
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
      <DialogContent className="max-w-2xl bg-[#0A0A0A] border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <div className="p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black tracking-tighter text-white">Import Leads</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Upload a CSV file to grow your audience with AI precision
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
                  {isDragActive ? "Drop it like it's hot" : "Ignite your lead list"}
                </h3>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-loose text-center">
                  Drag & drop CSV or click to browse <br /> Max file size: 50MB
                </p>
              </motion.div>
            )}

            {step === "mapping" && (
              <motion.div 
                key="mapping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{fileName}</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{csvData.length} records detected</div>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setStep("upload")} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white bg-white/5 rounded-xl">Change</Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Column Mapping</h4>
                    <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">AI Auto-Mapped</span>
                  </div>
                  <div className="grid gap-3">
                    {["name", "email", "company", "role"].map(field => (
                      <div key={field} className="flex items-center justify-between p-5 bg-[#111111] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            Object.values(mapping).includes(field) ? "bg-emerald-500" : "bg-slate-700"
                          )} />
                          <span className="text-xs font-black text-white uppercase tracking-widest">{field}</span>
                        </div>
                        <select 
                          value={Object.keys(mapping).find(key => mapping[key] === field) || ""}
                          onChange={(e) => {
                            const newMapping = { ...mapping };
                            // Remove existing mapping for this field
                            Object.keys(newMapping).forEach(key => {
                              if (newMapping[key] === field) delete newMapping[key];
                            });
                            // Add new mapping
                            if (e.target.value) newMapping[e.target.value] = field;
                            setMapping(newMapping);
                          }}
                          className="bg-white/5 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-2 ring-blue-500/50 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0A0A0A]">Ignore Field</option>
                          {headers.map(h => <option key={h} value={h} className="bg-[#0A0A0A]">{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={startImport}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl shadow-blue-600/20 text-xs font-black uppercase tracking-[0.2em]"
                >
                  Initiate Sync
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === "progress" && (
              <motion.div 
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 space-y-10 text-center"
              >
                <div className="relative w-32 h-32 mx-auto">
                   <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                   <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                   />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black tracking-tighter text-white">{importProgress}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tighter text-white uppercase">Atmospheric Sync</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mx-auto max-w-[280px]">Optimizing profiles and cleaning invalid records for maximum deliverability...</p>
                </div>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 space-y-10 text-center"
              >
                <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 ring-8 ring-emerald-500/5">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black tracking-tighter text-white uppercase">Mission Success</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{csvData.length} leads are locked and loaded for outreach</p>
                </div>
                <Button 
                  onClick={reset}
                  className="w-full h-16 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-white/5"
                >
                  Return to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
