import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UpgradeProvider } from "@/contexts/UpgradeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { UpsellProvider } from "@/components/upsell/UpsellProvider";
import { SkipLink } from "@/components/accessibility/a11y";

// Page imports
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
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

const App = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Log to monitoring service in production
      console.error("[ErrorBoundary]", error.message, errorInfo.componentStack);
      // In production: Sentry.captureException(error, { extra: errorInfo });
    }}
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UpgradeProvider>
          <UpsellProvider>
            <TooltipProvider>
              {/* Accessibility: Skip link for keyboard users */}
              <SkipLink />

              <Toaster />
              <Sonner />

              <BrowserRouter>
                <main id="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/case-studies" element={<CaseStudies />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/about" element={<About />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
            </TooltipProvider>
          </UpsellProvider>
        </UpgradeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
