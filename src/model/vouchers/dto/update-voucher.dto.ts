import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { CreateVoucherSchema } from './create-voucher.dto';

const UpdateVoucherSchema = CreateVoucherSchema.partial();

export class UpdateVoucherDto
  extends createZodDto(UpdateVoucherSchema)
  implements z.infer<typeof UpdateVoucherSchema> {}
