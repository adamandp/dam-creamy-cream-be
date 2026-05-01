import z from 'zod';
import { BaseUserSchema } from '../users.validation';
import { createZodDto } from 'nestjs-zod';

const UpdateUserPasswordSchema = z.object({
  exsitingPassword: BaseUserSchema.shape.password,
  newPassword: BaseUserSchema.shape.password,
});

export class UpdateUserPasswordDto
  extends createZodDto(UpdateUserPasswordSchema)
  implements z.infer<typeof UpdateUserPasswordSchema> {}
