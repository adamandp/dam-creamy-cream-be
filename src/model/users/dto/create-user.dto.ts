import z from 'zod';
import { BaseUserSchema } from '../users.validation';
import { createZodDto } from 'nestjs-zod';

const CreateUserSchema = BaseUserSchema.pick({
  username: true,
  fullName: true,
  password: true,
  email: true,
  phoneNumber: true,
  roleId: true,
});

export class CreateUserDto
  extends createZodDto(CreateUserSchema)
  implements z.infer<typeof CreateUserSchema>
{
  constructor() {
    super();
  }
}
