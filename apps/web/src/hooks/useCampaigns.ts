
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsApi, Campaign } from '@/lib/api';
import { toast } from 'sonner';

// Get all campaigns
export const useCampaigns = () => {
    return useQuery({
        queryKey: ['campaigns'],
        queryFn: async () => {
            const response = await campaignsApi.getAll();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

// Get single campaign
export const useCampaign = (id: string) => {
    return useQuery({
        queryKey: ['campaigns', id],
        queryFn: async () => {
            const response = await campaignsApi.getById(id);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// Get campaign stats
export const useCampaignStats = () => {
    return useQuery({
        queryKey: ['campaigns', 'stats'],
        queryFn: async () => {
            const response = await campaignsApi.getStats();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 2,
    });
};

// Create campaign
export const useCreateCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Campaign>) => campaignsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign created successfully');
        },
        onError: () => {
            toast.error('Failed to create campaign');
        },
    });
};

// Update campaign
export const useUpdateCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) =>
            campaignsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign updated');
        },
        onError: () => {
            toast.error('Failed to update campaign');
        },
    });
};

// Delete campaign
export const useDeleteCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => campaignsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign deleted');
        },
        onError: () => {
            toast.error('Failed to delete campaign');
        },
    });
};

// Launch campaign
export const useLaunchCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => campaignsApi.launch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('🚀 Campaign launched!');
        },
        onError: () => {
            toast.error('Failed to launch campaign');
        },
    });
};

// Pause campaign
export const usePauseCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => campaignsApi.pause(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign paused');
        },
        onError: () => {
            toast.error('Failed to pause campaign');
        },
    });
};

// Resume campaign
export const useResumeCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => campaignsApi.resume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign resumed');
        },
        onError: () => {
            toast.error('Failed to resume campaign');
        },
    });
};
