import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';
import { RawInventory } from 'src/model/orders/orders.interface';

@Injectable()
export class HandleInventoriesOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleInventoriesOrder.name);
  }

  async validateAndLock(
    tx: Prisma.TransactionClient,
    orderItems: OrderItemInputDto,
  ): Promise<RawInventory[]> {
    const method = 'validateAndLock';
    const productIds = orderItems.map((item) => item.productId);

    this.logger.trace({
      method,
      message: `Starting inventory validation`,
      productIds,
    });

    const rawInventory = await tx.$queryRaw<RawInventory[]>`
    SELECT * FROM "inventory" 
    WHERE "product_id" IN (${Prisma.join(productIds.map((id) => Prisma.sql`${id}::uuid`))}) 
    FOR UPDATE 
  `;

    for (const o of orderItems) {
      const inventory = rawInventory.find((i) => i.product_id === o.productId);

      if (!inventory) {
        this.logger.error({
          method,
          type: 'inventory-not-found',
          message: `🛑 No inventory found for product ${o.productId} )`,
        });
        throw new NotFoundException(
          `Inventory for product "${o.productId}" not found 🫠`,
        );
      }

      const availableQty = inventory.quantity - inventory.reserved_quantity;

      if (availableQty < o.quantity) {
        this.logger.trace({
          method,
          type: 'inventory-insufficient',
          message: `⚠️ Not enough stock for "${o.productId}" — needed: ${o.quantity}, available: ${availableQty}`,
        });
        throw new ConflictException(
          `"${o.productId}" is running out of stock 😩`,
        );
      }

      this.logger.trace({
        method,
        message: `🔒 Reserved ${o.quantity} units for product ${o.productId}`,
      });
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `All inventories validated successfully`,
    });

    return rawInventory;
  }

  async update(
    tx: Prisma.TransactionClient,
    orderItems: OrderItemInputDto,
  ): Promise<void> {
    const method = 'updateInventories';

    this.logger.info({
      method,
      message: `Starting inventory updates`,
    });

    for (const o of orderItems) {
      await tx.inventory.update({
        where: { productId: o.productId },
        data: {
          reservedQuantity: {
            increment: o.quantity,
          },
        },
      });

      this.logger.info({
        method,
        message: `🔒 Reserved ${o.quantity} units for product ${o.productId}`,
      });
    }

    this.logger.info({
      method,
      status: 'success',
      message: `All inventories updated successfully`,
    });
  }
}
