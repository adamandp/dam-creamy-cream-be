import z from 'zod';
import { BaseVoucherSchema } from '../vouchers.validation';
import { createZodDto } from 'nestjs-zod';

export const CreateVoucherSchema = BaseVoucherSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export class CreateVoucherDto
  extends createZodDto(CreateVoucherSchema)
  implements z.infer<typeof CreateVoucherSchema> {}
