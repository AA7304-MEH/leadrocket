/**
 * Mock User Store - File-based JSON storage for development
 * This bypasses database issues entirely
 */
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(__dirname, '../../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

export interface MockUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    subscriptionPlan: string;
    subscriptionStatus: string;
    leadsGenerated: number;
    leadsThisMonth: number;
    monthlyLimit: number;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
}

function readUsers(): MockUser[] {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeUsers(users: MockUser[]): void {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export const mockUserStore = {
    async findByEmail(email: string): Promise<MockUser | null> {
        const users = readUsers();
        return users.find(u => u.email === email) || null;
    },

    async findById(id: string): Promise<MockUser | null> {
        const users = readUsers();
        return users.find(u => u.id === id) || null;
    },

    async create(data: { name: string; email: string; password: string }): Promise<MockUser> {
        const users = readUsers();

        // Check if user exists
        if (users.find(u => u.email === data.email)) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser: MockUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: 'user',
            subscriptionPlan: 'pro',
            subscriptionStatus: 'trial',
            leadsGenerated: 0,
            leadsThisMonth: 0,
            monthlyLimit: 50,
            isActive: true,
            lastLogin: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);
        writeUsers(users);
        return newUser;
    },

    async updateLastLogin(id: string): Promise<void> {
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            users[userIndex].updatedAt = new Date().toISOString();
            writeUsers(users);
        }
    },

    async verifyPassword(user: MockUser, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    },

    async findAll(): Promise<MockUser[]> {
        return readUsers();
    },

    async count(): Promise<number> {
        return readUsers().length;
    },

    async update(id: string, data: Partial<MockUser>): Promise<MockUser | null> {
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return null;

        users[userIndex] = { ...users[userIndex], ...data, updatedAt: new Date().toISOString() };
        writeUsers(users);
        return users[userIndex];
    },

    async delete(id: string): Promise<boolean> {
        const users = readUsers();
        const filtered = users.filter(u => u.id !== id);
        if (filtered.length === users.length) return false;
        writeUsers(filtered);
        return true;
    }
};

export default mockUserStore;
