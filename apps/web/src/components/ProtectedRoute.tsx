import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rocket } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-600/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
            LeadRockets 4.0
          </div>
          <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 100%; transform: translateX(0); }
            100% { width: 0%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
