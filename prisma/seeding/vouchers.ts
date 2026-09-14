import {
  PrismaClient,
  VoucherGroup,
  VoucherType,
} from 'src/generated/prisma/client';

export async function seedVouchers(prisma: PrismaClient) {
  await prisma.voucher.createMany({
    data: [
      {
        name: 'New Year 20% Off',
        code: 'PROMO20',
        type: VoucherType.PERCENTAGE,
        group: VoucherGroup.CHECKOUT,
        value: 20,
        productId: null,
        quantity: 0,
        minimumPurchase: 10000,
        isActive: true,
        maxRedeemed: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        name: 'Flat 50K Discount',
        code: 'SAVE50',
        description: 'Get a Rp50000 discount on your order.',
        type: VoucherType.FIXED,
        group: VoucherGroup.CHECKOUT,
        value: 50000,
        productId: null,
        quantity: 0,
        minimumPurchase: 25,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
        maxRedeemed: 1,
      },
    ],
  });

  console.log('Seeding vouchers done');
}
