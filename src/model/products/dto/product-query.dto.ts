import { createZodDto } from 'nestjs-zod';
import {
  baseEnum,
  coerceNumberMinMax,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

const sort = ['asc', 'desc', 'default'] as const;

export const ProductQuerySchema = z
  .object({
    q: stringMinMax('q', 1, 100).nullish(),
    sort: baseEnum('Sort', sort).nullish(),
    cat: stringMinMax('Category', 1, 100).nullish(),

    min: coerceNumberMinMax('min', 0, 1000000).nullish(),
    max: coerceNumberMinMax('max', 0, 1000000).nullish(),

    page: coerceNumberMinMax('Page', 1, 100).optional().default(1),
    limit: coerceNumberMinMax('Limit', 1, 100).optional().default(10),
  })
  .strict();

export class ProductQueryDto
  extends createZodDto(ProductQuerySchema)
  implements z.infer<typeof ProductQuerySchema> {}
