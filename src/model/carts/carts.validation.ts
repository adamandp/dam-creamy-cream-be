import { baseDate, baseUUID, NumberMinMax } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseCartSchema = z.object({
  id: baseUUID('Cart ID'),
  userId: baseUUID('User ID'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});

export const BaseCartItemSchema = z.object({
  id: baseUUID('Cart Item ID'),
  cartId: baseUUID('Cart ID'),
  productId: baseUUID('Product ID'),
  quantity: NumberMinMax('Quantity', 1, 100),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
