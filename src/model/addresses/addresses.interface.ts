import z from 'zod';
import { BaseAddressSchema } from './addresses.validation';

type BaseAddressDto = z.infer<typeof BaseAddressSchema>;

export type ValidateAddressResDto = BaseAddressDto;
export type FindByIdAddressResDto = BaseAddressDto;
export type FindAllAddressResDto = BaseAddressDto[];
export type FindByUserAddressResDto = BaseAddressDto[];
