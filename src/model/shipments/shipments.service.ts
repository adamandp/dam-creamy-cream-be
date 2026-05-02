import { Injectable } from '@nestjs/common';
import { UpdateStatusShipmentDto } from './dto/update-shipment.dto';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/common/prisma.module';
import {
  FindAllShipmentDto as FindAllDto,
  FindByIdShipmentDto as FindByIdDto,
  FindManyIdShipmentDto as FindManyDto,
} from './shipments.interface';
import { WebResponse } from 'src/common/common.interface';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
import { Messages } from 'src/utils/message.helper';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(ShipmentsService.name);
  }

  private name = 'Shipment';

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<WebResponse<FindAllDto>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.shipment.findMany({
        skip,
        take: limit,
      }),
      this.prisma.shipment.count(),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException(this.name);
      return {
        message: Messages.get(this.name),
        data,
        paging: {
          currentPage: page,
          pageSize: limit,
          totalItems: total,
          totalPages: Math.ceil(total / (limit || 1)),
        },
      };
    });
  }

  async findById(id: string): Promise<WebResponse<FindByIdDto>> {
    return await this.prisma.shipment
      .findUniqueOrThrow({ where: { id } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async findMany(ids: string[]): Promise<WebResponse<FindManyDto>> {
    return await this.prisma.shipment
      .findMany({ where: { id: { in: ids } } })
      .then((data) => ({ message: Messages.get(this.name), data }));
  }

  async updateStatus(id: string, body: UpdateStatusShipmentDto) {
    return await this.prisma.shipment
      .update({ where: { id }, data: body })
      .then(() => ({ message: Messages.update(this.name) }));
  }
}
