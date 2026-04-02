
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, Lead } from '@/lib/api';
import { toast } from 'sonner';

// Get all leads
export const useLeads = () => {
    return useQuery({
        queryKey: ['leads'],
        queryFn: async () => {
            const response = await leadsApi.getAll();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Get single lead
export const useLead = (id: string) => {
    return useQuery({
        queryKey: ['leads', id],
        queryFn: async () => {
            const response = await leadsApi.getById(id);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// Create lead
export const useCreateLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Lead>) => leadsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead created successfully');
        },
        onError: () => {
            toast.error('Failed to create lead');
        },
    });
};

// Update lead
export const useUpdateLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
            leadsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead updated successfully');
        },
        onError: () => {
            toast.error('Failed to update lead');
        },
    });
};

// Delete lead
export const useDeleteLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => leadsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead deleted');
        },
        onError: () => {
            toast.error('Failed to delete lead');
        },
    });
};

// Verify lead
export const useVerifyLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => leadsApi.verify(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Verification started');
        },
        onError: () => {
            toast.error('Failed to verify lead');
        },
    });
};
