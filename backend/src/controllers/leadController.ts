import { Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/auth';

// Get all leads for user
export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { user: req.user.id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Search by company name or contact name
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// Get single lead
export const getLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    // Check if user owns the lead or is admin
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this lead'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Create new lead
export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // Add user to lead data
    const leadData = {
      ...req.body,
      user: req.user.id,
      source: req.body.source || 'manual'
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Update lead
export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    // Check if user owns the lead or is admin
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this lead'
      });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Delete lead
export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    // Check if user owns the lead or is admin
    if (lead.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this lead'
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};