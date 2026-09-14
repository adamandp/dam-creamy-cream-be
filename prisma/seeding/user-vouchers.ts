import { PrismaClient } from 'src/generated/prisma/client';

export async function seedUserVouchers(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  const vouchers = await prisma.voucher.findMany({
    where: {
      isActive: true,
    },
  });

  const userVouchers = users.flatMap((user) => {
    const hasVoucher = Math.random() > 0.4;

    if (!hasVoucher) return [];

    const voucherCount = Math.floor(Math.random() * vouchers.length) + 1;

    const shuffledVouchers = [...vouchers].sort(() => Math.random() - 0.5);

    return shuffledVouchers.slice(0, voucherCount).map((voucher) => ({
      userId: user.id,
      voucherId: voucher.id,
      claimedAt: new Date(),
      expiredAt: new Date(),
    }));
  });

  await prisma.userVoucher.createMany({
    data: userVouchers,
  });

  console.log('Seeding user vouchers done');
}
