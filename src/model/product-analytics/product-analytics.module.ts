import { Module } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { ProductAnalyticsController } from './product-analytics.controller';

@Module({
  controllers: [ProductAnalyticsController],
  providers: [ProductAnalyticsService],
})
export class ProductAnalyticsModule {}
