import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, PlayCircle, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const HeroSection = () => {
    const [showDemo, setShowDemo] = useState(false);

    return (
        <>
            <div className="relative overflow-hidden bg-white pt-16 lg:pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center">
                        <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                                Stop Switching Tools. <br />
                                <span className="text-primary">Send Cold Emails That Actually Convert.</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                The all-in-one AI platform for founders to find, personalize, and outreach—built for speed, not just sales teams.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6 sm:justify-center lg:justify-start">
                                <Link to="/register">
                                    <Button size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary-dark font-bold shadow-lg shadow-primary/25">
                                        Start 30-Day Trial
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => setShowDemo(true)}
                                    className="font-semibold leading-6 text-gray-900 flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <PlayCircle className="h-5 w-5" />
                                    Watch Demo
                                </button>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-4 sm:justify-center lg:justify-start">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>14-day free trial</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>No credit card required</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-16 lg:col-span-6 lg:mt-0">
                            {/* Dashboard Preview SVG */}
                            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                <div className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                                    {/* Dashboard Illustration */}
                                    <svg viewBox="0 0 800 500" className="w-full h-auto">
                                        {/* Background */}
                                        <rect fill="#f8fafc" width="800" height="500" />

                                        {/* Sidebar */}
                                        <rect fill="#1e293b" width="60" height="500" />
                                        <circle cx="30" cy="30" r="12" fill="#3b82f6" />
                                        <rect x="18" y="70" width="24" height="4" rx="2" fill="#475569" />
                                        <rect x="18" y="90" width="24" height="4" rx="2" fill="#475569" />
                                        <rect x="18" y="110" width="24" height="4" rx="2" fill="#3b82f6" />
                                        <rect x="18" y="130" width="24" height="4" rx="2" fill="#475569" />
                                        <rect x="18" y="150" width="24" height="4" rx="2" fill="#475569" />

                                        {/* Header */}
                                        <rect x="60" y="0" width="740" height="50" fill="#ffffff" />
                                        <text x="80" y="32" fontFamily="system-ui" fontSize="16" fontWeight="600" fill="#1e293b">Dashboard</text>
                                        <circle cx="750" cy="25" r="16" fill="#e0e7ff" />

                                        {/* Metrics Cards */}
                                        <g>
                                            <rect x="80" y="70" width="160" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                            <text x="95" y="95" fontFamily="system-ui" fontSize="11" fill="#64748b">Emails Sent</text>
                                            <text x="95" y="125" fontFamily="system-ui" fontSize="24" fontWeight="700" fill="#1e293b">2,450</text>
                                            <text x="165" y="125" fontFamily="system-ui" fontSize="11" fill="#22c55e">↑ 12%</text>
                                        </g>
                                        <g>
                                            <rect x="260" y="70" width="160" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                            <text x="275" y="95" fontFamily="system-ui" fontSize="11" fill="#64748b">Open Rate</text>
                                            <text x="275" y="125" fontFamily="system-ui" fontSize="24" fontWeight="700" fill="#1e293b">45.2%</text>
                                            <text x="350" y="125" fontFamily="system-ui" fontSize="11" fill="#22c55e">↑ 8%</text>
                                        </g>
                                        <g>
                                            <rect x="440" y="70" width="160" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                            <text x="455" y="95" fontFamily="system-ui" fontSize="11" fill="#64748b">Reply Rate</text>
                                            <text x="455" y="125" fontFamily="system-ui" fontSize="24" fontWeight="700" fill="#1e293b">12.8%</text>
                                            <text x="530" y="125" fontFamily="system-ui" fontSize="11" fill="#22c55e">↑ 5%</text>
                                        </g>
                                        <g>
                                            <rect x="620" y="70" width="160" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                            <text x="635" y="95" fontFamily="system-ui" fontSize="11" fill="#64748b">Meetings</text>
                                            <text x="635" y="125" fontFamily="system-ui" fontSize="24" fontWeight="700" fill="#1e293b">38</text>
                                            <text x="680" y="125" fontFamily="system-ui" fontSize="11" fill="#22c55e">↑ 15%</text>
                                        </g>

                                        {/* Chart Area */}
                                        <rect x="80" y="170" width="450" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                        <text x="100" y="200" fontFamily="system-ui" fontSize="14" fontWeight="600" fill="#1e293b">Campaign Performance</text>

                                        {/* Chart Grid Lines */}
                                        <line x1="100" y1="240" x2="510" y2="240" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="100" y1="280" x2="510" y2="280" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="100" y1="320" x2="510" y2="320" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="100" y1="360" x2="510" y2="360" stroke="#f1f5f9" strokeWidth="1" />

                                        {/* Area Chart */}
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M100 340 L150 300 L200 320 L250 280 L300 260 L350 240 L400 250 L450 220 L500 230 L500 370 L100 370 Z" fill="url(#chartGradient)" />
                                        <path d="M100 340 L150 300 L200 320 L250 280 L300 260 L350 240 L400 250 L450 220 L500 230" fill="none" stroke="#3b82f6" strokeWidth="2" />

                                        {/* Second Line */}
                                        <path d="M100 360 L150 340 L200 350 L250 320 L300 310 L350 290 L400 300 L450 280 L500 290" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4" />

                                        {/* Right Panel - Activity */}
                                        <rect x="550" y="170" width="230" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                        <text x="570" y="200" fontFamily="system-ui" fontSize="14" fontWeight="600" fill="#1e293b">Recent Activity</text>

                                        {/* Activity Items */}
                                        <circle cx="580" cy="230" r="8" fill="#dbeafe" />
                                        <rect x="600" y="225" width="120" height="8" rx="2" fill="#e2e8f0" />
                                        <rect x="600" y="238" width="80" height="6" rx="2" fill="#f1f5f9" />

                                        <circle cx="580" cy="270" r="8" fill="#dcfce7" />
                                        <rect x="600" y="265" width="100" height="8" rx="2" fill="#e2e8f0" />
                                        <rect x="600" y="278" width="60" height="6" rx="2" fill="#f1f5f9" />

                                        <circle cx="580" cy="310" r="8" fill="#fce7f3" />
                                        <rect x="600" y="305" width="140" height="8" rx="2" fill="#e2e8f0" />
                                        <rect x="600" y="318" width="70" height="6" rx="2" fill="#f1f5f9" />

                                        <circle cx="580" cy="350" r="8" fill="#fef3c7" />
                                        <rect x="600" y="345" width="90" height="8" rx="2" fill="#e2e8f0" />
                                        <rect x="600" y="358" width="50" height="6" rx="2" fill="#f1f5f9" />

                                        {/* Bottom Stats */}
                                        <rect x="80" y="410" width="700" height="70" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                        <text x="100" y="440" fontFamily="system-ui" fontSize="12" fill="#64748b">Active Campaigns</text>
                                        <text x="100" y="460" fontFamily="system-ui" fontSize="18" fontWeight="600" fill="#1e293b">3</text>
                                        <text x="250" y="440" fontFamily="system-ui" fontSize="12" fill="#64748b">Leads in Pipeline</text>
                                        <text x="250" y="460" fontFamily="system-ui" fontSize="18" fontWeight="600" fill="#1e293b">1,245</text>
                                        <text x="420" y="440" fontFamily="system-ui" fontSize="12" fill="#64748b">AI Credits</text>
                                        <text x="420" y="460" fontFamily="system-ui" fontSize="18" fontWeight="600" fill="#1e293b">45/100</text>
                                        <text x="570" y="440" fontFamily="system-ui" fontSize="12" fill="#64748b">Next Follow-up</text>
                                        <text x="570" y="460" fontFamily="system-ui" fontSize="18" fontWeight="600" fill="#1e293b">2:30 PM</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Modal */}
            <Dialog open={showDemo} onOpenChange={setShowDemo}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">LeadRockets Demo</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                        {/* Replace with actual video embed */}
                        <div className="text-center p-8">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                <PlayCircle className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Product Demo
                            </h3>
                            <p className="text-gray-400 mb-6">
                                See how LeadRockets helps you 10x your cold email outreach
                            </p>
                            <div className="grid grid-cols-3 gap-4 mt-8 text-left">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-primary mb-1">1</div>
                                    <h4 className="font-medium text-white mb-1">Import Leads</h4>
                                    <p className="text-xs text-gray-400">Upload CSV or connect LinkedIn</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-primary mb-1">2</div>
                                    <h4 className="font-medium text-white mb-1">AI Personalize</h4>
                                    <p className="text-xs text-gray-400">One-click personalized emails</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-primary mb-1">3</div>
                                    <h4 className="font-medium text-white mb-1">Launch & Track</h4>
                                    <p className="text-xs text-gray-400">Monitor opens, clicks, replies</p>
                                </div>
                            </div>
                            <Button
                                className="mt-8 bg-primary hover:bg-primary/90"
                                onClick={() => {
                                    setShowDemo(false);
                                    window.location.href = '/register';
                                }}
                            >
                                Start Free Trial
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HeroSection;
