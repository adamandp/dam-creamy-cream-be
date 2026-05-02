import { BaseReviewSchema } from '../reviews.validation';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UpdateReviewSchema = BaseReviewSchema.pick({
  comment: true,
  rating: true,
}).partial();

export class UpdateReviewDto
  extends createZodDto(UpdateReviewSchema)
  implements z.infer<typeof UpdateReviewSchema> {}
