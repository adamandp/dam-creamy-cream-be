import z from 'zod';
import { BaseNotificationsSchema } from '../notifications.validation';
import { createZodDto } from 'nestjs-zod';

export const CreateNotificationSchema = BaseNotificationsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateNotificationDto
  extends createZodDto(CreateNotificationSchema)
  implements z.infer<typeof CreateNotificationSchema> {}
