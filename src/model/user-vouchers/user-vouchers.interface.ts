import z from 'zod';
import { BaseUserVoucherSchema } from './user-vouchers.validation';
import { BaseVoucherDto } from '../vouchers/vouchers.interface';

type BaseUserVoucherDto = z.infer<typeof BaseUserVoucherSchema>;

type ValidateUserVoucherDto = BaseUserVoucherDto;
type FindByUserUserVoucherDto = (BaseUserVoucherDto & {
  vouchers: BaseVoucherDto;
})[];
type FindByIdUserVoucherDto = BaseUserVoucherDto;
type FindAllUserVoucherDto = BaseUserVoucherDto[];
type FindByVoucherUserVoucherDto = BaseUserVoucherDto[];

export type {
  ValidateUserVoucherDto,
  FindByUserUserVoucherDto,
  FindByIdUserVoucherDto,
  FindAllUserVoucherDto,
  FindByVoucherUserVoucherDto,
};
