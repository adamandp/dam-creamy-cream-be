import { PrismaClient } from 'src/generated/prisma/client';
import { CheckOutDto } from 'src/model/orders/dto/checkout.dto';

export async function seedOrderItems(
  prisma: PrismaClient,
  checkoutData: (CheckOutDto & {
    order: CheckOutDto['order'] & {
      id: string;
    };
  })[],
) {
  await prisma.orderItem.createMany({
    data: checkoutData.flatMap((order) =>
      order.orderItems.map((item) => ({
        orderId: order.order.id,
        productId: item.productId,
        quantity: item.quantity,
        discountId: item.discountId,
        price: 0,
        finalPrice: 0,
      })),
    ),
  });

  console.log('Seeding order items done');
}
