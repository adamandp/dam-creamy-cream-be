import { PrismaClient } from 'src/generated/prisma/client';
import { CheckOutDto } from 'src/model/orders/dto/checkout.dto';

export async function seedShipments(
  prisma: PrismaClient,
  checkoutData: (CheckOutDto & {
    order: CheckOutDto['order'] & {
      id: string;
    };
  })[],
) {
  await prisma.shipment.createMany({
    data: checkoutData.map((order) => ({
      orderId: order.order.id,
      courier: order.shipment.courier,
      service: order.shipment.service,
      description: order.shipment.description,
      cost: order.shipment.cost,
      estimated: order.shipment.estimated,
    })),
  });
  console.log('Seeding shipments done');
}
