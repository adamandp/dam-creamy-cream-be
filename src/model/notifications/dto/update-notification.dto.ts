import { CreateNotificationSchema } from './create-notification.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UpdateNotificationSchema = CreateNotificationSchema.partial();

export class UpdateNotificationDto
  extends createZodDto(UpdateNotificationSchema)
  implements z.infer<typeof UpdateNotificationSchema> {}
