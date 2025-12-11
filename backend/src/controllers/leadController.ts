import { Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { MockLead } from '../models/MockLead';
import { isConnected } from '../utils/database';
import { AuthRequest } from '../middleware/auth';
import { PredictiveService } from '../services/predictiveService';
import { CompetitiveService } from '../services/competitiveService';

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

    const LeadModel: any = isConnected ? Lead : MockLead;
    const leads = await LeadModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await LeadModel.countDocuments(query);

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
    const LeadModel: any = isConnected ? Lead : MockLead;
    const lead = await LeadModel.findById(req.params.id);

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

    const LeadModel: any = isConnected ? Lead : MockLead;
    const lead = await LeadModel.create(leadData);

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
    const LeadModel: any = isConnected ? Lead : MockLead;
    let lead = await LeadModel.findById(req.params.id);

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

    if (isConnected) {
      lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    } else {
      lead = await MockLead.findByIdAndUpdate(req.params.id, req.body, {});
    }

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
    const LeadModel: any = isConnected ? Lead : MockLead;
    const lead = await LeadModel.findById(req.params.id);

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

// Generate AI Leads (Google Gemini REST API)
export const generateLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const count = 5;
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    // Helper function for mock generation
    const generateMockLeads = async () => {
      const companies = ['TechCorp', 'InnovateInc', 'FutureSystems', 'CloudNine', 'DataFlow'];
      const names = ['John Smith', 'Sarah Jones', 'Mike Brown', 'Emily Davis', 'David Wilson'];
      const domains = ['tech.com', 'innovate.net', 'future.io', 'cloud.co', 'data.org'];

      const generatedLeads = [];
      for (let i = 0; i < count; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];

        const leadData = {
          user: req.user.id,
          companyName: `${company} ${Math.floor(Math.random() * 100)}`,
          contactName: name,
          email: `${name.toLowerCase().replace(' ', '.')}@${domain}`,
          status: 'new',
          priority: 'medium',
          source: 'ai_generated'
        };
        const LeadModel: any = isConnected ? Lead : MockLead;
        const lead = await LeadModel.create(leadData);
        generatedLeads.push(lead);
      }
      return generatedLeads;
    };

    if (!apiKey || apiKey.startsWith('AIza_your')) {
      console.log('No valid Google AI API key found, using mock generation');
      const leads = await generateMockLeads();
      return res.status(201).json({
        success: true,
        count: leads.length,
        data: leads,
        message: `Successfully generated ${count} Mock AI leads (Add Google AI Key for Real AI)`
      });
    }

    // Use Google Gemini REST API
    try {
      const { industry, location } = req.body;
      let prompt = `Generate ${count} realistic B2B sales leads in JSON format.`;

      if (industry) {
        prompt += ` The leads MUST be in the "${industry}" industry.`;
      }

      if (location) {
        prompt += ` The leads MUST be located in "${location}".`;
      }

      prompt += `
      Each lead should have: 
      - companyName
      - contactName
      - email (realistic business email)
      - phone
      - industry
      - location (City, Country)
      - companySize (e.g. "50-200 employees")
      - painPoints (array of 2-3 short business challenges)
      - salesPitch (1 sentence personalized hook)
      - score (Number 0-100 based on industry fit and completeness)
      - scoreReason (Short explanation for the score)

      Return ONLY a JSON array. Do not include markdown formatting like \`\`\`json.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Google Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      let text = (data as any).candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean up markdown if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      // Attempt to parse JSON
      let leadsData = [];
      try {
        // Find the array in the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          leadsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in response');
        }
      } catch (e) {
        console.error('Failed to parse AI response JSON', e);
        throw new Error('Invalid JSON format from AI');
      }

      if (!Array.isArray(leadsData) || leadsData.length === 0) {
        throw new Error('No valid data found in AI response');
      }

      const generatedLeads = [];
      for (const item of leadsData) {
        // Handle location if it comes as an object
        let locationStr = item.location;
        if (typeof item.location === 'object' && item.location !== null) {
          const city = item.location.city || item.location.City || '';
          const country = item.location.country || item.location.Country || '';
          locationStr = city && country ? `${city}, ${country}` : (city || country || 'Unknown Location');
        }

        const leadData = {
          user: req.user.id,
          companyName: item.companyName || 'Unknown Corp',
          contactName: item.contactName || 'Unknown Contact',
          email: item.email || 'unknown@example.com',
          phone: item.phone,
          status: 'new',
          priority: 'medium',
          source: 'ai_generated', // Matches schema enum
          industry: item.industry,
          location: locationStr,
          companySize: item.companySize,
          painPoints: item.painPoints,
          salesPitch: item.salesPitch,
          score: item.score || 50,
          scoreReason: item.scoreReason || 'AI generated lead'
        };

        const LeadModel: any = isConnected ? Lead : MockLead;
        const lead = await LeadModel.create(leadData);
        generatedLeads.push(lead);
      }

      return res.status(201).json({
        success: true,
        count: generatedLeads.length,
        data: generatedLeads,
        message: `Successfully generated ${generatedLeads.length} AI leads using Google Gemini`
      });

    } catch (apiError) {
      console.error('Google Gemini API failed, falling back to mock generation:', apiError);
      const leads = await generateMockLeads();
      return res.status(201).json({
        success: true,
        count: leads.length,
        data: leads,
        message: `Successfully generated ${leads.length} Mock AI leads (Fallback due to API error)`
      });
    }

  } catch (error) {
    next(error);
  }
};

// Draft Email
export const draftEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const LeadModel: any = isConnected ? Lead : MockLead;
    const lead = await LeadModel.findById(req.params.id);

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

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey || apiKey.startsWith('AIza_your')) {
      return res.status(200).json({
        success: true,
        data: {
          subject: `Partnership Opportunity: ${lead.companyName} + Your Company`,
          body: `Hi ${lead.contactName},\n\nI noticed that ${lead.companyName} is doing great work in the ${lead.industry} space.\n\nWe help companies like yours address ${lead.painPoints?.[0] || 'common challenges'}.\n\nBest,\n[Your Name]`
        },
        message: 'Mock email generated (Add Google AI Key for Real AI)'
      });
    }

    const prompt = `
    Write a personalized cold email to ${lead.contactName} at ${lead.companyName}.
    
    Context:
    - Industry: ${lead.industry}
    - Location: ${lead.location}
    - Pain Points: ${lead.painPoints?.join(', ') || 'general growth challenges'}
    - Sales Pitch: ${lead.salesPitch || 'We help businesses grow.'}
    
    The email should be professional, persuasive, and concise.
    
    Return ONLY a JSON object with "subject" and "body" fields. Do not include markdown formatting.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Google Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    let text = (data as any).candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean up markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let emailDraft;
    try {
      emailDraft = JSON.parse(text);
    } catch (e) {
      // Fallback if JSON parsing fails
      emailDraft = {
        subject: `Connecting with ${lead.companyName}`,
        body: text
      };
    }

    res.status(200).json({
      success: true,
      data: emailDraft
    });

  } catch (error) {
    next(error);
  }
};


