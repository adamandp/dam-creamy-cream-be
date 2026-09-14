import { PrismaClient } from 'src/generated/prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  await prisma.role.createMany({
    data: [
      {
        name: 'customer',
      },
      {
        name: 'admin',
      },
      {
        name: 'super-admin',
      },
    ],
  });
  console.log('Seeding role done');
}
