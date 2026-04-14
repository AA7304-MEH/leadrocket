import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: 'active' | 'archived' | 'unsubscribed';
  ai_score: number;
  source: string;
  tags: string[];
  last_contacted: string | null;
  created_at: string;
}

export interface LeadList {
  id: string;
  user_id: string;
  name: string;
  description: string;
  lead_count: number;
  created_at: string;
}

export const useLeads = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!user?.id,
  });

  const leadListsQuery = useQuery({
    queryKey: ['lead_lists', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_lists')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeadList[];
    },
    enabled: !!user?.id,
  });

  const createLeadMutation = useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...newLead, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', user?.id] });
      toast.success('Lead added successfully');
    },
  });

  const bulkImportMutation = useMutation({
    mutationFn: async (leads: Partial<Lead>[]) => {
      const leadsWithUser = leads.map(l => ({ ...l, user_id: user?.id }));
      const { data, error } = await supabase
        .from('leads')
        .insert(leadsWithUser)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads', user?.id] });
      toast.success(`${data.length} leads imported successfully`);
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lead> & { id: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', user?.id] });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async ({ id, soft = true }: { id: string, soft?: boolean }) => {
      if (soft) {
        const { error } = await supabase
          .from('leads')
          .update({ status: 'archived' })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', user?.id] });
      toast.success('Lead removed');
    },
  });

  return {
    leads: leadsQuery.data || [],
    leadLists: leadListsQuery.data || [],
    isLoading: leadsQuery.isLoading || leadListsQuery.isLoading,
    createLead: createLeadMutation.mutateAsync,
    bulkImport: bulkImportMutation.mutateAsync,
    updateLead: updateLeadMutation.mutateAsync,
    deleteLead: deleteLeadMutation.mutateAsync,
  };
};
