import { createZodDto } from 'nestjs-zod';
import { BaseProductDiscountSchema } from '../product-discounts.validation';
import z from 'zod';

const CreateProductDiscountSchema = BaseProductDiscountSchema.pick({
  discountId: true,
  productId: true,
});

export class CreateProductDiscountDto
  extends createZodDto(CreateProductDiscountSchema)
  implements z.infer<typeof CreateProductDiscountSchema> {}
