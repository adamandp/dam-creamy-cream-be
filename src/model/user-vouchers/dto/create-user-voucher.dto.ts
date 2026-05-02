import { createZodDto } from 'nestjs-zod';
import { BaseUserVoucherSchema } from '../user-vouchers.validation';
import z from 'zod';

const CreateUserVoucherSchema = BaseUserVoucherSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateUserVoucherDto
  extends createZodDto(CreateUserVoucherSchema)
  implements z.infer<typeof CreateUserVoucherSchema> {}
