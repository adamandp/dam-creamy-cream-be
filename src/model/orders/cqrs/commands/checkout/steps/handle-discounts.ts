import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';
import { RawDiscount } from 'src/model/orders/orders.interface';

@Injectable()
export class HandleDicountsOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleDicountsOrder.name);
  }

  async validateAndLock(
    tx: Prisma.TransactionClient,
    orderItems: OrderItemInputDto,
  ): Promise<RawDiscount[]> {
    const method = 'validate';
    const discountIds = orderItems
      .map((item) => item.discountId)
      .filter((id): id is string => !!id);

    this.logger.trace({
      method,
      message: `Starting discounts validation`,
    });

    if (!discountIds.length) {
      this.logger.trace({
        method,
        message: '🫡 No discounts applied, skipping validation',
      });
      return [];
    }

    const rawDiscounts = await tx.$queryRaw<
      RawDiscount[]
    >`SELECT * FROM "discount" WHERE "id" IN (${Prisma.join(discountIds.map((id) => Prisma.sql`${id}::uuid`))}) FOR UPDATE`;

    const now = new Date();

    for (const item of orderItems) {
      if (!item.discountId) continue;

      const discount = rawDiscounts.find((d) => d.id === item.discountId);

      if (!discount) {
        this.logger.error({
          method,
          type: 'discount-not-found',
          message: `🛑 Discount ${item.discountId} not found for product ${item.productId}`,
        });
        throw new NotFoundException(
          `Discount "${item.discountId}" not found 😶‍🌫️`,
        );
      }

      if (discount.redeemed_count >= discount.max_redeemed) {
        this.logger.trace({
          method,
          type: 'discount-maxed',
          message: `🚫 Discount "${discount.name}" has hit its usage cap`,
        });
        throw new ConflictException(
          `Discount "${discount.name}" is maxed out 🚷`,
        );
      }

      if (item.quantity > discount.max_redeemed) {
        this.logger.trace({
          method,
          type: 'discount-maxed',
          message: `🚫 Discount "${discount.name}" has hit its usage cap`,
        });
        throw new ConflictException(
          `Discount "${discount.name}" is maxed out 🚷`,
        );
      }

      if (discount.redeemed_count + item.quantity > discount.max_redeemed) {
        this.logger.trace({
          method,
          type: 'discount-maxed',
          message: `🚫 Discount "${discount.name}" has hit its usage cap`,
        });
        throw new ConflictException(
          `Discount "${discount.name}" is maxed out 🚷`,
        );
      }

      if (discount.start_date > now) {
        this.logger.trace({
          method,
          type: 'discount-not-started',
          message: `⌛ Discount "${discount.name}" hasn't started (starts at ${discount.start_date.toISOString()})`,
        });
        throw new ConflictException(
          `Discount "${discount.name}" hasn't started yet`,
        );
      }

      if (discount.end_date < now) {
        this.logger.trace({
          method,
          type: 'discount-expired',
          message: `⌛ Discount "${discount.name}" has expired (ended at ${discount.end_date.toISOString()})`,
        });
        throw new ConflictException(
          `Discount "${discount.name}" is expired 💀`,
        );
      }
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `All vouchers validated successfully`,
    });

    return rawDiscounts;
  }

  async update(
    tx: Prisma.TransactionClient,
    orderItems: OrderItemInputDto,
  ): Promise<void> {
    const method = 'updateDiscounts';

    this.logger.trace({
      method,
      message: 'Starting discount updates',
    });

    for (const item of orderItems) {
      if (!item.discountId) continue;

      await tx.discount.update({
        where: { id: item.discountId },
        data: {
          redeemedCount: {
            increment: item.quantity,
          },
        },
      });

      this.logger.trace({
        method,
        message: `🎯 Applied discount ${item.discountId} incremented by ${item.quantity}`,
      });
    }

    this.logger.trace({
      method,
      status: 'success',
      message: 'All discounts updated successfully',
    });
  }
}
