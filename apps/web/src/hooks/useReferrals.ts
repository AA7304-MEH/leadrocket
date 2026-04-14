import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email: string;
  status: 'pending' | 'converted';
  credits_awarded: number;
  created_at: string;
}

export const useReferrals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Referral[];
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('referrals-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referrals',
          filter: `referrer_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['referrals', user.id] });
          confetti({
            particleCount: 80,
            spread: 60,
            colors: ['#2563eb', '#4f46e5', '#ffffff']
          });
          toast.success('New referral! +500 credits earned 🎉');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const stats = {
    totalReferrals: query.data?.length || 0,
    convertedCount: query.data?.filter(r => r.status === 'converted').length || 0,
    creditsEarned: query.data?.reduce((acc, r) => acc + (r.credits_awarded || 0), 0) || 0,
  };

  return {
    referrals: query.data || [],
    isLoading: query.isLoading,
    ...stats,
  };
};
