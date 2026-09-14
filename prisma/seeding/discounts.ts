import { DiscountType, PrismaClient } from 'src/generated/prisma/client';

export async function seedDiscounts(prisma: PrismaClient) {
  const data = [
    {
      name: '10% Off',
      discountType: DiscountType.PERCENTAGE,
      value: 10,
      maxApplied: 1,
      maxRedeemed: 1000,
      redeemedCount: 0,
      description: '10% discount for all products during New Year campaign',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-10'),
    },
    {
      name: 'Save Rp5000',
      discountType: DiscountType.FIXED,
      value: 5000,
      maxApplied: 1,
      maxRedeemed: 500,
      redeemedCount: 0,
      description: 'Flat discount of 50,000 for selected purchases',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-12-28'),
    },
  ];

  await prisma.discount.createMany({
    data,
  });

  console.log('Seeding discounts done');
}
