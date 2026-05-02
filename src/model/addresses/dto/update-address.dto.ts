import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CreateAddressSchema } from './create-address.dto';

const UpdateAddressSchema = CreateAddressSchema.partial();

export class UpdateAddressDto
  extends createZodDto(UpdateAddressSchema)
  implements z.infer<typeof UpdateAddressSchema> {}
