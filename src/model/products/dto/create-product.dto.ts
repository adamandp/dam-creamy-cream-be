import { createZodDto } from 'nestjs-zod';
import { BaseProductSchema } from '../products.validation';
import z from 'zod';

export const CreateProductSchema = BaseProductSchema.omit({
  id: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateProductDto
  extends createZodDto(CreateProductSchema)
  implements z.infer<typeof CreateProductSchema> {}
