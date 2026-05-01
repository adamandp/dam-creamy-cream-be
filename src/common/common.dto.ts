import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const PaginationSchema = z.object({
  page: z
    .number({
      error: `🔢 page must be a valid number. No funky math here! 🚫 {Invalid Number}`,
    })
    .min(
      1,
      `🔡 page must be at least 1 characters. Keep going! 💪 {Minimum Length}`,
    )
    .max(
      100,
      `🚀 Whoa! page is too long. Maximum allowed is 100 characters! ✍️ {Maximum Length}`,
    )
    .optional()
    .default(1),
  limit: z
    .number({
      error: `🔢 limit must be a valid number. No funky math here! 🚫 {Invalid Number}`,
    })
    .min(
      1,
      `🔡 limit must be at least 1 characters. Keep going! 💪 {Minimum Length}`,
    )
    .max(
      100,
      `🚀 Whoa! limit is too long. Maximum allowed is 100 characters! ✍️ {Maximum Length}`,
    )
    .optional()
    .default(10),
});

export class PaginationDto
  extends createZodDto(PaginationSchema)
  implements z.infer<typeof PaginationSchema>
{
  constructor() {
    super();
  }
}
