import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import App from './App'
import './index.css'
import { Rocket } from 'lucide-react'
import { Toaster } from 'sonner'

const LoadingScreen = () => (
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
    </div>
  </div>
);

const Root = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <App />
      <Toaster position="top-right" richColors theme="dark" closeButton />
    </PayPalScriptProvider>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
