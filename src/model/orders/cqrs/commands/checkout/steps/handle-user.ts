import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class HandleUserOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleUserOrder.name);
  }

  async validate(tx: Prisma.TransactionClient, id: string): Promise<void> {
    const method = 'validate';

    this.logger.trace({
      method,
      message: `Starting user validation`,
    });

    await tx.user.findUniqueOrThrow({ where: { id } });

    this.logger.trace({
      method,
      status: 'success',
      message: `User validated successfully`,
    });
  }
}
