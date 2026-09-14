import { PaymentStatus, PrismaClient } from 'src/generated/prisma/client';
import { CheckOutDto } from 'src/model/orders/dto/checkout.dto';

export async function seedPayments(
  prisma: PrismaClient,
  checkoutData: (CheckOutDto & {
    order: CheckOutDto['order'] & {
      id: string;
    };
  })[],
) {
  await prisma.payment.createMany({
    data: checkoutData.map((data) => ({
      orderId: data.order.id,
      method: '',
      methodType: '',
      amount: 0,
      status: PaymentStatus.PENDING,
      transactionCode: '',
      transactionId: crypto.randomUUID(),
    })),
  });
  console.log('Seeding payments done');
}
