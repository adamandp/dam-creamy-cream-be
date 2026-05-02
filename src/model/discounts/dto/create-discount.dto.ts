import z from 'zod';
import { BaseDiscountSchema } from '../discounts.validation';
import { createZodDto } from 'nestjs-zod';

export const CreateDiscountSchema = BaseDiscountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateDiscountDto
  extends createZodDto(CreateDiscountSchema)
  implements z.infer<typeof CreateDiscountSchema> {}
