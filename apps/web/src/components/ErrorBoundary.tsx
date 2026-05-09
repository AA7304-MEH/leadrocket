import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 ring-4 ring-red-500/20">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4">Something went wrong</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-12 max-w-md">
            Our engines encountered an unexpected turbulence. We've been notified and are working on a fix.
          </p>
          <div className="flex gap-4">
            <Button 
                onClick={() => window.location.reload()}
                className="bg-white text-black h-12 rounded-xl px-8 font-black uppercase tracking-widest text-[10px] gap-2"
            >
                <RefreshCcw className="w-4 h-4" />
                Retry System
            </Button>
            <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-white/10 text-white h-12 rounded-xl px-8 font-black uppercase tracking-widest text-[10px] gap-2"
            >
                <Home className="w-4 h-4" />
                Return Home
            </Button>
          </div>
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
