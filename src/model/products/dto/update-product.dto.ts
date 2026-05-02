import { createZodDto } from 'nestjs-zod';
import { CreateProductSchema } from './create-product.dto';
import z from 'zod';

const UpdateProductSchema = CreateProductSchema.partial();

export class UpdateProductDto
  extends createZodDto(UpdateProductSchema)
  implements z.infer<typeof UpdateProductSchema> {}
