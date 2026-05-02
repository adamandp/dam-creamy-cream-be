import { createZodDto } from 'nestjs-zod';
import { BaseReviewSchema } from '../reviews.validation';
import z from 'zod';

const CreateReviewSchema = BaseReviewSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateReviewDto
  extends createZodDto(CreateReviewSchema)
  implements z.infer<typeof CreateReviewSchema> {}
