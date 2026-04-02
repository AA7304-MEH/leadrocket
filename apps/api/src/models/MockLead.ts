// In-memory store
const leads: any[] = [];

export class MockLead {
    _id: string;
    user: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    website: string;
    industry: string;
    companySize: string;
    location: string;
    linkedinUrl: string;
    source: string;
    status: string;
    priority: string;
    tags: string[];
    notes: string;
    metadata: any;
    crmData: any;
    outreach: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: any) {
        this._id = data._id || Math.random().toString(36).substring(7);
        this.user = data.user;
        this.companyName = data.companyName;
        this.contactName = data.contactName;
        this.email = data.email;
        this.phone = data.phone;
        this.website = data.website;
        this.industry = data.industry;
        this.companySize = data.companySize;
        this.location = data.location;
        this.linkedinUrl = data.linkedinUrl;
        this.source = data.source || 'manual';
        this.status = data.status || 'new';
        this.priority = data.priority || 'medium';
        this.tags = data.tags || [];
        this.notes = data.notes;
        this.metadata = data.metadata || {};
        this.crmData = data.crmData || {};
        this.outreach = data.outreach || {
            emailsSent: 0,
            emailsOpened: 0,
            emailsClicked: 0,
            responses: 0
        };
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    static find(query: any) {
        let filtered = leads.filter(lead => {
            for (const key in query) {
                if (key === '$text') {
                    // Simple text search mock
                    const search = query.$text.$search.toLowerCase();
                    return (
                        lead.companyName?.toLowerCase().includes(search) ||
                        lead.contactName?.toLowerCase().includes(search) ||
                        lead.email?.toLowerCase().includes(search)
                    );
                }
                if (lead[key] !== query[key]) return false;
            }
            return true;
        });

        // Mock chainable methods
        const chain = {
            sort: (sort: any) => {
                // Simple mock sort (only handles createdAt: -1)
                if (sort.createdAt === -1) {
                    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                }
                return chain;
            },
            limit: (limit: number) => {
                filtered = filtered.slice(0, limit);
                return chain;
            },
            skip: (skip: number) => {
                // Since we already sliced in limit (which is wrong order but simple mock), 
                // let's just return chain. In real chain, skip happens before limit usually.
                // For mock, let's just ignore complex chaining for now or implement better if needed.
                return chain;
            },
            then: (resolve: Function) => resolve(filtered.map(l => new MockLead(l)))
        };

        return chain;
    }

    static async countDocuments(query: any) {
        return leads.filter(lead => {
            for (const key in query) {
                if (key === '$text') continue; // Skip text search for count in simple mock
                if (lead[key] !== query[key]) return false;
            }
            return true;
        }).length;
    }

    static async findById(id: string) {
        const lead = leads.find(l => l._id === id);
        return lead ? new MockLead(lead) : null;
    }

    static async create(data: any) {
        const newLead = {
            ...data,
            _id: Math.random().toString(36).substring(7),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        leads.push(newLead);
        return new MockLead(newLead);
    }

    static async findByIdAndUpdate(id: string, data: any, options: any) {
        const index = leads.findIndex(l => l._id === id);
        if (index === -1) return null;

        leads[index] = { ...leads[index], ...data, updatedAt: new Date() };
        return new MockLead(leads[index]);
    }

    async deleteOne() {
        const index = leads.findIndex(l => l._id === this._id);
        if (index !== -1) {
            leads.splice(index, 1);
        }
    }
}
