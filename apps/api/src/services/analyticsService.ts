import { prisma } from '../utils/prisma';
import { User } from '@prisma/client';

export interface AnalyticsData {
  period: string;
  leads: {
    total: number;
    generated: number;
    qualified: number;
    converted: number;
    conversionRate: number;
  };
  users: {
    total: number;
    new: number;
    active: number;
    churned: number;
  };
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  topIndustries: Array<{
    industry: string;
    count: number;
    percentage: number;
  }>;
  leadSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
    leads: number;
  }>;
}

export class AnalyticsService {
  // Get comprehensive analytics for admin dashboard
  static async getAdminAnalytics(period: string = '30d'): Promise<AnalyticsData> {
    try {
      const now = new Date();
      const periodDays = this.parsePeriod(period);
      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // Lead analytics
      const totalLeads = await prisma.lead.count();
      const generatedLeads = await prisma.lead.count({
        where: { createdAt: { gte: startDate } }
      });
      const qualifiedLeads = await prisma.lead.count({
        where: {
          status: 'qualified',
          createdAt: { gte: startDate }
        }
      });
      const convertedLeads = await prisma.lead.count({
        where: {
          status: 'converted',
          createdAt: { gte: startDate }
        }
      });

      // User analytics
      const totalUsers = await prisma.user.count();
      const newUsers = await prisma.user.count({
        where: { createdAt: { gte: startDate } }
      });
      const activeUsers = await prisma.user.count({
        where: {
          isActive: true,
          lastLogin: { gte: startDate }
        }
      });

      // Revenue analytics (simulated)
      // Assuming trials don't generate revenue unless converted, but matching old logic:
      const activeSubscriptions = await prisma.subscription.count({
        where: { status: { in: ['active', 'trial'] } }
      });
      const monthlyRevenue = activeSubscriptions * 100; // Average $100 per user

      // Industry breakdown
      const industryStats = await prisma.lead.groupBy({
        by: ['industry'],
        where: { createdAt: { gte: startDate } },
        _count: { _all: true },
        orderBy: { _count: { industry: 'desc' } }, // approximation
        take: 10
      });

      const totalIndustryLeads = industryStats.reduce((sum, item) => sum + item._count._all, 0);
      const topIndustries = industryStats.map(item => ({
        industry: item.industry || 'Unknown',
        count: item._count._all,
        percentage: totalIndustryLeads > 0 ? (item._count._all / totalIndustryLeads) * 100 : 0
      })).sort((a, b) => b.count - a.count); // sort manually if needed

      // Lead sources
      const sourceStats = await prisma.lead.groupBy({
        by: ['source'],
        where: { createdAt: { gte: startDate } },
        _count: { _all: true },
        orderBy: { _count: { source: 'desc' } }
      });

      const totalSourceLeads = sourceStats.reduce((sum, item) => sum + item._count._all, 0);
      const leadSources = sourceStats.map(item => ({
        source: item.source || 'Unknown',
        count: item._count._all,
        percentage: totalSourceLeads > 0 ? (item._count._all / totalSourceLeads) * 100 : 0
      })).sort((a, b) => b.count - a.count);

      // User growth over time
      const userGrowth = await this.getUserGrowthData(startDate, now);

      return {
        period,
        leads: {
          total: totalLeads,
          generated: generatedLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads,
          conversionRate: generatedLeads > 0 ? (convertedLeads / generatedLeads) * 100 : 0
        },
        users: {
          total: totalUsers,
          new: newUsers,
          active: activeUsers,
          churned: totalUsers - activeUsers
        },
        revenue: {
          total: monthlyRevenue * 12, // Annual
          monthly: monthlyRevenue,
          growth: 15.5 // Simulated growth percentage
        },
        topIndustries,
        leadSources,
        userGrowth
      };
    } catch (error) {
      throw new Error(`Analytics generation failed: ${(error as Error).message}`);
    }
  }

