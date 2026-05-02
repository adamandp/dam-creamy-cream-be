import { createZodDto } from 'nestjs-zod';
import { BaseProductAnalyticsSchema } from '../product-analytics.validation';
import z from 'zod';

const CreateProductAnalyticsSchema = BaseProductAnalyticsSchema.omit({
  id: true,
  createdAt: true,
});

export class CreateProductAnalyticDto
  extends createZodDto(CreateProductAnalyticsSchema)
  implements z.infer<typeof CreateProductAnalyticsSchema> {}
