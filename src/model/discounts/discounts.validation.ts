import {
  baseDate,
  baseEnum,
  baseName,
  baseNumber,
  baseUUID,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseDiscountSchema = z.object({
  id: baseUUID('Discount ID'),
  name: baseName('Discount Name', 1, 100),
  discountType: baseEnum('Discount Type', [
    'PERCENTAGE',
    'FIXED',
    'FREE_ITEM',
    'PRICE',
  ] as const),
  value: baseNumber('Value').nullable(),
  maxApplied: baseNumber('Max Applied'),
  maxRedeemed: baseNumber('Max Reedem'),
  redeemedCount: baseNumber('Redeemed Count'),
  description: stringMinMax('Description', 1, 255).nullable(),
  productId: baseUUID('Product ID').nullable(),
  quantity: baseNumber('Quantity').nullable(),
  startDate: baseDate('Start Date'),
  endDate: baseDate('End Date'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