  // Get user-specific analytics
  static async getUserAnalytics(user: User, period: string = '30d'): Promise<any> {
    try {
      const now = new Date();
      const periodDays = this.parsePeriod(period);
      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // User's lead performance
      const userLeads = await prisma.lead.findMany({ where: { userId: user.id } });

      const periodLeads = await prisma.lead.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: startDate }
        },
        select: {
          status: true,
          score: true // Using flattened score
          // metadata: true // if needed
        }
      });

      const qualifiedLeads = periodLeads.filter(lead => lead.status === 'qualified').length;
      const convertedLeads = periodLeads.filter(lead => lead.status === 'converted').length;

      // Lead quality score (based on score/confidence)
      const avgConfidence = periodLeads.length > 0
        ? periodLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / periodLeads.length
        : 0;

      // Usage analytics
      const usagePercentage = (user.leadsThisMonth / user.monthlyLimit) * 100;

      // Performance trends
      const performanceTrends = await this.getUserPerformanceTrends(user.id, startDate);

      // Get subscription details separately if needed or rely on stored User flat fields
      const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });

      return {
        overview: {
          totalLeads: userLeads.length,
          periodLeads: periodLeads.length,
          qualifiedLeads,
          convertedLeads,
          conversionRate: periodLeads.length > 0 ? (convertedLeads / periodLeads.length) * 100 : 0,
          avgConfidence: Math.round(avgConfidence)
        },
        usage: {
          current: user.leadsThisMonth,
          limit: user.monthlyLimit,
          percentage: usagePercentage,
          remaining: user.monthlyLimit - user.leadsThisMonth
        },
        trends: performanceTrends,
        subscription: {
          plan: user.subscriptionPlan,
          status: user.subscriptionStatus,
          trialEndsAt: user.trialEndsAt,
          currentPeriodEnd: subscription?.currentPeriodEnd || null
        }
      };
    } catch (error) {
      console.error(error);
      throw new Error(`User analytics generation failed: ${(error as Error).message}`);
    }
  }

  // Helper method to parse period string
  private static parsePeriod(period: string): number {
    const periodMap: { [key: string]: number } = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    return periodMap[period] || 30;
  }

  // Get user growth data over time
  private static async getUserGrowthData(startDate: Date, endDate: Date): Promise<Array<{ date: string; users: number; leads: number }>> {
    try {
      // Generate daily data points
      const data = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        const users = await prisma.user.count({
          where: { createdAt: { lte: dayEnd } }
        });

        const leads = await prisma.lead.count({
          where: { createdAt: { gte: dayStart, lte: dayEnd } }
        });

        data.push({
          date: dayStart.toISOString().split('T')[0],
          users,
          leads
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return data;
    } catch (error) {
      return [];
    }
  }

  // Get user performance trends
  private static async getUserPerformanceTrends(userId: string, startDate: Date): Promise<any> {
    try {
      // Get weekly performance data
      const weeklyData = [];
      const now = new Date();

      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));

        const leads = await prisma.lead.count({
          where: {
            userId: userId,
            createdAt: { gte: weekStart, lt: weekEnd }
          }
        });

        weeklyData.push({
          week: `Week ${6 - i + 1}`,
          leads,
          date: weekStart.toISOString().split('T')[0]
        });
      }

      return {
        weekly: weeklyData,
        trend: weeklyData.length > 1 ?
          ((weeklyData[weeklyData.length - 1].leads - weeklyData[0].leads) / weeklyData[0].leads * 100) : 0
      };
    } catch (error) {
      return { weekly: [], trend: 0 };
    }
  }

  // Export analytics data
  static async exportAnalytics(user: User, format: 'csv' | 'json' = 'json'): Promise<any> {
    try {
      const analytics = await this.getUserAnalytics(user);

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = this.convertToCSV(analytics);
        return {
          format: 'csv',
          data: csvData,
          filename: `analytics_${user.email}_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        format: 'json',
        data: analytics,
        filename: `analytics_${user.email}_${new Date().toISOString().split('T')[0]}.json`
      };
    } catch (error) {
      throw new Error(`Analytics export failed: ${(error as Error).message}`);
    }
  }

  // Convert analytics data to CSV
  private static convertToCSV(analytics: any): string {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Leads', analytics.overview.totalLeads],
      ['Period Leads', analytics.overview.periodLeads],
      ['Qualified Leads', analytics.overview.qualifiedLeads],
      ['Converted Leads', analytics.overview.convertedLeads],
      ['Conversion Rate (%)', analytics.overview.conversionRate],
      ['Average Confidence', analytics.overview.avgConfidence],
      ['Current Usage', analytics.usage.current],
      ['Usage Limit', analytics.usage.limit],
      ['Usage Percentage (%)', analytics.usage.percentage],
      ['Remaining Leads', analytics.usage.remaining],
      ['Plan', analytics.subscription.plan],
      ['Subscription Status', analytics.subscription.status]
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }
}