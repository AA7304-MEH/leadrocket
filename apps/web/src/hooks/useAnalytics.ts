import { useMemo } from 'react';
import { useCampaigns } from './useCampaigns';

export const useAnalytics = () => {
  const { campaigns, isLoading } = useCampaigns();

  const stats = useMemo(() => {
    if (!campaigns.length) {
      return {
        totalSent: 0,
        avgOpenRate: 0,
        avgAiScore: 0,
        totalClicks: 0,
        campaignsOverTime: [],
        correlationData: []
      };
    }

    const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
    const totalOpens = campaigns.reduce((acc, c) => acc + (c.open_count || 0), 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + (c.click_count || 0), 0);
    const avgOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
    const avgAiScore = campaigns.reduce((acc, c) => acc + (c.ai_score || 0), 0) / campaigns.length;

    const campaignsOverTime = campaigns
      .slice(0, 7)
      .reverse()
      .map(c => ({
        name: c.name,
        sent: c.sent_count,
        opens: c.open_count
      }));

    const correlationData = campaigns.map(c => ({
      score: c.ai_score,
      openRate: c.sent_count > 0 ? (c.open_count / c.sent_count) * 100 : 0
    }));

    return {
      totalSent,
      avgOpenRate,
      avgAiScore,
      totalClicks,
      campaignsOverTime,
      correlationData
    };
  }, [campaigns]);

  return {
    ...stats,
    isLoading
  };
};
