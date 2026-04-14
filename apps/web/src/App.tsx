import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Campaigns = React.lazy(() => import('./pages/Campaigns'));
const CampaignBuilder = React.lazy(() => import('./pages/CampaignBuilder'));
const Leads = React.lazy(() => import('./pages/Leads'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Growth = React.lazy(() => import('./pages/Growth'));
const Billing = React.lazy(() => import('./pages/Billing'));
const Debug = React.lazy(() => import('./pages/Debug'));
const DashboardLayout = React.lazy(() => import('./components/layout/DashboardLayout'));

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ErrorBoundary>
            <React.Suspense fallback={
              <div className="h-screen w-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-blue-500/20" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">
                  LeadRockets 4.0
                </div>
              </div>
            }>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Onboarding — auth required but separate from app shell */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                </Route>

                {/* App routes — auth required + app shell */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/campaigns/new" element={<CampaignBuilder />} />
                    <Route path="/campaigns/:id/edit" element={<CampaignBuilder />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/growth" element={<Growth />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/debug" element={<Debug />} />
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
            <Toaster position="top-right" richColors theme="dark" closeButton />
          </ErrorBoundary>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
