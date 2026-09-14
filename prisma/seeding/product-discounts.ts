import { PrismaClient } from 'src/generated/prisma/client';

export async function seedProductDiscount(prisma: PrismaClient) {
  const products = await prisma.product.findMany();
  const discounts = await prisma.discount.findMany();

  await prisma.productDiscount.createMany({
    data: Array.from({ length: 8 }).map((_, index) => ({
      productId: products[index % products.length].id,
      discountId: discounts[index % discounts.length].id,
      isActive: Math.random() > 0.2,
    })),
  });

  console.log('Seeding product discounts done');
}
