import z from 'zod';
import { BaseVoucherSchema } from './vouchers.validation';

type BaseVoucherDto = z.infer<typeof BaseVoucherSchema>;
type ValidateVoucherDto = BaseVoucherDto;
type FindByIdVoucherDto = BaseVoucherDto;
type FindAllVoucherDto = BaseVoucherDto[];

export type {
  BaseVoucherDto,
  ValidateVoucherDto,
  FindByIdVoucherDto,
  FindAllVoucherDto,
};
