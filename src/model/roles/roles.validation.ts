import { baseDate, baseUUID, stringMinMax } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseRoleSchema = z.object({
  id: baseUUID('Role ID'),
  name: stringMinMax('Role Name', 1, 50),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
