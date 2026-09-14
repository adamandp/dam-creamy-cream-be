import { createZodDto } from 'nestjs-zod';
import { coerceNumber } from 'src/utils/zod.helper';
import { z } from 'zod';

const CostSchema = z
  .object({
    origin: coerceNumber('origin').transform((val) => Number(val)),
    destination: coerceNumber('destination').transform((val) => Number(val)),
    weight: coerceNumber('weight').transform((val) => Number(val)),
  })
  .strict();

class CostDto
  extends createZodDto(CostSchema)
  implements z.infer<typeof CostSchema> {}

export type { CostSchema, CostDto };
