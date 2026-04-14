import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  Rocket, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Send, label: 'Campaigns', href: '/campaigns' },
  { icon: Users, label: 'Leads', href: '/leads' },
  { icon: Rocket, label: 'Growth', href: '/growth' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-t border-white/5 px-6 pb-6 pt-3 justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative",
              isActive ? "text-blue-500" : "text-slate-500"
            )}
          >
            {isActive && (
              <div className="absolute -top-3 w-8 h-1 bg-blue-600 rounded-full" />
            )}
            <item.icon className={cn("w-6 h-6", isActive && "scale-110")} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
