import z from 'zod';
import { BaseShipmentSchema } from '../shipments.validation';
import { createZodDto } from 'nestjs-zod';

const UpdateStatusShipmentSchema = BaseShipmentSchema.pick({
  status: true,
});

export class UpdateStatusShipmentDto
  extends createZodDto(UpdateStatusShipmentSchema)
  implements z.infer<typeof UpdateStatusShipmentSchema> {}
