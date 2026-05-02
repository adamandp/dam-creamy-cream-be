import { createZodDto } from 'nestjs-zod';
import { BaseCategorySchema } from '../categories.validation';
import z from 'zod';

export const CreateCategorySchema = BaseCategorySchema.pick({
  name: true,
  description: true,
  isActive: true,
});

export class CreateCategoryDto
  extends createZodDto(CreateCategorySchema)
  implements z.infer<typeof CreateCategorySchema> {}
