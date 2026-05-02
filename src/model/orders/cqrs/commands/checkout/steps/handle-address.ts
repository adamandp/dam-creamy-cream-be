import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleAddressOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleAddressOrder.name);
  }

  async validate(
    tx: Prisma.TransactionClient,
    { addressId }: OrderInputDto,
  ): Promise<void> {
    const method = 'validate';

    this.logger.trace({
      method,
      message: `Starting address validation`,
    });

    await tx.address.findUniqueOrThrow({ where: { id: addressId } });

    this.logger.trace({
      method,
      status: 'success',
      message: `Address validated successfully`,
    });
  }
}
