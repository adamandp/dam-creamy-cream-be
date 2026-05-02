import z from 'zod';
import { BaseProductAnalyticsSchema } from './product-analytics.validation';

type BaseProductAnalyticsDto = z.infer<typeof BaseProductAnalyticsSchema>;

type FindByProductProductAnalyticsDto = BaseProductAnalyticsDto[];
type FindByUserProductAnalyticsDto = BaseProductAnalyticsDto[];
type FindByProductCountProductAnalyticsDto = {
  count: number;
};

export type {
  FindByProductProductAnalyticsDto,
  FindByUserProductAnalyticsDto,
  FindByProductCountProductAnalyticsDto,
};
