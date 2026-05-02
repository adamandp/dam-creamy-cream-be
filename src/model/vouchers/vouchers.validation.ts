import {
  baseBoolean,
  baseDate,
  baseEnum,
  baseName,
  baseNumber,
  baseUUID,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseVoucherSchema = z.object({
  id: baseUUID('User ID'),
  code: stringMinMax('Code', 1, 50),
  name: baseName('Name', 1, 100),
  description: stringMinMax('Description', 1, 255).nullable(),
  type: baseEnum('Discount Type', [
    'PERCENTAGE',
    'FIXED',
    'FREE_ITEM',
  ] as const),
  group: baseEnum('Group', ['CHECKOUT', 'SHIPPING'] as const),
  value: baseNumber('Value').nullable(),
  productId: baseUUID('Product ID').nullable(),
  quantity: baseNumber('Quantity').nullable(),
  minimumPurchase: baseNumber('Minimum Price'),
  isActive: baseBoolean('Is Active'),
  startDate: baseDate('Start Date'),
  endDate: baseDate('End Date'),
  maxRedeemed: baseNumber('Max Redeemed'),
  redeemedCount: baseNumber('Redeemed Count'),
  updatedAt: baseDate('Updated At'),
  createdAt: baseDate('Created At'),
});
