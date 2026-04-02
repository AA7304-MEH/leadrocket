import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Linkedin, Twitter, Download, X, Sparkles, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface ShareWinModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignName: string;
    score: number;
}

const ShareWinModal: React.FC<ShareWinModalProps> = ({ isOpen, onClose, campaignName, score }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: '#0A0A0A',
            scale: 2
        });
        const link = document.createElement('a');
        link.download = `leadrockets-score-${score}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success("Card downloaded! 📸");
    };

    const handleShare = (platform: string) => {
        const text = `My campaign "${campaignName}" just scored ${score}/100 on LeadRockets AI! 🚀 Ready to dominate Q4.`;
        const url = window.location.origin;
        
        let shareUrl = '';
        if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        } else if (platform === 'linkedin') {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        }
        
        window.open(shareUrl, '_blank');
        toast.success(`Opening ${platform}...`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-[#0A0A0A] border-white/5 p-0 overflow-hidden outline-none">
                <div className="relative p-12">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full -z-10" />
                    
                    <div className="flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-600/40"
                        >
                            <Trophy className="w-10 h-10 text-white" />
                        </motion.div>
                        
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Legendary Score!</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Your campaign is in the top 1% of all outreach</p>
                        </div>

                        {/* Shareable Card Area */}
                        <div ref={cardRef} className="relative w-full aspect-[1.91/1] rounded-[32px] bg-[#0F0F0F] border-2 border-white/10 p-10 text-left overflow-hidden shadow-2xl">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Campaign Verified</div>
                                        <h3 className="text-2xl font-black tracking-tighter text-white truncate max-w-[300px]">{campaignName}</h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Score</div>
                                        <div className="text-5xl font-black text-white leading-none tracking-tighter">{score}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex gap-8">
                                        <div className="space-y-1">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-slate-600">Open Rate Est.</div>
                                            <div className="text-xl font-black text-emerald-500">42.8%</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-slate-600">Reply Est.</div>
                                            <div className="text-xl font-black text-blue-500">12.5%</div>
                                        </div>
                                    </div>
                                    <div className="h-8 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest text-white uppercase">LeadRockets AI</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card Background Polish */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 blur-[80px] rounded-full" />
                            <div className="absolute bottom-0 left-0 w-2 h-full bg-blue-600" />
                        </div>

                        <div className="flex gap-4 w-full pt-4">
                            <Button 
                                className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-widest text-xs gap-2"
                                onClick={() => handleShare('linkedin')}
                            >
                                <Linkedin className="w-4 h-4 fill-black" />
                                Share on LinkedIn
                            </Button>
                            <Button 
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-xs gap-2"
                                onClick={handleDownload}
                            >
                                <Download className="w-4 h-4" />
                                Save Image
                            </Button>
                            <Button 
                                size="icon"
                                variant="ghost"
                                className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5"
                                onClick={() => handleShare('twitter')}
                            >
                                <Twitter className="w-5 h-5 fill-white" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareWinModal;
