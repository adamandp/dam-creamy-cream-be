import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleOrderVouchers {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleOrderVouchers.name);
  }

  async create(
    tx: Prisma.TransactionClient,
    orderId: string,
    order: OrderInputDto,
  ): Promise<void> {
    const method = 'create';
    const voucherIds = order.voucherIds ?? [];

    if (!voucherIds.length) {
      this.logger.info({
        method,
        message: `🫡 No vouchers to link for order ${orderId}, skipping`,
      });
      return;
    }

    this.logger.info({
      method,
      message: `🔗 Linking ${voucherIds.length} vouchers to order ${orderId}`,
      voucherIds,
    });

    try {
      await tx.orderVoucher.createMany({
        data: voucherIds.map((id) => ({ orderId, voucherId: id })),
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Successfully linked vouchers to order ${orderId}`,
      });
    } catch (error) {
      this.logger.error({
        method,
        type: 'order-voucher-link-failed',
        message: `❌ Failed to link vouchers to order ${orderId}`,
        error: error,
      });
      throw error;
    }
  }
}
