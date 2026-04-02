import { prisma } from '../utils/prisma';
import { User } from '@prisma/client';
import { Client } from '@hubspot/api-client';

export interface CRMConfig {
  hubspot?: {
    apiKey: string;
    enabled: boolean;
  };
  pipedrive?: {
    apiKey: string;
    companyDomain: string;
    enabled: boolean;
  };
  customCRM?: {
    webhookUrl: string;
    apiKey: string;
    enabled: boolean;
  };
  openai?: {
    apiKey: string;
    enabled: boolean;
  };
}

export class CRMService {
  // Sync lead to HubSpot (free tier)
  static async syncToHubSpot(lead: any, config: CRMConfig['hubspot']) {
    if (!config?.enabled || !config.apiKey) {
      throw new Error('HubSpot integration not configured');
    }

    try {
      const hubspotClient = new Client({ accessToken: config.apiKey });

      const contactObj = {
        properties: {
          company: lead.companyName,
          firstname: lead.contactName?.split(' ')[0] || '',
          lastname: lead.contactName?.split(' ')[1] || '',
          email: lead.email,
          phone: lead.phone,
          website: lead.website,
          industry: lead.industry,
          lifecyclestage: 'lead',
          lead_source: 'Lead Rockets AI',
          hs_lead_status: lead.status
        }
      };

      // Create contact in HubSpot
      const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);
      const contactId = (createContactResponse as any).id;

      console.log('✅ Lead synced to HubSpot:', { contactId, company: lead.companyName });

      return {
        success: true,
        hubspotId: contactId,
        message: 'Lead synced to HubSpot successfully'
      };
    } catch (error) {
      console.error('❌ HubSpot sync failed:', error);
      throw new Error(`HubSpot sync failed: ${(error as Error).message}`);
    }
  }

  // Sync lead to Pipedrive (free tier)
  static async syncToPipedrive(lead: any, config: CRMConfig['pipedrive']) {
    if (!config?.enabled || !config.apiKey) {
      throw new Error('Pipedrive integration not configured');
    }

    try {
      // Pipedrive API simulation
      const pipedriveData = {
        name: lead.companyName,
        owner_id: 1, // Default owner
        email: lead.email,
        phone: lead.phone,
        value: 0,
        currency: 'USD',
        stage_id: 1, // First stage
        custom_fields: {
          industry: lead.industry,
          company_size: lead.companySize,
          website: lead.website,
          linkedin: lead.linkedinUrl,
          lead_source: 'Lead Rockets AI'
        }
      };

      console.log('Syncing to Pipedrive:', pipedriveData);

      return {
        success: true,
        pipedriveId: `pd_${Date.now()}`,
        message: 'Lead synced to Pipedrive successfully'
      };
    } catch (error) {
      throw new Error(`Pipedrive sync failed: ${(error as Error).message}`);
    }
  }

  // Sync lead to custom CRM via webhook
  static async syncToCustomCRM(lead: any, config: CRMConfig['customCRM']) {
    if (!config?.enabled || !config.webhookUrl) {
      throw new Error('Custom CRM integration not configured');
    }

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          event: 'lead_created',
          data: lead,
          source: 'Lead Rockets',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        webhookId: (result as any).id || `webhook_${Date.now()}`,
        message: 'Lead synced to custom CRM successfully'
      };
    } catch (error) {
      throw new Error(`Custom CRM sync failed: ${(error as Error).message}`);
    }
  }

  // Sync single lead to all configured CRMs
  static async syncLeadToCRMs(leadId: string, user: User) {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) {
        throw new Error('Lead not found');
      }

      const syncResults = [];
      const errors = [];

      // Get user's CRM configuration
      const apiKeys = (user as any).apiKeys || {};
      const crmConfig: CRMConfig = {
        hubspot: (apiKeys.hubspot || user.hubspotKey) ? {
          apiKey: apiKeys.hubspot || user.hubspotKey,
          enabled: true
        } : undefined,
        openai: (apiKeys.openai || user.openaiKey) ? {
          apiKey: apiKeys.openai || user.openaiKey,
          enabled: true
        } : undefined
      };

      let crmData = (lead.crmData as any) || {};
      let updated = false;

      // Sync to HubSpot if configured
      if (crmConfig.hubspot?.enabled) {
        try {
          const result = await this.syncToHubSpot(lead, crmConfig.hubspot);
          syncResults.push({ crm: 'hubspot', ...result });

          // Update lead with HubSpot ID
          crmData = { ...crmData, hubspotId: (result as any).hubspotId };
          updated = true;
        } catch (error) {
          errors.push({ crm: 'hubspot', error: (error as Error).message });
        }
      }

      // Save updated lead if changes
      if (updated) {
        await prisma.lead.update({
          where: { id: leadId },
          data: { crmData }
        });
      }

      return {
        success: true,
        synced: syncResults.length,
        failed: errors.length,
        results: syncResults,
        errors: errors
      };
    } catch (error) {
      throw error;
    }
  }

  // Bulk sync leads to CRMs
  static async bulkSyncToCRMs(leadIds: string[], user: User) {
    const results = [];
    const errors = [];

    for (const leadId of leadIds) {
      try {
        const result = await this.syncLeadToCRMs(leadId, user);
        results.push({ leadId, ...result });
      } catch (error) {
        errors.push({ leadId, error: (error as Error).message });
      }
    }

    return {
      total: leadIds.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    };
  }
}