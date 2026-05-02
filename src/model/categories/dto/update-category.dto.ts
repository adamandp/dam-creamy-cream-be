import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { CreateCategorySchema } from './create-category.dto';

const UpdateCategorySchema = CreateCategorySchema.partial();

export class UpdateCategoryDto
  extends createZodDto(UpdateCategorySchema)
  implements z.infer<typeof UpdateCategorySchema> {}
