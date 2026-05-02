import { Module } from '@nestjs/common';
import { ProductDiscountsService } from './product-discounts.service';
import { ProductDiscountsController } from './product-discounts.controller';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [ProductsModule, DiscountsModule],
  controllers: [ProductDiscountsController],
  providers: [ProductDiscountsService],
})
export class ProductDiscountsModule {}