// Get Top Priority Leads
export const getTopPriorityLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const LeadModel: any = isConnected ? Lead : MockLead;

    // In a real scenario we would filter by user and sort by nested field
    // MockLead might behave differently, so we fetch and sort in memory if needed for mock
    // But Mongoose supports dot notation sort
    const leads = await LeadModel.find({ user: req.user.id })
      .sort({ 'predictive.score': -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// Enrich Lead (Calculate Score)
export const enrichLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const LeadModel: any = isConnected ? Lead : MockLead;
    const lead = await LeadModel.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    // Manual enrichment trigger (simulating API call to Clearbit/PeopleDataLabs)
    // We update the enrichment fields with some mock data if empty
    if (!lead.enrichment?.companySize) {
      lead.enrichment = {
        companySize: '50-200 employees',
        funding: Math.random() > 0.5 ? 'Series B' : 'Seed',
        linkedinActivity: Math.random() > 0.5 ? 'High' : 'Low',
        webTraffic: 'Moderate'
      };
    }

    // Calculate Score
    const prediction = PredictiveService.scoreLead(lead);

    lead.predictive = prediction;
    lead.score = prediction.score; // Sync with legacy field if needed
    lead.scoreReason = prediction.reason;

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
      prediction
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeCompetitors = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const LeadModel: any = isConnected ? Lead : MockLead;
    const lead = await LeadModel.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const { text } = req.body;
    if (text) {
      const result = CompetitiveService.detectCompetitor(text);
      if (result) {
        lead.competitorInsights = {
          detectedCompetitor: result.name,
          lastActivity: new Date(),
          detectedTemplate: result.template,
          counterStrategy: result.strategy
        };
        await lead.save();
      }
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) { next(error); }
};
