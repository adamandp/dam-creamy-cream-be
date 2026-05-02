import {
  baseBoolean,
  baseDate,
  baseName,
  baseUUID,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseCategorySchema = z.object({
  id: baseUUID('Category ID'),
  name: baseName('Category Name', 1, 100),
  description: stringMinMax('Description', 1, 255).nullable(),
  isActive: baseBoolean('Is Active'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
