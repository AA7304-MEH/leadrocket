import { useState } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import BackToTop from "../common/BackToTop";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu, X } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden text-white">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-white/5">
                        <Sidebar />
                    </div>
                </div>
            )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">
            {/* Top Header */}
            <header className="h-20 flex items-center justify-between px-6 lg:px-8 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-400 hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>

                <div className="flex-1 hidden sm:block">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        LeadRockets 4.0 <span className="text-white/20 ml-2">Production</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4 lg:gap-6">
                    <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white transition-colors group">
                        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:inline">Search</span>
                    </button>

                    <Button variant="ghost" size="icon" className="relative group text-slate-400 hover:bg-white/5">
                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Button>

                    <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

                    <Link to="/growth" className="hidden sm:block">
                        <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                            Refer Friends
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth pb-32 md:pb-8">
                <div className="max-w-[1600px] mx-auto">
                    {children || <Outlet />}
                </div>
            </main>
        </div>

        {/* Mobile Navigation & Helpers */}
        <BottomNav />
        <BackToTop />
        </div>
    );
};

export default DashboardLayout;
