import { baseBoolean, baseDate, baseUUID } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseUserNotificationSchema = z.object({
  id: baseUUID('ID'),
  userId: baseUUID('User ID'),
  notificationId: baseUUID('Notification ID'),
  isRead: baseBoolean('Is Read'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
