
import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH ====================
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    getProfile: () => api.get('/users/me'),
};

// ==================== LEADS ====================
export interface CompetitorInsights {
  detectedCompetitors: string[]
  mentionContext: string
  counterStrategies: string[]
  severity: 'low' | 'medium' | 'high'
  detectedAt: string
}

export interface CompetitorLead {
  id: string
  contactName: string
  companyName: string
  competitorInsights: CompetitorInsights | null
  updatedAt: string
}

export interface Lead {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    title: string;
    verificationStatus: 'verified' | 'unverified' | 'invalid' | 'pending';
    source: string;
    createdAt: string;
}

export const leadsApi = {
    getAll: () => api.get<{ success: boolean; count: number; data: Lead[] }>('/leads'),
    getCompetitorAlerts: async (): Promise<CompetitorLead[]> => {
        const response = await api.get('/leads/competitors')
        return response.data?.data ?? response.data ?? []
    },
    getById: (id: string) => api.get<{ success: boolean; data: Lead }>(`/leads/${id}`),
    create: (data: Partial<Lead>) => api.post<{ success: boolean; data: Lead }>('/leads', data),
    update: (id: string, data: Partial<Lead>) => api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data),
    delete: (id: string) => api.delete(`/leads/${id}`),
    importCSV: (formData: FormData) => api.post('/leads/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    verify: (id: string) => api.post(`/leads/${id}/verify`),
};

// ==================== CAMPAIGNS ====================
export interface Campaign {
    _id: string;
    name: string;
    subject?: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    leads?: string[];
    emailContent?: string;
    scheduleType?: 'now' | 'scheduled' | 'optimized';
    timezone?: string;
    sendWindow?: string;
    metrics: {
        sent: number;
        opened: number;
        replied: number;
        converted: number;
    };
    createdAt: string;
}

export const campaignsApi = {
    getAll: () => api.get<{ success: boolean; data: Campaign[] }>('/campaigns'),
    getById: (id: string) => api.get<{ success: boolean; data: Campaign }>(`/campaigns/${id}`),
    create: (data: Partial<Campaign>) => api.post<{ success: boolean; data: Campaign }>('/campaigns', data),
    update: (id: string, data: Partial<Campaign>) => api.put<{ success: boolean; data: Campaign }>(`/campaigns/${id}`, data),
    delete: (id: string) => api.delete(`/campaigns/${id}`),
    launch: (id: string) => api.post(`/campaigns/${id}/launch`),
    pause: (id: string) => api.post(`/campaigns/${id}/pause`),
    resume: (id: string) => api.post(`/campaigns/${id}/resume`),
    send: (id: string) => api.post(`/campaigns/${id}/send`),
    getStats: () => api.get<{ success: boolean; data: { total: number; active: number; sent: number; avgReplyRate: number } }>('/campaigns/stats'),
};

// ==================== AI ====================
export const aiApi = {
    scoreCampaign: (data: any) => api.post('/ai/score-campaign', data),
    remixCampaign: (data: any) => api.post('/ai/remix-campaign', data),
    generateSubjects: (data: any) => api.post('/ai/generate-subjects', data),
};

// ==================== MARKETPLACE ====================
export const marketplaceApi = {
    getTemplates: (params: any) => api.get('/marketplace', { params }),
    publishTemplate: (data: any) => api.post('/marketplace/publish', data),
    useTemplate: (id: string) => api.post(`/marketplace/${id}/use`),
    purchaseTemplate: (id: string) => api.post(`/marketplace/${id}/purchase`),
    reviewTemplate: (id: string, data: any) => api.post(`/marketplace/${id}/review`, data),
};

// ==================== REFERRALS ====================
export const referralsApi = {
    getStats: () => api.get('/referrals/stats'),
    getLeaderboard: () => api.get('/referrals/leaderboard'),
};

// ==================== USER/SUBSCRIPTION ====================
export const subscriptionApi = {
    getCurrent: () => api.get('/subscriptions/current'),
    getUsage: () => api.get('/subscriptions/usage'),
    upgrade: (plan: string) => api.post('/subscriptions/upgrade', { plan }),
};

export default api;
