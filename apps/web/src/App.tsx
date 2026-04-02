
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import ErrorBoundary from './components/ErrorBoundary';
import MobileNav from './components/layout/MobileNav';

// NProgress Configuration
nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

// Lazy load pages for LeadRockets 4.0
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

const queryClient = new QueryClient();

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    nprogress.start();
    return () => {
      nprogress.done();
    };
  }, []);

  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/auth" />;

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <ErrorBoundary>
              <React.Suspense fallback={
                <div className="h-screen w-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-blue-500/20" />
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 animate-pulse">
                    LeadRockets 4.0
                  </div>
                </div>
              }>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
                  <Route path="/auth" element={<PublicRoute><PageWrapper><Auth /></PageWrapper></PublicRoute>} />

                  {/* Protected Routes */}
                  <Route path="/onboarding" element={<ProtectedRoute><PageWrapper><Onboarding /></PageWrapper></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
                  <Route path="/campaigns" element={<ProtectedRoute><PageWrapper><Campaigns /></PageWrapper></ProtectedRoute>} />
                  <Route path="/campaigns/new" element={<ProtectedRoute><PageWrapper><CampaignBuilder /></PageWrapper></ProtectedRoute>} />
                  <Route path="/campaigns/:id/edit" element={<ProtectedRoute><PageWrapper><CampaignBuilder /></PageWrapper></ProtectedRoute>} />
                  <Route path="/leads" element={<ProtectedRoute><PageWrapper><Leads /></PageWrapper></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><PageWrapper><Analytics /></PageWrapper></ProtectedRoute>} />
                  <Route path="/marketplace" element={<ProtectedRoute><PageWrapper><Marketplace /></PageWrapper></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
                  <Route path="/growth" element={<ProtectedRoute><PageWrapper><Growth /></PageWrapper></ProtectedRoute>} />
                  <Route path="/billing" element={<ProtectedRoute><PageWrapper><Billing /></PageWrapper></ProtectedRoute>} />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <MobileNav />
              </React.Suspense>
              <Toaster position="top-right" richColors theme="dark" closeButton />
            </ErrorBoundary>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
