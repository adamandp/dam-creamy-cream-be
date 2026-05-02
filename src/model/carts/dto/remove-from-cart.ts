import z from 'zod';
import { BaseCartItemSchema } from '../carts.validation';
import { createZodDto } from 'nestjs-zod';

const RemoveFromCartSchema = BaseCartItemSchema.pick({
  productId: true,
  quantity: true,
});

export class RemoveFromCartDto
  extends createZodDto(RemoveFromCartSchema)
  implements z.infer<typeof RemoveFromCartSchema> {}
