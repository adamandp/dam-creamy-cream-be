import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Voucher } from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleVouchersOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleVouchersOrder.name);
  }

  async validate(
    tx: Prisma.TransactionClient,
    order: OrderInputDto,
  ): Promise<Voucher[] | []> {
    const method = 'validate';
    const voucherIds = order.voucherIds ?? [];

    this.logger.trace({
      method,
      message: `Starting voucher validation`,
    });

    if (!voucherIds.length) {
      this.logger.trace({
        method,
        message: '🫡 No vouchers applied, skipping validation',
      });
      return [];
    }

    const voucherData = await tx.voucher.findMany({
      where: { id: { in: voucherIds } },
    });

    const now = new Date();

    for (const id of voucherIds) {
      const voucher = voucherData.find((v) => v.id === id);

      if (!voucher) {
        this.logger.error({
          method,
          type: 'voucher-not-found',
          message: `❌ Voucher with ID ${id} not found `,
        });
        throw new NotFoundException(`Voucher not found or already gone 👻`);
      }

      if (voucher.endDate < now) {
        this.logger.trace({
          method,
          type: 'voucher-expired',
          message: `⏰ Voucher "${voucher.name}" expired `,
        });
        throw new ConflictException(`"${voucher.name}" is already expired 😬`);
      }

      this.logger.trace({
        method,
        status: 'success',
        message: `✅ Voucher ${id} validated `,
      });
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `All vouchers validated successfully`,
    });

    return voucherData;
  }
}
