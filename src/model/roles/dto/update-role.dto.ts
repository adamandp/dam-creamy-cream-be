import { createZodDto } from 'nestjs-zod';
import { BaseRoleSchema } from '../roles.validation';
import z from 'zod';

const UpdateRoleSchema = BaseRoleSchema.pick({
  name: true,
});

export class UpdateRoleDto
  extends createZodDto(UpdateRoleSchema)
  implements z.infer<typeof UpdateRoleSchema>
{
  constructor() {
    super();
  }
}
