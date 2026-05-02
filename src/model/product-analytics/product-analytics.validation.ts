import { baseDate, baseUUID } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseProductAnalyticsSchema = z.object({
  id: baseUUID('id'),
  userId: baseUUID('User id').nullable(),
  productId: baseUUID('Product id').nullable(),
  createdAt: baseDate('Created At'),
});
