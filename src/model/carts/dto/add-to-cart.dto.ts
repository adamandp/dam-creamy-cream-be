import z from 'zod';
import { BaseCartItemSchema } from '../carts.validation';
import { createZodDto } from 'nestjs-zod';

const AddToCartSchema = BaseCartItemSchema.pick({
  productId: true,
  quantity: true,
});

export class AddToCartDto
  extends createZodDto(AddToCartSchema)
  implements z.infer<typeof AddToCartSchema> {}
