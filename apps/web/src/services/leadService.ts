import { Lead } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const leadService = {
    getLeads: async (params: any = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/leads?${query}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch leads');
        return response.json();
    },

    getLead: async (id: string) => {
        const response = await fetch(`${API_URL}/leads/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch lead');
        return response.json();
    },

    createLead: async (data: Partial<Lead>) => {
        const response = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create lead');
        return response.json();
    },

    updateLead: async (id: string, data: Partial<Lead>) => {
        const response = await fetch(`${API_URL}/leads/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update lead');
        return response.json();
    },

    deleteLead: async (id: string) => {
        const response = await fetch(`${API_URL}/leads/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete lead');
        return response.json();
    },

    generateLeads: async (filters?: { industry?: string; location?: string }) => {
        const response = await fetch(`${API_URL}/leads/generate`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(filters || {})
        });
        if (!response.ok) throw new Error('Failed to generate leads');
        return response.json();
    }
};
