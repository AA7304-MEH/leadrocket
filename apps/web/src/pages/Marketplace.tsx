import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Search, Filter, Star, Users, ExternalLink, 
  Sparkles, Check, ChevronRight, Plus, Eye,
  ArrowRight, Heart, Share2, MessageSquare,
  Target, Calendar, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import PublishTemplateModal from "@/components/marketplace/PublishTemplateModal";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const navigate = useNavigate();
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [industry, setIndustry] = useState("all");
  const [type, setType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("popular");
  const [publishOpen, setPublishOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ['templates', industry, type, priceRange, sort, searchQuery],
    queryFn: async () => {
      const res = await marketplaceApi.getTemplates({
        industry: industry === 'all' ? undefined : industry,
        type: type === 'all' ? undefined : type,
        price: priceRange === 'all' ? undefined : priceRange,
        sort,
        search: searchQuery
      });
      return res.data.data;
    }
  });

  const handleUseTemplate = async (template: any) => {
    try {
      if (template.price > 0) {
        // Trigger purchase flow
        const res = await marketplaceApi.purchaseTemplate(template.id);
        const { orderId, amount } = res.data.data;
        
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency: "INR",
          name: "LeadRockets",
          description: `Purchase ${template.name}`,
          order_id: orderId,
          handler: async (response: any) => {
            toast.success("Purchase successful! 🎉");
            await marketplaceApi.useTemplate(template.id);
            navigate(`/campaign-builder?templateId=${template.id}`);
          },
          prefill: {
            name: "User Name",
            email: "user@example.com",
          },
          theme: { color: "#3B82F6" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        await marketplaceApi.useTemplate(template.id);
        navigate(`/campaign-builder?templateId=${template.id}`);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Something went wrong");
    }
  };

  const templates = templatesData || [];
  const featuredTemplates = templates.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20 px-4 pt-8">
        {/* Featured Section */}
        {featuredTemplates.length > 0 && (
          <section className="relative h-[450px] rounded-[2.5rem] overflow-hidden bg-[#111111] border border-white/5">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeFeatured}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 p-12 flex flex-col justify-center max-w-3xl gap-6"
              >
                <div className="flex gap-2">
                  <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Template</Badge>
                  <Badge variant="outline" className="text-white border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {featuredTemplates[activeFeatured].industry}
                  </Badge>
                </div>
                <h2 className="text-6xl font-black tracking-tighter text-white leading-tight">
                  {featuredTemplates[activeFeatured].name}
                </h2>
                <div className="flex items-center gap-8">
                  <StatItem label="AI Score" value={featuredTemplates[activeFeatured].aiScore || 85} color="text-emerald-500" />
                  <StatItem label="Avg. Open" value={`${featuredTemplates[activeFeatured].avgOpenRate || 45}%`} color="text-blue-500" />
                  <StatItem label="Author" value={featuredTemplates[activeFeatured].author.name} color="text-white" />
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Button 
                    onClick={() => handleUseTemplate(featuredTemplates[activeFeatured])}
                    className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30"
                  >
                    Use Now — {featuredTemplates[activeFeatured].price === 0 ? "Free" : `₹${featuredTemplates[activeFeatured].price}`}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-10 right-12 flex gap-3">
              {featuredTemplates.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveFeatured(i)}
                  className={`w-12 h-1 rounded-full transition-all duration-300 ${activeFeatured === i ? 'bg-blue-600' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#111111] p-4 rounded-3xl border border-white/5 sticky top-4 z-40 backdrop-blur-3xl shadow-2xl">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="bg-transparent border-none w-full pl-12 h-14 text-lg font-bold tracking-tight focus-visible:ring-0 placeholder:text-slate-700 text-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[140px] bg-white/5 border-none h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[140px] bg-white/5 border-none h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setPublishOpen(true)} className="bg-blue-600 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-8">
              Publish Template
            </Button>
          </div>
        </div>

        <PublishTemplateModal open={publishOpen} onOpenChange={setPublishOpen} />

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((t: any, i: number) => (
            <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-[#111111] border-white/5 rounded-[2.5rem] group hover:border-blue-600/30 transition-all duration-500 overflow-hidden relative flex flex-col h-full">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">
                            {t.author.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.author.name}</span>
                    </div>
                    <Badge className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none",
                        t.price === 0 ? "bg-emerald-600/10 text-emerald-500" : "bg-blue-600 text-white"
                    )}>
                        {t.price === 0 ? "Free" : `₹${t.price}`}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-black text-white tracking-tight group-hover:text-blue-500 transition-colors">
                    {t.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6 flex-1 flex flex-col text-white">
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-[9px] font-black border-white/10 text-slate-500">{t.industry}</Badge>
                        <Badge variant="outline" className="text-[9px] font-black border-white/10 text-slate-500">{t.campaignType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/3 p-4 rounded-2xl">
                            <span className="text-[8px] font-black uppercase text-slate-600 block mb-1">AI Score</span>
                            <span className="text-xl font-black text-emerald-500">{t.aiScore || 85}</span>
                        </div>
                        <div className="bg-white/3 p-4 rounded-2xl">
                            <span className="text-[8px] font-black uppercase text-slate-600 block mb-1">Avg Open</span>
                            <span className="text-xl font-black text-blue-500">{t.avgOpenRate || 0}%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-6">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-white">{t.rating}</span>
                            <span className="text-xs text-slate-500">({t.useCount})</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedTemplate(t)} className="rounded-full bg-white/5 hover:bg-white/10 text-slate-400">
                                <Eye className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleUseTemplate(t)} className="rounded-xl bg-white/5 group-hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest h-10 px-6">
                                Use Template
                            </Button>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl bg-[#0A0A0A] border-white/10 p-0 overflow-hidden rounded-[3rem]">
            <div className="p-12 space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter">{selectedTemplate?.name}</h2>
                        <p className="text-slate-500 font-medium mt-2">{selectedTemplate?.description}</p>
                    </div>
                    <Badge className="bg-blue-600 text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-widest">
                        {selectedTemplate?.price === 0 ? "Free" : `₹${selectedTemplate?.price}`}
                    </Badge>
                </div>
                <div className="p-8 bg-[#111111] border border-white/5 rounded-3xl space-y-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-600">Subject Line</span>
                        <p className="text-white font-bold">{selectedTemplate?.subjectLine}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-600">Email Body</span>
                        <div className="text-slate-300 text-sm whitespace-pre-wrap">{selectedTemplate?.body}</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => handleUseTemplate(selectedTemplate)} className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest">
                        Import Template
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="h-14 rounded-2xl border-white/5 text-slate-500">
                        Close Preview
                    </Button>
                </div>
            </div>
          </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function StatItem({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
            <span className={cn("text-2xl font-black", color)}>{value}</span>
        </div>
    );
}