import { createZodDto } from 'nestjs-zod';
import { coerceNumberMinMax } from 'src/utils/zod.helper';
import z from 'zod';

const PaginationSchema = z.object({
  page: coerceNumberMinMax('Page', 1, 100)
    // .transform((val) => Number(val))
    .optional()
    .default(1),
  limit: coerceNumberMinMax('Limit', 1, 100)
    // .transform((val) => Number(val))
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
