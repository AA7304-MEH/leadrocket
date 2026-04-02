export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    subscription: {
        plan: 'pro' | 'enterprise';
        status: 'active' | 'cancelled' | 'expired' | 'trial';
    };
}

export interface Lead {
    _id: string;
    companyName: string;
    contactName?: string;
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    subscription: {
        plan: 'pro' | 'enterprise';
        status: 'active' | 'cancelled' | 'expired' | 'trial';
    };
}

export interface Lead {
    _id: string;
    companyName: string;
    contactName?: string;
    email?: string;
    phone?: string;
    industry?: string;
    location?: string;
    companySize?: string;
    painPoints?: string[];
    salesPitch?: string;
    score?: number;
    scoreReason?: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    source: string;
    createdAt: string;
    updatedAt: string;
    enrichment?: {
        companySize?: string;
        funding?: string;
        linkedinActivity?: string;
        webTraffic?: string;
    };
    predictive?: {
        score: number;
        reason: string;
        probability: 'Low' | 'Medium' | 'High';
    };
    competitorInsights?: {
        detectedCompetitor?: string;
        lastActivity?: string;
        detectedTemplate?: string;
        counterStrategy?: string;
    };
}
