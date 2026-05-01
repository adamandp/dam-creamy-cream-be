import { createZodDto } from 'nestjs-zod';
import { BaseRoleSchema } from '../roles.validation';
import z from 'zod';

const CreateRoleSchema = BaseRoleSchema.pick({
  name: true,
});

export class CreateRoleDto
  extends createZodDto(CreateRoleSchema)
  implements z.infer<typeof CreateRoleSchema>
{
  constructor() {
    super();
  }
}
