import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleOrder.name);
  }

  async create(
    tx: Prisma.TransactionClient,
    userId: string,
    { addressId }: OrderInputDto,
    totalDiscount: number,
    totalPrice: number,
    orderPrice: number,
  ): Promise<string> {
    const method = 'create';

    this.logger.info({
      method,
      message: `Starting creating order`,
    });

    try {
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          discountAmount: totalDiscount,
          totalPrice,
          finalPrice: orderPrice,
        },
        select: { id: true },
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Order ${order.id} successfully created for user ${userId}`,
      });

      return order.id;
    } catch (error) {
      this.logger.error({
        method,
        type: 'order-creation-failed',
        message: `❌ Failed to create order for user ${userId}`,
      });
      throw error;
    }
  }
}
