import {
  baseDate,
  baseUUID,
  NumberMinMax,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseReviewSchema = z.object({
  id: baseUUID('User ID'),
  userId: baseUUID('Role ID'),
  productId: baseUUID('Product ID'),
  rating: NumberMinMax('Rating', 1, 5),
  comment: stringMinMax('Review', 1, 255).nullish(),
  updatedAt: baseDate('Updated At'),
  createdAt: baseDate('Created At'),
});
