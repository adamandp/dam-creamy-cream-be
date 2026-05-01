import z from 'zod';
import { BaseUserSchema } from '../users.validation';
import { createZodDto } from 'nestjs-zod';

const UpdateUserSchema = BaseUserSchema.omit({
  id: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export class UpdateUserDto
  extends createZodDto(UpdateUserSchema)
  implements z.infer<typeof UpdateUserSchema> {}
