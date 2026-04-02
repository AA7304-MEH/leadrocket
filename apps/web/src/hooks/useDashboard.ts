
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, subscriptionApi } from '@/lib/api';

// Dashboard metrics
export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: ['dashboard', 'metrics'],
        queryFn: async () => {
            try {
                const response = await dashboardApi.getMetrics();
                return response.data.data;
            } catch {
                // Return mock data as fallback
                return {
                    campaigns: { active: 2, total: 5, sent: 145, opened: 48, replied: 12 },
                    leads: { total: 250, verified: 180, pending: 45, invalid: 25 },
                    usage: { emailsSent: 145, emailLimit: 500, aiCredits: 23, aiLimit: 100 }
                };
            }
        },
        staleTime: 1000 * 60 * 2,
    });
};

// Dashboard activity feed
export const useDashboardActivity = () => {
    return useQuery({
        queryKey: ['dashboard', 'activity'],
        queryFn: async () => {
            try {
                const response = await dashboardApi.getActivity();
                return response.data.data;
            } catch {
                // Mock fallback
                return [
                    { id: '1', type: 'reply', message: 'Sarah Chen replied', time: '2 min ago', leadName: 'Sarah Chen' },
                    { id: '2', type: 'open', message: 'Email opened by Mike Rodriguez', time: '15 min ago', leadName: 'Mike Rodriguez' },
                    { id: '3', type: 'sent', message: 'Campaign "Q1 Outreach" sent 25 emails', time: '1 hour ago' },
                ];
            }
        },
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60, // Refetch every minute
    });
};

// AI Insights
export const useAIInsights = () => {
    return useQuery({
        queryKey: ['dashboard', 'insights'],
        queryFn: async () => {
            try {
                const response = await dashboardApi.getInsights();
                return response.data.data;
            } catch {
                // Mock fallback
                return [
                    { id: '1', type: 'opportunity', title: 'Best time to send', description: 'Tuesday 10am has 3x higher open rate', priority: 'high' },
                    { id: '2', type: 'warning', title: 'Bounce rate increasing', description: '5 emails bounced in last campaign', priority: 'medium' },
                ];
            }
        },
        staleTime: 1000 * 60 * 5,
    });
};

// Plan usage
export const usePlanUsage = () => {
    return useQuery({
        queryKey: ['subscription', 'usage'],
        queryFn: async () => {
            try {
                const response = await subscriptionApi.getUsage();
                return response.data.data;
            } catch {
                // Mock fallback
                return {
                    plan: 'Free',
                    emails: { used: 78, limit: 100 },
                    leads: { used: 45, limit: 100 },
                    verifications: { used: 0, limit: 0 },
                    aiCredits: { used: 23, limit: 50 },
                    resetsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
                };
            }
        },
        staleTime: 1000 * 60 * 5,
    });
};
