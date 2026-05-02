import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrderCommand } from './find-all.query';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/common/prisma.module';
import { WebResponse } from 'src/common/common.interface';
import { Messages } from 'src/utils/message.helper';
import { NotFoundException } from 'src/exceptions';
import { FindAllOrderResDto as FindAllDto } from 'src/model/orders/orders.interface';

@Injectable()
@QueryHandler(FindAllOrderCommand)
export class FindAllOrderHandler implements IQueryHandler<FindAllOrderCommand> {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(FindAllOrderCommand.name);
  }

  async execute(query: FindAllOrderCommand): Promise<WebResponse<FindAllDto>> {
    const { page, limit } = query.pagination;
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
      }),
      this.prisma.order.count(),
    ]).then(([data, total]) => {
      if (total <= 0) throw new NotFoundException('Orders');
      return {
        message: Messages.get('Orders'),
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
}
