import { createZodDto } from 'nestjs-zod';
import { BaseUserNotificationSchema } from '../user-notifications.validation';
import z from 'zod';

const CreateUserNotificationSchema = BaseUserNotificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateUserNotificationDto
  extends createZodDto(CreateUserNotificationSchema)
  implements z.infer<typeof CreateUserNotificationSchema> {}
