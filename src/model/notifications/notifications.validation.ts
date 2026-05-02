import { baseDate, baseUUID, stringMinMax } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseNotificationsSchema = z.object({
  id: baseUUID('User ID'),
  title: stringMinMax('Title', 1, 100),
  message: stringMinMax('Message', 1, 255),
  updatedAt: baseDate('Updated At'),
  createdAt: baseDate('Created At'),
});
