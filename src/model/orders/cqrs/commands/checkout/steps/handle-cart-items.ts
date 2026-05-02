import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';
import { RawCartItem } from 'src/model/orders/orders.interface';

@Injectable()
export class HandleCartItemsOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleCartItemsOrder.name);
  }

  async validateAndLock(
    tx: Prisma.TransactionClient,
    cartId: string,
    orderItems: OrderItemInputDto,
  ): Promise<RawCartItem[]> {
    const method = 'validateAndLock';
    const productIds = orderItems.map((item) => item.productId);

    this.logger.trace({
      method,
      message: `🛒 Starting cart items validation `,
    });

    const rawCartItem = await tx.$queryRaw<
      RawCartItem[]
    >`SELECT * FROM "cart_items" WHERE "cart_id" = ${cartId}::uuid AND "product_id" IN (${Prisma.join(productIds.map((id) => Prisma.sql`${id}::uuid`))}) FOR UPDATE `;

    // const rawCartItems = await tx.$queryRaw<
    //   UnParsedCartItem[]
    // >` SELECT * FROM "cart_items" WHERE "cart_id" = ${cartId}::uuid AND "product_id" = ANY(${Prisma.sql`ARRAY[${Prisma.join(productIds)}]`}::uuid[]) FOR UPDATE`;

    const foundIds = rawCartItem.map((r) => r.product_id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      for (const id of missingIds) {
        this.logger.error({
          method,
          type: 'cart-item-not-found',
          message: `🛑 Product ${id} not found in cart`,
        });
      }
      throw new NotFoundException(
        `Some cart items not found: ${missingIds.join(', ')} 🫥`,
      );
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `✅ Cart items validated successfully`,
    });

    return rawCartItem;
  }

  async update(
    tx: Prisma.TransactionClient,
    cartId: string,
    orderItems: OrderItemInputDto,
  ): Promise<void> {
    const method = 'update';

    this.logger.trace({
      method,
      message: `🔄 Starting cart item updates`,
    });

    for (const item of orderItems) {
      await tx.cartItem.updateMany({
        where: {
          cartId,
          productId: item.productId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      this.logger.trace({
        method,
        message: `🔄 Updated quantity for product ${item.productId} to ${item.quantity}`,
      });
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `✅ All cart items updated successfully`,
    });
  }
}
