import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { LeadGenerationService } from '../services/leadGenerationService';

// Generate new leads using AI simulation
export const generateLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { count = 5 } = req.body;

    // Check if user can generate more leads
    if (req.user.usage.leadsThisMonth >= req.user.usage.monthlyLimit) {
      return res.status(429).json({
        success: false,
        error: 'Monthly lead limit reached. Please upgrade your plan.'
      });
    }

    // Calculate how many leads user can generate
    const availableLeads = req.user.usage.monthlyLimit - req.user.usage.leadsThisMonth;
    const leadsToGenerate = Math.min(count, availableLeads);

    if (leadsToGenerate <= 0) {
      return res.status(429).json({
        success: false,
        error: 'No leads available for generation this month'
      });
    }

    // Generate leads
    const generatedLeads = await LeadGenerationService.generateLeads(req.user, leadsToGenerate);

    // Save leads to database
    const savedLeads = await LeadGenerationService.saveGeneratedLeads(req.user, generatedLeads);

    res.status(201).json({
      success: true,
      data: {
        leads: savedLeads,
        generated: savedLeads.length,
        remaining: req.user.usage.monthlyLimit - req.user.usage.leadsThisMonth
      },
      message: `Successfully generated ${savedLeads.length} leads`
    });
  } catch (error) {
    next(error);
  }
};

// Get lead generation statistics
export const getLeadStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const stats = await LeadGenerationService.getLeadStats(req.user);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        monthlyUsage: req.user.usage.leadsThisMonth,
        monthlyLimit: req.user.usage.monthlyLimit,
        usagePercentage: (req.user.usage.leadsThisMonth / req.user.usage.monthlyLimit) * 100
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get lead generation history
export const getGenerationHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // This would typically come from a separate collection tracking generation events
    // For now, we'll simulate it
    const history = {
      totalGenerations: Math.floor(req.user.usage.leadsThisMonth / 5),
      lastGeneration: new Date(),
      averageLeadsPerGeneration: 5,
      totalLeadsGenerated: req.user.usage.leadsThisMonth
    };

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};