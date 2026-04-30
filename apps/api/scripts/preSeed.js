const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function preSeed() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test Agent',
        password: 'password_here'
      }
    });
  }
  let lead = await prisma.lead.findFirst({ where: { userId: user.id } });
  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        userId: user.id,
        contactName: 'John Doe',
        companyName: 'Acme Corp',
        email: 'john@acme.com',
        status: 'new',
        source: 'manual',
        priority: 'high'
      }
    });
  }
}
preSeed().catch(console.error).finally(() => prisma.$disconnect());
