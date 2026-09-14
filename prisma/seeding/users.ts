import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'src/generated/prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'super-admin' },
    select: { id: true },
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
    select: { id: true },
  });

  const customerRole = await prisma.role.findUnique({
    where: { name: 'customer' },
    select: { id: true },
  });

  await Promise.all(
    Array.from({ length: 100 }, (_, index) => {
      return prisma.user.create({
        data: {
          username: `examplecustomer${index + 1}`,
          fullName: `example customer ${index + 1}`,
          password: bcrypt.hashSync('@Password123', 10),
          email: `examplecustomer${index + 1}@gmail.com`,
          roles: { connect: { id: customerRole?.id } },
          cart: { create: {} },
        },
      });
    }),
  );

  await prisma.user.create({
    data: {
      username: `DummyUser`,
      fullName: `Dummy User`,
      password: bcrypt.hashSync('@Password123', 10),
      email: `dummyuser@gmail.com`,
      roles: { connect: { id: customerRole?.id } },
      cart: { create: {} },
    },
  });

  await prisma.user.create({
    data: {
      username: `DummyAdmin`,
      fullName: `Dummy Admin`,
      password: bcrypt.hashSync('@Password123', 10),
      email: `dummyadmin@gmail.com`,
      roles: { connect: { id: adminRole?.id } },
      cart: { create: {} },
    },
  });

  await prisma.user.create({
    data: {
      username: `DummySuperAdmin`,
      fullName: `Dummy Super Admin`,
      password: bcrypt.hashSync('@Password123', 10),
      email: `dummysuperadmin@gmail.com`,
      roles: { connect: { id: superAdminRole?.id } },
      cart: { create: {} },
    },
  });

  console.log('Seeding users done');
}
