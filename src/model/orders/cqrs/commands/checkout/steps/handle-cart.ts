import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class HandleCartOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleCartOrder.name);
  }

  async validate(
    tx: Prisma.TransactionClient,
    userId: string,
  ): Promise<string> {
    const method = 'validate';

    this.logger.trace({
      method,
      message: `Starting cart validation`,
    });

    const { id: cartId } = await tx.cart.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    this.logger.trace({
      method,
      status: 'success',
      message: `Cart validated successfully`,
    });

    return cartId;
  }
}
