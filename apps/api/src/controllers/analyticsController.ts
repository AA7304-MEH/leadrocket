import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analyticsService';

// Get admin analytics
export const getAdminAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { period = '30d' } = req.query;

    const analytics = await AnalyticsService.getAdminAnalytics(period as any);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// Get user analytics
export const getUserAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { period = '30d' } = req.query;

    const analytics = await AnalyticsService.getUserAnalytics(req.user, period as any);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// Export analytics data
export const exportAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { format = 'json' } = req.query;

    const exportData = await AnalyticsService.exportAnalytics(req.user, format as 'csv' | 'json');

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
      return res.status(200).send(exportData.data);
    }

    res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (error) {
    next(error);
  }
};

// Get lead performance metrics
export const getLeadPerformance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { period = '30d' } = req.query;

    // Get lead performance data
    const now = new Date();
    const periodDays = (AnalyticsService as any)['parsePeriod'](period as any);
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const leads = await prisma.lead.findMany({
      where: {
        userId: req.user.id,
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        status: true,
        score: true // Using score instead of metadata.confidence as implied in new schema
      },
      orderBy: { createdAt: 'asc' }
    });

    // Grouping manually since Prisma groupby is limited with dates
    const grouped: any = {};
    leads.forEach(lead => {
      const dateStr = lead.createdAt.toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = { count: 0, totalScore: 0, statuses: [] };
      }
      grouped[dateStr].count++;
      grouped[dateStr].totalScore += (lead.score || 0);
      grouped[dateStr].statuses.push(lead.status);
    });

    // Calculate daily metrics
    const dailyMetrics = Object.keys(grouped).map(dateStr => {
      const day = grouped[dateStr];
      return {
        date: dateStr,
        leads: day.count,
        avgConfidence: day.count > 0 ? Math.round(day.totalScore / day.count) : 0,
        qualified: day.statuses.filter((s: string) => s === 'qualified').length,
        converted: day.statuses.filter((s: string) => s === 'converted').length
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({
      success: true,
      data: {
        dailyMetrics,
        summary: {
          totalLeads: dailyMetrics.reduce((sum, day) => sum + day.leads, 0),
          avgDailyLeads: dailyMetrics.length > 0 ? Math.round(dailyMetrics.reduce((sum, day) => sum + day.leads, 0) / dailyMetrics.length) : 0,
          avgConfidence: dailyMetrics.length > 0 ? Math.round(dailyMetrics.reduce((sum, day) => sum + (day.avgConfidence || 0), 0) / dailyMetrics.length) : 0,
          totalQualified: dailyMetrics.reduce((sum, day) => sum + day.qualified, 0),
          totalConverted: dailyMetrics.reduce((sum, day) => sum + day.converted, 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get industry insights
export const getIndustryInsights = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // Prisma grouping by industry
    const groupedInsights = await prisma.lead.groupBy({
      by: ['industry'],
      where: { userId: req.user.id },
      _count: {
        _all: true,
        status: true // counting status isn't exactly conversion rate but we can filter
      },
      _avg: {
        score: true
      },
    });

    // To get conversion rate we need another query or raw query, or fetch all and aggregate
    // Let's do a fetch all simple approach for accuracy given complexity of "conversion rate" definition
    // Or we can assume 'status'='converted' check is needed.
    // Efficient approach: fetch distinct industries + counts, then fetch converted counts per industry?
    // Let's stick to fetching necessary fields and aggregating in memory for now (simpler migration)

    const allLeads = await prisma.lead.findMany({
      where: { userId: req.user.id },
      select: { industry: true, status: true, score: true }
    });

    const industryMap: any = {};
    allLeads.forEach(lead => {
      const ind = lead.industry || 'Unknown';
      if (!industryMap[ind]) {
        industryMap[ind] = { count: 0, totalScore: 0, converted: 0 };
      }
      industryMap[ind].count++;
      industryMap[ind].totalScore += (lead.score || 0);
      if (lead.status === 'converted') industryMap[ind].converted++;
    });

    const insights = Object.keys(industryMap).map(key => ({
      industry: key,
      count: industryMap[key].count,
      avgConfidence: Math.round(industryMap[key].count > 0 ? industryMap[key].totalScore / industryMap[key].count : 0),
      conversionRate: industryMap[key].count > 0 ? (industryMap[key].converted / industryMap[key].count) * 100 : 0
    })).sort((a, b) => b.count - a.count).slice(0, 10);

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};