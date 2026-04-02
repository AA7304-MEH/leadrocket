import { prisma } from '../utils/prisma';
import { User } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LeadGenerationData {
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  linkedinUrl?: string;
  confidence?: number;
  intentSignals?: string[];
  technologies?: string[];
}

export class LeadGenerationService {
  private static genAI: GoogleGenerativeAI | null = null;

  // Initialize Google AI if API key is available
  private static initializeGoogleAI(): void {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (apiKey && !this.genAI) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  // Generate leads using Google Gemini AI or fallback to simulation
  static async generateLeads(user: User, count: number = 5): Promise<LeadGenerationData[]> {
    this.initializeGoogleAI();

    // Use Google AI if available, otherwise fallback to simulation
    if (this.genAI) {
      try {
        return await this.generateLeadsWithAI(count);
      } catch (error) {
        console.warn('Google AI generation failed, falling back to simulation:', error);
        return await this.generateSimulatedLeads(count);
      }
    } else {
      return await this.generateSimulatedLeads(count);
    }
  }

  // Generate leads using Google Gemini AI
  private static async generateLeadsWithAI(count: number): Promise<LeadGenerationData[]> {
    if (!this.genAI) {
      throw new Error('Google AI not initialized');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Generate ${count} realistic B2B leads for a lead generation SaaS platform.
      Each lead should include: company name, contact name, email, phone, website, industry, company size, location, LinkedIn URL, confidence score (60-100), intent signals, and technologies used.

      Return the response as a valid JSON array of objects with this exact structure:
      [
        {
          "companyName": "Tech Solutions Inc",
          "contactName": "John Smith",
          "email": "john@techsolutions.com",
          "phone": "(555) 123-4567",
          "website": "https://www.techsolutions.com",
          "industry": "Technology",
          "companySize": "51-200",
          "location": "San Francisco, CA",
          "linkedinUrl": "https://linkedin.com/company/tech-solutions-inc",
          "confidence": 85,
          "intentSignals": ["Looking for new tools", "Technology upgrade"],
          "technologies": ["React", "Node.js", "AWS"]
        }
      ]

      Make the data realistic and varied. Use different industries, company sizes, and locations.
      Ensure all fields are filled and the JSON is valid.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from the response (remove markdown formatting if present)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const leads: LeadGenerationData[] = JSON.parse(jsonMatch[0]);

      // Validate and clean the data
      return leads.slice(0, count).map(lead => ({
        ...lead,
        confidence: Math.min(100, Math.max(60, lead.confidence || 75)),
        intentSignals: lead.intentSignals || ['Looking for new tools'],
        technologies: lead.technologies || ['React', 'Node.js']
      }));
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }
  }

  // Fallback simulated lead generation
  private static async generateSimulatedLeads(count: number): Promise<LeadGenerationData[]> {
    const industries = [
      'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
      'Real Estate', 'Manufacturing', 'Consulting', 'Marketing', 'Legal'
    ];

    const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

    const locations = [
      'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA',
      'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Miami, FL', 'Atlanta, GA'
    ];

    const technologies = [
      'React', 'Node.js', 'Python', 'AWS', 'Shopify', 'Salesforce',
      'HubSpot', 'Slack', 'Microsoft 365', 'Google Workspace'
    ];

    const intentSignals = [
      'Looking for new tools', 'Expanding team', 'Technology upgrade',
      'Digital transformation', 'Cost optimization', 'Growth phase'
    ];

    const leads: LeadGenerationData[] = [];

    for (let i = 0; i < count; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const companyName = this.generateCompanyName(industry);

      leads.push({
        companyName,
        contactName: this.generateContactName(),
        email: this.generateEmail(companyName),
        phone: this.generatePhone(),
        website: this.generateWebsite(companyName),
        industry,
        companySize: companySizes[Math.floor(Math.random() * companySizes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        linkedinUrl: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100% confidence
        intentSignals: intentSignals.slice(0, Math.floor(Math.random() * 3) + 1),
        technologies: technologies.slice(0, Math.floor(Math.random() * 4) + 1)
      });
    }

    return leads;
  }

  // Generate realistic company names based on industry
  private static generateCompanyName(industry: string): string {
    const prefixes = ['Tech', 'Data', 'Cloud', 'Digital', 'Smart', 'Next', 'Pro', 'Global', 'Advanced'];
    const suffixes = ['Solutions', 'Systems', 'Corp', 'Inc', 'LLC', 'Group', 'Partners', 'Ventures'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix} ${industry} ${suffix}`;
  }

  private static generateContactName(): string {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  private static generateEmail(companyName: string): string {
    const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];

    return `contact@${cleanCompany}.${domains[Math.floor(Math.random() * domains.length)]}`;
  }

  private static generatePhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;

    return `(${areaCode}) ${exchange}-${number}`;
  }

  private static generateWebsite(companyName: string): string {
    const cleanCompany = companyName.toLowerCase().replace(/\s+/g, '');
    const tlds = ['.com', '.net', '.io', '.co', '.tech'];

    return `https://www.${cleanCompany}${tlds[Math.floor(Math.random() * tlds.length)]}`;
  }

  // Save generated leads to database
  static async saveGeneratedLeads(user: User, leads: LeadGenerationData[]): Promise<any[]> {
    const savedLeads = [];

    for (const leadData of leads) {
      const lead = await prisma.lead.create({
        data: {
          userId: user.id,
          ...leadData as any, // Cast to any to bypass strict type checks for now, or map fields explicitly
          // Mapping explicit fields to be safe if types differ
          company: leadData.companyName,
          name: leadData.contactName || 'Unknown',
          email: leadData.email || '',
          phone: leadData.phone,
          industry: leadData.industry,
          website: leadData.website,
          location: leadData.location,
          source: 'ai_generated',
          status: 'new',
          priority: this.calculatePriority(leadData.confidence || 0),
          score: leadData.confidence,
          // Store extra data in JSON fields if needed, or map to schema columns
          // Assuming schema has flat columns for these or we put them in metadata
        }
      });

      savedLeads.push(lead);

      // Update user usage
      await prisma.user.update({
        where: { id: user.id },
        data: {
          leadsThisMonth: { increment: 1 },
          leadsGenerated: { increment: 1 }
        }
      });
    }

    return savedLeads;
  }

  private static calculatePriority(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 85) return 'high';
    if (confidence >= 70) return 'medium';
    return 'low';
  }

  // Get lead statistics for dashboard
  static async getLeadStats(user: User) {
    const totalLeads = await prisma.lead.count({ where: { userId: user.id } });
    const newLeads = await prisma.lead.count({ where: { userId: user.id, status: 'new' } });
    const qualifiedLeads = await prisma.lead.count({ where: { userId: user.id, status: 'qualified' } });
    const convertedLeads = await prisma.lead.count({ where: { userId: user.id, status: 'converted' } });

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    };
  }
}