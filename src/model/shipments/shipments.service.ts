import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateStatusShipmentDto } from './dto/update-shipment.dto';
import { PinoLogger } from 'nestjs-pino';
// import { PrismaService } from 'src/common/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  FindAllShipmentDto as FindAllDto,
  FindByIdShipmentDto as FindByIdDto,
  FindManyIdShipmentDto as FindManyDto,
  ShippingData,
  ShippingResponse,
} from './shipments.interface';
import { WebResponse } from 'src/common/common.interface';
import { PaginationDto } from 'src/common/common.dto';
import { NotFoundException } from 'src/exceptions';
import { ErrorMessage, Messages } from 'src/utils/message.helper';
import { CostDto } from './dto/cost-shipment.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

  async cost(request: CostDto): Promise<WebResponse<ShippingData[]>> {
    const data = {
      ...request,
      courier:
        'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse',
    };
    return await firstValueFrom(
      this.httpService.post<ShippingResponse>(
        `${this.configService.get<string>('RAJAONGKIR_BASE_URL')}/calculate/domestic-cost`,
        data,
        {
          headers: {
            key: this.configService.get<string>('RAJAONGKIR_API_KEY'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    )
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException(
          ErrorMessage.create('Shipping cost'),
        );
      })
      .then((response) => {
        return {
          message: response.data.meta.message,
          status: response.data.meta.code,
          data: response.data.data,
        };
      });
  }
}
