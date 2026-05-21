import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@loraloop.com' },
    update: {},
    create: {
      email: 'admin@loraloop.com',
      name: 'Admin',
      passwordHash,
      emailVerified: true,
      provider: 'LOCAL',
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: 'my-organization' },
    update: {},
    create: {
      name: 'My Organization',
      slug: 'my-organization',
    },
  });

  await prisma.orgMember.upsert({
    where: { orgId_userId: { orgId: org.id, userId: user.id } },
    update: {},
    create: { orgId: org.id, userId: user.id, role: 'OWNER', accepted: true },
  });

  await prisma.subscription.upsert({
    where: { orgId: org.id },
    update: {},
    create: { orgId: org.id, plan: 'FREE', period: 'MONTHLY' },
  });

  console.log(`Seed complete`);
  console.log(`User: admin@loraloop.com / Admin123!`);
  console.log(`Org ID: ${org.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
