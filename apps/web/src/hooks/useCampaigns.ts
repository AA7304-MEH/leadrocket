import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { campaignsApi } from '@/lib/api';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  subject_line: string;
  body: string;
  status: 'draft' | 'sent' | 'scheduled';
  ai_score: number;
  predicted_open_rate: number;
  send_time: string | null;
  sent_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
}

export const useCampaigns = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (newCampaign: Partial<Campaign>) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ ...newCampaign, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
      toast.success('Campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
      toast.success('Campaign deleted');
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await campaignsApi.send(id);
      return response.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
      toast.success(data.message || 'Campaign sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Send failed: ${error.response?.data?.message || error.message}`);
    },
  });

  return {
    campaigns: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createCampaign: createMutation.mutateAsync,
    updateCampaign: updateMutation.mutateAsync,
    deleteCampaign: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || sendMutation.isPending,
    sendCampaign: sendMutation.mutateAsync,
  };
};
