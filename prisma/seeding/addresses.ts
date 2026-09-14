import { PrismaClient } from 'src/generated/prisma/client';

export async function seedAddresses(prisma: PrismaClient) {
  const dummyUser = await prisma.user.findUnique({
    where: { username: 'DummyUser' },
    select: { id: true },
  });

  await prisma.address.createMany({
    data: [
      {
        userId: dummyUser?.id as string,
        province: 'DKI Jakarta',
        city: 'Jakarta Pusat',
        subdistrict: 'Menteng',
        village: 'Menteng',
        postalCode: '10310',
        address: 'Jl. Menteng Raya No. 15, Menteng, Jakarta Pusat, DKI Jakarta',
        isPrimary: true,
        recipientName: 'John Doe',
        recipientPhoneNumber: '081234567890',
      },
      {
        userId: dummyUser?.id as string,
        province: 'Jawa Barat',
        city: 'Bandung',
        subdistrict: 'Bandung Kidul',
        village: 'Batununggal',
        postalCode: '40266',
        address: 'Jl. Batununggal No. 23, Bandung Kidul, Bandung, Jawa Barat',
        isPrimary: false,
        recipientName: 'Jane Smith',
        recipientPhoneNumber: '089876543210',
      },
    ],
  });

  const exampleUsers = await prisma.user.findMany({
    where: { username: { not: 'DummyUser' } },
    select: { id: true },
  });

  await prisma.address.createMany({
    data: exampleUsers.flatMap((user) => [
      {
        userId: user.id,
        province: 'dummyProvince 1',
        city: 'Dummy City 1',
        subdistrict: 'Dummy Subdistrict 1',
        village: 'Dummy Village 1',
        postalCode: '000000',
        address: 'Jl. Example Street 1',
        isPrimary: true,
        recipientName: 'DummyRecipientName 1',
        recipientPhoneNumber: '081234567890',
      },
      {
        userId: user.id,
        province: 'dummyProvince 2',
        city: 'Dummy City 2',
        subdistrict: 'Dummy Subdistrict 2',
        village: 'Dummy Village 2',
        postalCode: '000000',
        address: 'Jl. Example Street 2',
        isPrimary: true,
        recipientName: 'DummyRecipientName 2',
        recipientPhoneNumber: '081234567892',
      },
    ]),
  });

  console.log('Seeding addresses done');
}
