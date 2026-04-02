import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { CRMService } from '../services/crmService';

// Sync single lead to CRMs
export const syncLeadToCRM = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { leadId } = req.params;

    const result = await CRMService.syncLeadToCRMs(leadId, req.user);

    res.status(200).json({
      success: true,
      data: result,
      message: `Lead synced to ${result.synced} CRM(s)`
    });
  } catch (error) {
    next(error);
  }
};

// Bulk sync leads to CRMs
export const bulkSyncToCRM = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { leadIds } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'leadIds must be a non-empty array'
      });
    }

    const result = await CRMService.bulkSyncToCRMs(leadIds, req.user);

    res.status(200).json({
      success: true,
      data: result,
      message: `Successfully synced ${result.successful} leads to CRMs`
    });
  } catch (error) {
    next(error);
  }
};

// Get CRM sync status for a lead
export const getCRMSyncStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { leadId } = req.params;

    // This would typically check the actual CRM APIs for sync status
    // For now, we'll return the stored CRM data
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        leadId,
        crmData: lead.crmData,
        lastSynced: lead.updatedAt,
        syncStatus: lead.crmData ? 'synced' : 'not_synced'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Configure CRM integrations
export const configureCRM = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { crmType, config } = req.body;

    if (!crmType || !config) {
      return res.status(400).json({
        success: false,
        error: 'crmType and config are required'
      });
    }

    // Update user's CRM configuration
    const apiKeys = (req.user.apiKeys as any) || {};
    apiKeys[crmType] = config.apiKey || config.webhookUrl;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { apiKeys }
    });

    res.status(200).json({
      success: true,
      data: {
        crmType,
        configured: true
      },
      message: `${crmType} integration configured successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Get CRM configuration status
export const getCRMConfig = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const crmStatus = {
      hubspot: {
        configured: !!req.user.apiKeys?.hubspot,
        enabled: !!req.user.apiKeys?.hubspot
      },
      pipedrive: {
        configured: !!req.user.apiKeys?.pipedrive,
        enabled: !!req.user.apiKeys?.pipedrive
      },
      customCRM: {
        configured: !!req.user.apiKeys?.customCRM,
        enabled: !!req.user.apiKeys?.customCRM
      }
    };

    res.status(200).json({
      success: true,
      data: crmStatus
    });
  } catch (error) {
    next(error);
  }
};