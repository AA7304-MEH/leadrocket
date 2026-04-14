
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Send,
    Users,
    Sparkles,
    Rocket,
    BarChart3,
    Store,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    Zap
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/campaigns", icon: Send },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "AI Studio", href: "/campaigns/new", icon: Sparkles },
    { name: "Growth", href: "/growth", icon: Rocket },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-[#080808] text-slate-400 border-r border-white/5 transition-all duration-500 ease-in-out z-40 relative group shadow-2xl shadow-black",
                collapsed ? "w-24" : "w-[280px]",
                className
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-24 px-8">
                <Link to="/" className="flex items-center gap-4 group/logo">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20 group-hover/logo:rotate-[10deg] transition-all duration-500">
                        <Zap className="w-7 h-7 text-white fill-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">LeadRockets</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                <div className="px-4 mb-6">
                    {!collapsed && (
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/50">Core Infrastructure</p>
                    )}
                </div>
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/5 text-white shadow-2xl border border-white/5"
                                    : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-blue-500" : "text-slate-600 group-hover:text-slate-300"
                            )} />
                            {!collapsed && (
                                <span className="flex-1 truncate">{item.name}</span>
                            )}
                            {isActive && (
                                <motion.div 
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" 
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-6 border-t border-white/5">
                <div className={cn(
                    "flex bg-white/[0.02] rounded-[2rem] border border-white/5 transition-all p-3 items-center group/profile cursor-pointer hover:bg-white/[0.05]",
                    collapsed ? "justify-center" : "gap-4"
                )}>
                    <Avatar className="h-10 w-10 border-2 border-white/5 shadow-2xl overflow-hidden ring-4 ring-blue-600/10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs uppercase">
                            {user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate tracking-tight uppercase">{user?.email?.split('@')[0] || "Founders"}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Badge variant="secondary" className="px-2 py-0 h-4 text-[9px] font-black uppercase tracking-[0.2em] bg-blue-600/10 text-blue-500 border-none">
                                    PRO
                                </Badge>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
