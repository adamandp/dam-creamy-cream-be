import { OrderStatus, PrismaClient } from 'src/generated/prisma/client';
import { CheckOutDto } from 'src/model/orders/dto/checkout.dto';

const couriers = [
  'jne',
  'sicepat',
  'ide',
  'sap',
  'jnt',
  'ninja',
  'tiki',
  'lion',
  'anteraja',
  'pos',
  'ncs',
  'rex',
  'rpx',
  'sentral',
  'star',
  'wahana',
  'dse',
];

const paymentMethods = [
  'gopay',
  'ovo',
  'dana',
  'shopeepay',
  'linkaja',
  'isaku',
  'sakuku',
  'astra_pay',
  'bca',
  'mandiri',
  'bni',
  'bri',
  'cimb_niaga',
  'permata',
  'danamon',
  'btn',
  'bsi',
  'ocbc',
  'maybank',
  'panin',
  'bank_jago',
  'seabank',
  'neo_bank',
];

export async function seedOrders(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    include: {
      addresses: true,
      userVouchers: true,
    },
  });

  const products = await prisma.product.findMany({
    include: {
      productDiscounts: true,
    },
  });

  const checkoutData: CheckOutDto[] = users.map((user) => ({
    order: {
      userId: user.id,
      addressId: user.addresses[Math.floor(Math.random() * 2)].id,
      voucherIds: user.userVouchers.map((v) => v.voucherId),
    },
    orderItems: Array.from({
      length: Math.floor(Math.random() * 5) + 1,
    }).map(() => {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      return {
        productId: randomProduct.id,
        quantity: Math.floor(Math.random() * 10) + 1,
        discountId: randomProduct.productDiscounts?.discountId,
      };
    }),
    shipment: {
      courier: couriers[Math.floor(Math.random() * couriers.length)],
      service: 'REG',
      description: 'Reguler',
      cost: Math.floor(Math.random() * 100000),
      estimated: new Date(),
    },
    payment: {
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    },
  }));

  const orders = await prisma.order.createManyAndReturn({
    data: checkoutData.map((checkout) => ({
      userId: checkout.order.userId,
      addressId: checkout.order.addressId,
      voucherAmount: 0,
      discountAmount: 0,
      totalPrice: 0,
      finalPrice: 0,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  });

  const checkoutDataMerged = checkoutData.map((checkout, index) => ({
    ...checkout,
    order: {
      ...checkout.order,
      id: orders[index].id,
    },
  }));

  checkoutDataMerged.map((c) => ({
    ss: c.order.id,
  }));

  console.log('Seeding orders done');

  return checkoutDataMerged;
  // return checkoutData;
}
