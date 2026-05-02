import { baseDate, baseEnum, baseUUID } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseUserVoucherSchema = z.object({
  id: baseUUID('User ID'),
  userId: baseUUID('User ID'),
  voucherId: baseUUID('Voucher ID'),
  status: baseEnum('Status', ['USED', 'CLAIMED'] as const),
  claimedAt: baseDate('Claimed At'),
  expiredAt: baseDate('Expired At'),
  updatedAt: baseDate('Updated At'),
  createdAt: baseDate('Created At'),
});
