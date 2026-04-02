
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0A0A0A] text-white">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden text-white">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-white/5">
                        <Sidebar />
                    </div>
                </div>
            )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">
            {/* Top Header - Refined Dark */}
            <header className="h-20 flex items-center justify-between px-8 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-400 hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>

                {/* Left Side Header */}
                <div className="flex-1 hidden md:block">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Dashboard</h2>
                </div>

                {/* Right Actions - Premium & Clean */}
                <div className="flex items-center gap-6">
                    {/* Search - Subtle */}
                    <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white transition-colors group">
                        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:inline">Search</span>
                    </button>

                    <Button variant="ghost" size="icon" className="relative group text-slate-400 hover:bg-white/5">
                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-4 ring-[#0A0A0A]" />
                    </Button>

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <Link to="/growth">
                        <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                            Refer Friends
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
        </div>
    );
};

export default DashboardLayout;
