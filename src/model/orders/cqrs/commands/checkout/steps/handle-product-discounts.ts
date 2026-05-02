import { Injectable } from '@nestjs/common';
import { Prisma, ProductDiscount } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleProductsDiscountOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleProductsDiscountOrder.name);
  }

  async validate(
    tx: Prisma.TransactionClient,
    orderItems: OrderItemInputDto,
  ): Promise<ProductDiscount[]> {
    const method = 'validate';
    const productsIds = orderItems.map((item) => item.productId);
    const discountsIds = orderItems
      .map((item) => item.discountId)
      .filter((id): id is string => !!id);

    this.logger.trace({
      method,
      message: `Validating product-discount relation`,
    });

    if (!discountsIds.length) {
      this.logger.info({
        method,
        message:
          '🫡 No discounts found in order items, skipping product-discount validation',
      });
      return [];
    }

    const productsDisocunt = await tx.productDiscount.findMany({
      where: {
        productId: { in: productsIds },
        discountId: { in: discountsIds },
      },
    });

    if (productsDisocunt.length === orderItems.length) {
      for (const o of orderItems) {
        if (!productsDisocunt.find((r) => r.productId === o.productId)) {
          this.logger.error({
            method,
            type: 'product-discount-not-found',
            message: `🛑 No product-discount relation found for product ${o.productId} and discount ${o.discountId} )`,
          });
          throw new NotFoundException(
            `No product-discount relation found for product "${o.productId}" and discount "${o.discountId}"`,
          );
        }
      }
    }

    this.logger.info({
      method,
      status: 'success',
      message: `All product-discount relations validated successfully`,
    });

    return productsDisocunt;
  }
}
