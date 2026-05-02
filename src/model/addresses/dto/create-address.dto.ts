import { createZodDto } from 'nestjs-zod';
import { BaseAddressSchema } from '../addresses.validation';
import z from 'zod';

export const CreateAddressSchema = BaseAddressSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export class CreateAddressDto
  extends createZodDto(CreateAddressSchema)
  implements z.infer<typeof CreateAddressSchema> {}
