import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  TrendingUp, 
  Settings,
  MoreHorizontal
} from 'lucide-react';

const MobileNav: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
        { icon: Send, label: 'Campaigns', path: '/campaigns' },
        { icon: Users, label: 'Leads', path: '/leads' },
        { icon: TrendingUp, label: 'Growth', path: '/growth' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0A0A0A]/80 backdrop-blur-3xl border-t border-white/5 z-50 px-6 safe-area-bottom">
            <div className="flex items-center justify-between h-full">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            relative flex flex-col items-center justify-center gap-1.5 w-16 transition-all duration-300
                            ${isActive ? 'text-blue-500 scale-110' : 'text-slate-600 hover:text-slate-400'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="absolute -top-[2px] w-6 h-1 bg-blue-600 rounded-full blur-[2px]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default MobileNav;
