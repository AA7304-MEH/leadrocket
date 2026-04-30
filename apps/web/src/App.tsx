import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UpgradeProvider } from "@/contexts/UpgradeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { UpsellProvider } from "@/components/upsell/UpsellProvider";
import { SkipLink } from "@/components/accessibility/a11y";

// Page imports
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Pricing from "./pages/Pricing";
import CaseStudies from "./pages/CaseStudies";
import Templates from "./pages/Templates";
import Blog from "./pages/Blog";
import Compare from "./pages/Compare";
import About from "./pages/About";
import Onboarding from "./pages/Onboarding";
import CoachingDashboard from "./pages/CoachingDashboard";
import IntegrationBuilder from "./pages/IntegrationBuilder";
import Team from "./pages/Team";
import EmailInfrastructure from "./pages/EmailInfrastructure";
import Billing from "./pages/Billing";
import Growth from "./pages/Growth";

// Configure React Query with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRouter = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-600/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 text-blue-500 animate-pulse">🚀</div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
            Loading LeadRockets...
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <main id="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />

          {/* Auth Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/team" element={<Team />} />
          <Route path="/email-infrastructure" element={<EmailInfrastructure />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/growth" element={<Growth />} />

          {/* Feature Routes */}
          <Route path="/coaching" element={<CoachingDashboard />} />
          <Route path="/integrations/new" element={<IntegrationBuilder />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error("[ErrorBoundary]", error.message, errorInfo.componentStack);
    }}
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UpgradeProvider>
          <UpsellProvider>
            <TooltipProvider>
              <SkipLink />
              <Toaster />
              <Sonner />
              <AppRouter />
            </TooltipProvider>
          </UpsellProvider>
        </UpgradeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
