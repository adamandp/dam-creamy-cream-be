import { PrismaClient } from 'src/generated/prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  const dummyCategories = [
    { name: 'Cake' },
    { name: 'Classic' },
    { name: 'Cornetto' },
    { name: 'Fruit-Based' },
    { name: 'Gelato' },
    { name: 'Low Calorie' },
    { name: 'Milkshake' },
    { name: 'Vegan' },
  ];

  await prisma.category.createMany({
    data: dummyCategories.map((d) => ({
      name: d.name,
      isActive: true,
    })),
  });

  console.log('Seeding categories done');
}
