import { CreateDiscountSchema } from './create-discount.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UpdateDiscountSchema = CreateDiscountSchema.partial();

export class UpdateDiscountDto
  extends createZodDto(UpdateDiscountSchema)
  implements z.infer<typeof UpdateDiscountSchema> {}
