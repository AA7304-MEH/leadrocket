import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// In-memory store
// In-memory store
const users: any[] = [
    {
        _id: 'default-user-id',
        name: 'Demo User',
        email: 'demo@example.com',
        password: '$2b$10$EpvFhFcJvnjutBApmqKL3uv3uFR4CnEEHBuAuQSqrXLgHuuM/J1n6', // hash for 'password'
        role: 'user',
        subscription: {
            plan: 'pro',
            status: 'active',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        },
        profile: {},
        settings: {
            emailNotifications: true,
            weeklyReports: true,
            timezone: 'UTC'
        },
        usage: {
            leadsGenerated: 0,
            leadsThisMonth: 0,
            monthlyLimit: 50
        },
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export class MockUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    subscription: any;
    profile: any;
    settings: any;
    usage: any;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: any) {
        this._id = data._id || Math.random().toString(36).substring(7);
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'user';
        this.subscription = data.subscription || {
            plan: 'pro',
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        };
        this.profile = data.profile || {};
        this.settings = data.settings || {
            emailNotifications: true,
            weeklyReports: true,
            timezone: 'UTC'
        };
        this.usage = data.usage || {
            leadsGenerated: 0,
            leadsThisMonth: 0,
            monthlyLimit: 50
        };
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.lastLogin = data.lastLogin || new Date();
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    static async findOne(query: any) {
        const user = users.find(u => {
            for (const key in query) {
                if (u[key] !== query[key]) return false;
            }
            return true;
        });

        if (!user) return null;

        // Return a MockUser instance with methods
        const userInstance = new MockUser(user);
        // Add select method for chaining
        (userInstance as any).select = function () { return this; };
        return userInstance;
    }

    static async findById(id: string) {
        const user = users.find(u => u._id === id);
        return user ? new MockUser(user) : null;
    }

    static async create(data: any) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser = {
            ...data,
            password: hashedPassword,
            _id: Math.random().toString(36).substring(7),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        users.push(newUser);
        return new MockUser(newUser);
    }

    async matchPassword(enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
    }

    getSignedJwtToken(): string {
        return jwt.sign(
            { id: this._id, email: this.email },
            (process.env.JWT_SECRET || 'secret') as string,
            {
                expiresIn: process.env.JWT_EXPIRE || '7d'
            } as any
        );
    }

    getRefreshToken(): string {
        return jwt.sign(
            { id: this._id, email: this.email },
            process.env.JWT_REFRESH_SECRET || 'refreshsecret',
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
            } as any
        );
    }

    async updateLastLogin(): Promise<void> {
        this.lastLogin = new Date();
        // Update in store
        const index = users.findIndex(u => u._id === this._id);
        if (index !== -1) {
            users[index].lastLogin = this.lastLogin;
        }
    }
}
