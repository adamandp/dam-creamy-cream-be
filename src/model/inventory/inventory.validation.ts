import {
  baseBoolean,
  baseDate,
  baseNumber,
  baseUUID,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseInventorySchema = z.object({
  id: baseUUID('Inventory ID'),
  productId: baseUUID('Product ID'),
  quantity: baseNumber('Quantity'),
  reservedQuantity: baseNumber('Reserved Quantity'),
  isActive: baseBoolean('Is Active'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
