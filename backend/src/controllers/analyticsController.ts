import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analyticsService';

// Get admin analytics
export const getAdminAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { period = '30d' } = req.query;

    const analytics = await AnalyticsService.getAdminAnalytics(period as string);

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

    const analytics = await AnalyticsService.getUserAnalytics(req.user, period as string);

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
    const periodDays = AnalyticsService['parsePeriod'](period as string);
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const performance = await require('../models/Lead').default.aggregate([
      { $match: { user: req.user._id, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          avgConfidence: { $avg: '$metadata.confidence' },
          statuses: { $push: '$status' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate daily metrics
    const dailyMetrics = performance.map((day: any) => ({
      date: day._id,
      leads: day.count,
      avgConfidence: Math.round(day.avgConfidence || 0),
      qualified: day.statuses.filter((s: string) => s === 'qualified').length,
      converted: day.statuses.filter((s: string) => s === 'converted').length
    }));

    res.status(200).json({
      success: true,
      data: {
        dailyMetrics,
        summary: {
          totalLeads: dailyMetrics.reduce((sum, day) => sum + day.leads, 0),
          avgDailyLeads: Math.round(dailyMetrics.reduce((sum, day) => sum + day.leads, 0) / dailyMetrics.length),
          avgConfidence: Math.round(dailyMetrics.reduce((sum, day) => sum + (day.avgConfidence || 0), 0) / dailyMetrics.length),
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
    const insights = await require('../models/Lead').default.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$metadata.confidence' },
          conversionRate: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'converted'] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          industry: '$_id',
          count: 1,
          avgConfidence: { $round: ['$avgConfidence', 1] },
          conversionRate: { $multiply: ['$conversionRate', 100] }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};