import { baseBoolean, baseDate, baseUUID } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseProductDiscountSchema = z.object({
  id: baseUUID('User ID'),
  productId: baseUUID('Product ID'),
  discountId: baseUUID('Discount ID'),
  isActive: baseBoolean('Is Active'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
