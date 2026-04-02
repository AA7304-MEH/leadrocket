
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
    { name: "AI Studio", href: "/ai-studio", icon: Sparkles },
    { name: "Growth", href: "/growth", icon: Rocket },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Template Marketplace", href: "/marketplace", icon: Store },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Admin", href: "/admin", icon: Shield, adminOnly: true },
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
                "flex flex-col h-screen bg-slate-950 text-slate-400 border-r border-slate-800/50 transition-all duration-500 ease-in-out z-40 relative group",
                collapsed ? "w-20" : "w-[240px]",
                className
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6">
                <Link to="/" className="flex items-center gap-3 group/logo">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover/logo:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-black tracking-tighter text-white">LeadRockets</span>
                    )}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex text-slate-500 hover:text-white hover:bg-slate-900 border-none h-8 w-8"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
                <div className="px-3 mb-4">
                    {!collapsed && (
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Main Menu</p>
                    )}
                </div>
                {navItems.map((item) => {
                    if (item.adminOnly && user?.role !== 'admin') {
                        return null;
                    }

                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-100"
                            )} />
                            {!collapsed && (
                                <span className="flex-1">{item.name}</span>
                            )}
                            {isActive && !collapsed && (
                                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Plan */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
                <div className={cn(
                    "flex bg-slate-900/50 rounded-2xl border border-slate-800/50 transition-all p-3 items-center",
                    collapsed ? "justify-center" : "gap-3"
                )}>
                    <Avatar className="h-10 w-10 border-2 border-slate-800 shadow-xl overflow-hidden ring-2 ring-indigo-600/20">
                        <AvatarImage src={user?.profile?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-black text-xs uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-100 truncate tracking-tight">{user?.name || "User Name"}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[9px] font-black uppercase tracking-wider bg-indigo-600/10 text-indigo-400 border-indigo-600/20">
                                    {user?.subscription?.plan || "Pro"}
                                </Badge>
                                {user?.subscription?.status === 'active' && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
