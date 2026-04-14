import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Search, Filter, Star, Users, ExternalLink, 
  Sparkles, Check, ChevronRight, Plus, Eye,
  ArrowRight, Heart, Share2, MessageSquare,
  Target, Calendar
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
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

// --- Mock Data ---
const featuredTemplates = [
  {
    id: 1,
    name: "Enterprise SaaS Outbound",
    author: "Alex Rivera",
    industry: "SaaS",
    score: 95,
    openRate: 62,
    price: "Free",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "LinkedIn Growth Sequence",
    author: "Sarah Chen",
    industry: "Marketing",
    score: 88,
    openRate: 54,
    price: "$29",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "The VC Pitch Engine",
    author: "Jordan Smith",
    industry: "Finance",
    score: 92,
    openRate: 48,
    price: "$9",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60"
  }
];

const templates = [
  { id: 4, name: "Cold Email v1", author: "JD", industry: "SaaS", type: "Cold", score: 82, openRate: 38, price: "Free", rating: 4.8, users: 1240 },
  { id: 5, name: "Re-engagement Loop", author: "ML", industry: "E-commerce", type: "Nurture", score: 91, openRate: 45, price: "$19", rating: 4.9, users: 850 },
  { id: 6, name: "The 'Quick Question'", author: "BK", industry: "Any", type: "Cold", score: 78, openRate: 32, price: "Free", rating: 4.5, users: 4300 },
  { id: 7, name: "After-Webinar Followup", author: "AI", industry: "Events", type: "Follow-up", score: 94, openRate: 58, price: "$29", rating: 5.0, users: 210 },
  { id: 8, name: "Product Update Viral", author: "RS", industry: "SaaS", type: "Viral", score: 87, openRate: 40, price: "$9", rating: 4.7, users: 1560 },
  { id: 9, name: "The Referral Request", author: "AL", industry: "Agency", type: "Growth", score: 89, openRate: 35, price: "Free", rating: 4.6, users: 3200 },
];

