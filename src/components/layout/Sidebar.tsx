
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    LayoutDashboard,
    Send,
    Users,
    FileText,
    BarChart3,
    UsersRound,
    Settings,
    Zap,
    ChevronLeft,
    ChevronRight,
    Shield,
    Mail,
    Wallet,
    Rocket
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Viral Growth", href: "/growth", icon: Rocket, badge: "NEW" },
    { name: "Campaigns", href: "/campaigns", icon: Send, badge: "3 active" },
    { name: "Leads", href: "/leads", icon: Users, badge: "1,245" },
    { name: "Templates", href: "/templates", icon: FileText, badge: "12" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, isPro: true },
    { name: "Team", href: "/team", icon: UsersRound, isPro: true, plan: "Scale" },
    { name: "Email", href: "/email-infrastructure", icon: Mail, isPro: true },
    { name: "Billing", href: "/billing", icon: Wallet },
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

    // Use refined usage data from user context or fallbacks
    const usage = {
        emailsSent: user?.usage?.leadsThisMonth || 0,
        emailLimit: user?.usage?.monthlyLimit || 100
    };
    const usagePercent = (usage.emailsSent / usage.emailLimit) * 100;

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
                collapsed ? "w-20" : "w-64",
                className
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                    <Zap className="w-8 h-8 text-primary" />
                    {!collapsed && <span className="text-xl font-bold text-gray-900">LeadRockets</span>}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    // Hide admin items if user is not admin
                    if ((item as any).adminOnly && user?.role !== 'admin') {
                        return null;
                    }

                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="text-xs text-gray-400">{item.badge}</span>
                                    )}
                                    {item.isPro && (
                                        <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                            {item.plan || "Pro"}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Upgrade Card - Sticky at bottom */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-100">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-500">Plan: Free</span>
                            <span className="text-xs text-gray-400">{usage.emailsSent}/{usage.emailLimit} emails</span>
                        </div>
                        <Progress value={usagePercent} className="h-2 mb-3" />
                        <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            Upgrade to Pro for unlimited
                        </p>
                        <Link to="/pricing">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm">
                                Upgrade Now
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
