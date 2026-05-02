import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { PaymentInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandlePaymentOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandlePaymentOrder.name);
  }

  async create(
    tx: Prisma.TransactionClient,
    orderId: string,
    payment: PaymentInputDto,
    orderPrice: number,
  ): Promise<void> {
    const method = 'createPayment';

    this.logger.info({
      method,
      message: `creating payment for order ${orderId}`,
    });

    try {
      await tx.payment.create({
        data: {
          orderId,
          ...payment,
          amount: orderPrice,
        },
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Payment record created for order ${orderId}`,
      });
    } catch (error) {
      this.logger.error({
        method,
        type: 'payment-creation-failed',
        message: `❌ Failed to create payment for order ${orderId}`,
        error: error,
      });
      throw error;
    }
  }
}
