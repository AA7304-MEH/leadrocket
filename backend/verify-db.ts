import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    try {
        const count = await prisma.user.count();
        console.log(`Successfully connected! User count: ${count}`);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
