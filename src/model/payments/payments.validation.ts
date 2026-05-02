import {
  baseDate,
  baseEnum,
  baseNumber,
  baseUUID,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BasePaymentSchema = z.object({
  id: baseUUID('Payment ID'),
  orderId: baseUUID('Order ID'),
  method: stringMinMax('Method', 1, 50),
  amount: baseNumber('Amount'),
  status: baseEnum('Status', [
    'PENDING',
    'PAID',
    'FAILED',
    'CANCELLED',
  ] as const),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
