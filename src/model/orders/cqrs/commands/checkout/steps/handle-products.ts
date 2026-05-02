import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';
import { ProductBasicInfo } from 'src/model/orders/orders.interface';

@Injectable()
export class HandleProductsOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleProductsOrder.name);
  }
  async validate(
    tx: Prisma.TransactionClient,
    orderItems: OrderItemInputDto,
  ): Promise<ProductBasicInfo[]> {
    const method = 'validate';
    const productIds = orderItems.map((item) => item.productId);

    this.logger.trace({
      method,
      message: `Starting product validation`,
      productIds,
    });

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });

    const foundIds = products.map((p) => p.id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      for (const missingId of missingIds) {
        this.logger.error({
          method,
          type: 'product-not-found',
          message: `❌ Product with ID ${missingId} not found`,
        });
        throw new NotFoundException(`${missingId}`);
      }
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `All products validated successfully`,
    });

    return products;
  }
}
