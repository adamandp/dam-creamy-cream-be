import { Injectable } from '@nestjs/common';
import {
  DiscountType,
  Prisma,
  Voucher,
  VoucherType,
} from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import {
  MappedOrderItem,
  RawDiscount,
} from 'src/model/orders/orders.interface';

@Injectable()
export class HandleOrderItems {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleOrderItems.name);
  }

  async create(
    tx: Prisma.TransactionClient,
    orderItems: MappedOrderItem[],
    orderId: string,
  ): Promise<void> {
    const method = 'create';

    this.logger.info({
      method,
      message: `📦 Creating ${orderItems.length} order items for order ${orderId}`,
    });

    try {
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId,
          productId: item.id,
          discountId: item.discountId,
          quantity: item.quantity,
          price: item.price,
          discountAmount: item.discountAmount,
          finalPrice: item.finalPrice,
        })),
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Successfully created order items for order ${orderId}`,
      });
    } catch (error) {
      this.logger.error({
        method,
        type: 'order-item-creation-failed',
        message: `❌ Failed to create order items for order ${orderId}`,
        error: error,
      });
      throw error;
    }
  }

  async createFromFreeItemDiscounts(
    tx: Prisma.TransactionClient,
    orderId: string,
    discounts: RawDiscount[] | [],
  ): Promise<void> {
    const method = 'createFromFreeItemDiscounts';

    const freeItemDiscounts = discounts.filter(
      (discount) => discount.discount_type === DiscountType.FREE_ITEM,
    );

    if (!discounts.length && freeItemDiscounts.length) {
      this.logger.info({
        method,
        message:
          '🫡 No free item discounts applied, skipping order item creation',
      });
      return;
    }

    this.logger.info({
      method,
      message: `📦 Creating ${discounts.length} order items from free item discounts`,
    });

    try {
      await tx.orderItem.createMany({
        data: freeItemDiscounts.map((item) => ({
          orderId,
          productId: item.product_id!,
          quantity: item.quantity!,
          discountId: null,
          discountAmount: 0,
          price: 0,
          finalPrice: 0,
        })),
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Successfully created order items for order ${orderId}`,
      });
    } catch (error) {
      this.logger.error({
        method,
        type: 'order-item-creation-failed',
        message: `❌ Failed to create order items for order ${orderId}`,
        error: error,
      });
      throw error;
    }
  }

  async createFromFreeItemVouchers(
    tx: Prisma.TransactionClient,
    orderId: string,
    vouchers: Voucher[] | [],
  ): Promise<void> {
    const method = 'createFromFreeItemVouchers';

    const freeItemVouchers = vouchers.filter(
      (discount) => discount.type === VoucherType.FREE_ITEM,
    );

    if (!vouchers.length && freeItemVouchers.length) {
      this.logger.info({
        method,
        message: `🫡 No free item vouchers applied, skipping order item creation`,
      });
      return;
    }

    this.logger.info({
      method,
      message: `📦 Creating order items from free item vouchers`,
    });

    try {
      await tx.orderItem.createMany({
        data: freeItemVouchers.map((item) => ({
          orderId,
          productId: item.productId!,
          quantity: item.quantity!,
          discountId: null,
          discountAmount: 0,
          price: 0,
          finalPrice: 0,
        })),
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Successfully created order items for order ${orderId}`,
      });
    } catch (error) {
      this.logger.error({
        method,
        type: 'order-item-creation-failed',
        message: `❌ Failed to create order items for order ${orderId}`,
        error: error,
      });
      throw error;
    }
  }
}
