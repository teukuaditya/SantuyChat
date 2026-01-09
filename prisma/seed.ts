import { PrismaClient, RoleType } from '@prisma/client';
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter});

async function main() {
  const roles: RoleType[] = ['ADMIN', 'MEMBER', 'OWNER', 'USER'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { role },     
      create: { role },
      update: {},
    });
  }

  console.log('Success seeding roles.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