export default function Marketplace() {
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setItems(data);
    } else {
      // Fallback to mock if table is empty/doesn't exist
      setItems(templates); 
    }
    setIsLoading(false);
  };

  const filteredItems = items.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Hero Section - Featured Carousel */}
        <section className="relative h-[400px] rounded-[2.5rem] overflow-hidden bg-[#111111] border border-white/5">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFeatured}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img 
                src={featuredTemplates[activeFeatured].image} 
                className="w-full h-full object-cover opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Featured"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
              
              <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-2xl gap-6">
                <div className="flex gap-2">
                  <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Template</Badge>
                  <Badge variant="outline" className="text-white border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {featuredTemplates[activeFeatured].industry}
                  </Badge>
                </div>
                <h2 className="text-6xl font-black tracking-tighter text-white leading-none">
                  {featuredTemplates[activeFeatured].name}
                </h2>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Trust Score</span>
                    <span className="text-2xl font-black text-emerald-500">{featuredTemplates[activeFeatured].score}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg. Open Rate</span>
                    <span className="text-2xl font-black text-blue-500">↑ {featuredTemplates[activeFeatured].openRate}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Author</span>
                    <span className="text-xl font-black text-white">{featuredTemplates[activeFeatured].author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30">
                    Use Now — {featuredTemplates[activeFeatured].price}
                  </Button>
                  <Button variant="ghost" className="text-white h-14 px-8 rounded-2xl text-[12px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10">
                    Preview Template
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Nav */}
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

        {/* Browser & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#111111] p-4 rounded-3xl border border-white/5 sticky top-4 z-40 backdrop-blur-3xl shadow-2xl">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates for SaaS, Real Estate, E-commerce..."
              className="bg-transparent border-none w-full pl-12 h-14 text-lg font-bold tracking-tight focus-visible:ring-0 placeholder:text-slate-700"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] bg-white/5 border-none h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="free">
              <SelectTrigger className="w-[140px] bg-white/5 border-none h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="paid">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setPublishOpen(true)}
              className="bg-blue-600 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <PublishTemplateModal 
          open={publishOpen} 
          onOpenChange={setPublishOpen} 
        />

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[400px] rounded-[2rem] border border-white/5" />
              ))}
            </>
          ) : filteredItems.length > 0 ? (
            <>
              {filteredItems.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-[#111111] border-white/5 rounded-[2rem] group hover:border-blue-600/30 transition-all duration-500 overflow-hidden relative h-full">
                    <CardHeader className="p-8 pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                            {t.author?.charAt(0) || 'L'}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.author || 'LeadRockets'}</span>
                        </div>
                        <Badge className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none",
                          (t.price === "Free" || t.price === 0) ? "bg-emerald-600/10 text-emerald-500" : "bg-blue-600 text-white"
                        )}>
                          {typeof t.price === 'number' ? `$${t.price}` : t.price || 'Free'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-black text-white tracking-tight group-hover:text-blue-500 transition-colors">
                        {t.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 text-slate-500">{t.industry || 'General'}</Badge>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 text-slate-500">{t.type || 'Campaign'}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/3 p-4 rounded-2xl flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">AI Score</span>
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            <span className="text-lg font-black text-emerald-500">{t.score || 85}</span>
                          </div>
                        </div>
                        <div className="bg-white/3 p-4 rounded-2xl flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Avg Open</span>
                          <span className="text-lg font-black text-blue-500">{t.openRate || 40}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-black">{t.rating || 4.5}</span>
                          <span className="text-xs text-slate-700">({t.users || 0})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full bg-white/5 hover:bg-white/10 text-slate-400"
                            onClick={() => setSelectedTemplate(t)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button className="rounded-xl bg-white/5 group-hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest h-10 px-6 transition-all">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="col-span-full">
              <EmptyState 
                icon={Search}
                title="No templates found"
                description="We couldn't find any templates matching your search criteria. Try different keywords or be the first to publish one!"
                ctaText="Publish Template"
                onCtaClick={() => setPublishOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Template Preview Modal */}
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-5xl bg-[#0A0A0A] border-white/10 p-0 overflow-hidden rounded-[3rem]">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[80vh]">
              {/* Left Side: Performance Stats */}
              <div className="bg-[#111111] p-10 space-y-10 border-r border-white/5 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Template Logic</h3>
                  <div className="space-y-3">
                    <StatRow label="Author Rating" value="4.9/5" icon={<Star className="w-3 h-3 text-amber-500" />} />
                    <StatRow label="Industry Fit" value={selectedTemplate?.industry || 'All'} icon={<Target className="w-3 h-3 text-blue-500" />} />
                    <StatRow label="Sequence Type" value={selectedTemplate?.type || 'Outbound'} icon={<ArrowRight className="w-3 h-3 text-purple-500" />} />
                    <StatRow label="Last Updated" value="2d ago" icon={<Calendar className="w-3 h-3 text-slate-500" />} />
                  </div>
                </div>

                <div className="bg-blue-600/5 border border-blue-600/10 p-6 rounded-3xl space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Recommendation
                  </span>
                  <p className="text-xs font-bold leading-relaxed text-slate-400 capitalize italic">
                    "This template performs best when sent on Tuesday mornings to Decision Makers in Tech industries."
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Reviews</h3>
                  {[1,2].map(r => (
                    <div key={r} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-white/5" />
                        <span className="text-[10px] font-black text-slate-400 tracking-tight">Growth Lead @ SaaS Co.</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 italic">"Boosted our cold outbound reply rate by 22% in the first week. Highly recommended."</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Preview & Actions */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="p-10 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-white">{selectedTemplate?.name}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">Full Sequence Preview</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-500"><Heart className="w-4 h-4" /></Button>
                    <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-500"><Share2 className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto bg-black/40">
                  <div className="space-y-8 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Subject: Quick question about LeadRockets</span>
                      <div className="p-10 bg-[#111111] border border-white/5 rounded-3xl text-sm leading-relaxed text-slate-300 font-bold">
                        Hi [First Name],<br/><br/>
                        I noticed your team was exploring ways to scale [Campaign Name] and wanted to share how we recently helped [Competitor] achieve 40% higher conversion rates.<br/><br/>
                        Do you have 5 minutes this Thursday?<br/><br/>
                        Best,<br/>
                        [Your Name]
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-[#111111]/50 backdrop-blur-xl border-t border-white/5 grid grid-cols-2 gap-4">
                  <Button className="h-16 rounded-2xl bg-white text-black font-black uppercase tracking-wider text-[12px] hover:bg-slate-200 shadow-2xl">
                    Import to Sequence
                  </Button>
                  <Button className="h-16 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-wider text-[12px] hover:bg-blue-700 shadow-2xl shadow-blue-600/20 gap-2">
                    <Sparkles className="w-4 h-4" />
                    Remix with AI
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function StatRow({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
      </div>
      <span className="text-xs font-black text-white">{value}</span>
    </div>
  );
}