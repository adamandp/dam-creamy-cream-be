import z from 'zod';
import { BaseDiscountSchema } from './discounts.validation';

type BaseDiscountDto = z.infer<typeof BaseDiscountSchema>;

type ValidateDiscountResDto = BaseDiscountDto;
type FindByIdResDiscountDto = BaseDiscountDto;
type FindAllResDiscountDto = BaseDiscountDto[];

export type {
  BaseDiscountDto,
  ValidateDiscountResDto,
  FindByIdResDiscountDto,
  FindAllResDiscountDto,
};
