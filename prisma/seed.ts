import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import {
  seedRoles,
  seedUsers,
  seedAddresses,
  seedProducts,
  seedCategories,
  seedCartItems,
  seedVouchers,
  seedDiscounts,
  seedProductDiscount,
  seedOrders,
  seedUserVouchers,
  seedOrderItems,
  seedShipments,
  seedPayments,
  seedReviews,
} from './seeding';
import { seedProductInformations } from './seeding/product-informations';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function deleteData() {
  // orders section
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  // promo section
  await prisma.userVoucher.deleteMany();
  await prisma.productDiscount.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.discount.deleteMany();

  // products section
  await prisma.cartItem.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.productInformation.deleteMany();

  // users section
  await prisma.userToken.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('Deleting existing data done');
}

async function main() {
  await deleteData();

  // users section

  await seedRoles(prisma);
  await seedUsers(prisma);
  await seedAddresses(prisma);

  // products section
  await seedCategories(prisma);
  await seedProducts(prisma);
  await seedProductInformations(prisma);
  await seedCartItems(prisma);

  // promo section
  await seedVouchers(prisma);
  await seedDiscounts(prisma);
  await seedProductDiscount(prisma);
  await seedUserVouchers(prisma);

  // orders section
  const checkoutData = await seedOrders(prisma);
  await seedOrderItems(prisma, checkoutData);
  await seedShipments(prisma, checkoutData);
  await seedPayments(prisma, checkoutData);
  await seedReviews(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
