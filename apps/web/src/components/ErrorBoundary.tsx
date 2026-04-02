import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
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
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#1a1a1a,_transparent_30%),_radial-gradient(circle_at_bottom_left,_#111,_transparent_30%)]">
          <div className="max-w-md w-full bg-[#111] border border-white/5 p-12 rounded-[40px] text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter text-white">Something went wrong</h1>
              <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                {this.state.error?.message || "An unexpected error occurred. Our engineers have been notified."}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={() => window.location.reload()}
                className="h-14 rounded-2xl bg-white text-black hover:bg-slate-200 font-bold uppercase tracking-widest text-xs gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry Connection
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="h-14 rounded-2xl text-slate-500 hover:text-white font-bold uppercase tracking-widest text-xs gap-2"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
