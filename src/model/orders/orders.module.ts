import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { FindAllOrderHandler } from './cqrs/queries/find-all/find-all.handler';
import { CheckoutOrderModule } from './cqrs/commands/checkout/checkout.module';

@Module({
  imports: [CheckoutOrderModule],
  controllers: [OrdersController],
  providers: [OrdersService, FindAllOrderHandler],
})
export class OrdersModule {}
