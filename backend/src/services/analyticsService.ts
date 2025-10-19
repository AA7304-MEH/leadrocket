import Lead from '../models/Lead';
import User from '../models/User';
import Subscription from '../models/Subscription';
import { IUser } from '../models/User';

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
      const totalLeads = await Lead.countDocuments();
      const generatedLeads = await Lead.countDocuments({
        createdAt: { $gte: startDate }
      });
      const qualifiedLeads = await Lead.countDocuments({
        status: 'qualified',
        createdAt: { $gte: startDate }
      });
      const convertedLeads = await Lead.countDocuments({
        status: 'converted',
        createdAt: { $gte: startDate }
      });

      // User analytics
      const totalUsers = await User.countDocuments();
      const newUsers = await User.countDocuments({
        createdAt: { $gte: startDate }
      });
      const activeUsers = await User.countDocuments({
        isActive: true,
        lastLogin: { $gte: startDate }
      });

      // Revenue analytics (simulated)
      const activeSubscriptions = await Subscription.countDocuments({
        status: { $in: ['active', 'trial'] }
      });
      const monthlyRevenue = activeSubscriptions * 100; // Average $100 per user

      // Industry breakdown
      const industryStats = await Lead.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$industry', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      const totalIndustryLeads = industryStats.reduce((sum, item) => sum + item.count, 0);
      const topIndustries = industryStats.map(item => ({
        industry: item._id || 'Unknown',
        count: item.count,
        percentage: totalIndustryLeads > 0 ? (item.count / totalIndustryLeads) * 100 : 0
      }));

      // Lead sources
      const sourceStats = await Lead.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const totalSourceLeads = sourceStats.reduce((sum, item) => sum + item.count, 0);
      const leadSources = sourceStats.map(item => ({
        source: item._id,
        count: item.count,
        percentage: totalSourceLeads > 0 ? (item.count / totalSourceLeads) * 100 : 0
      }));

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
  static async getUserAnalytics(user: IUser, period: string = '30d'): Promise<any> {
    try {
      const now = new Date();
      const periodDays = this.parsePeriod(period);
      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // User's lead performance
      const userLeads = await Lead.find({ user: user._id });
      const periodLeads = await Lead.find({
        user: user._id,
        createdAt: { $gte: startDate }
      });

      const qualifiedLeads = periodLeads.filter(lead => lead.status === 'qualified').length;
      const convertedLeads = periodLeads.filter(lead => lead.status === 'converted').length;

      // Lead quality score (based on metadata confidence)
      const avgConfidence = periodLeads.length > 0
        ? periodLeads.reduce((sum, lead) => sum + (lead.metadata?.confidence || 0), 0) / periodLeads.length
        : 0;

      // Usage analytics
      const usagePercentage = (user.usage.leadsThisMonth / user.usage.monthlyLimit) * 100;

      // Performance trends
      const performanceTrends = await this.getUserPerformanceTrends(user._id.toString(), startDate);

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
          current: user.usage.leadsThisMonth,
          limit: user.usage.monthlyLimit,
          percentage: usagePercentage,
          remaining: user.usage.monthlyLimit - user.usage.leadsThisMonth
        },
        trends: performanceTrends,
        subscription: {
          plan: user.subscription.plan,
          status: user.subscription.status,
          trialEndsAt: user.subscription.trialEndsAt,
          currentPeriodEnd: user.subscription.currentPeriodEnd
        }
      };
    } catch (error) {
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
  private static async getUserGrowthData(startDate: Date, endDate: Date): Promise<Array<{date: string; users: number; leads: number}>> {
    try {
      // Generate daily data points
      const data = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        const users = await User.countDocuments({
          createdAt: { $lte: dayEnd }
        });

        const leads = await Lead.countDocuments({
          createdAt: { $gte: dayStart, $lte: dayEnd }
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

        const leads = await Lead.countDocuments({
          user: userId,
          createdAt: { $gte: weekStart, $lt: weekEnd }
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
  static async exportAnalytics(user: IUser, format: 'csv' | 'json' = 'json'): Promise<any> {
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