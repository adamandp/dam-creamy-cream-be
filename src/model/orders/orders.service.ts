import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckOutCommand } from './cqrs/commands/checkout/checkout.command';
import { WebResponse } from 'src/common/common.interface';
import { CheckOutDto } from './dto/checkout.dto';
import { PaginationDto } from 'src/common/common.dto';
import { FindAllOrderResDto as FindAllDto } from './orders.interface';
import { FindAllOrderCommand } from './cqrs/queries/find-all/find-all.query';

@Injectable()
export class OrdersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OrdersService.name);
  }

  async checkout(body: CheckOutDto): Promise<WebResponse> {
    return this.commandBus.execute(new CheckOutCommand(body));
  }

  async findAll(pagination: PaginationDto): Promise<WebResponse<FindAllDto>> {
    return this.queryBus.execute(new FindAllOrderCommand(pagination));
  }
}
