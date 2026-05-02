import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { ShipmentInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleShipmentOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleShipmentOrder.name);
  }

  async create(
    tx: Prisma.TransactionClient,
    orderId: string,
    shipment: Omit<ShipmentInputDto, 'cost'>,
    cost: number,
  ): Promise<void> {
    const method = 'handleShipment';

    this.logger.info({
      method,
      message: `🚚 Preparing shipment for order ${orderId}`,
    });

    try {
      this.logger.info({
        method,
        message: `📦 Final shipping cost calculated for order ${orderId}`,
      });

      await tx.shipment.create({
        data: {
          orderId,
          ...shipment,
          cost,
        },
      });

      this.logger.info({
        method,
        status: 'success',
        message: `✅ Shipment record created for order ${orderId}`,
      });
    } catch (error) {
      this.logger.error({
        method,
        type: 'shipment-creation-failed',
        message: `❌ Failed to create shipment for order ${orderId}`,
        error: error,
      });
      throw error;
    }
  }
}
