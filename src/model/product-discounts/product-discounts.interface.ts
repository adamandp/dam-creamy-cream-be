import z from 'zod';
import { BaseProductDiscountSchema } from './product-discounts.validation';

type BaseProductDiscountDto = z.infer<typeof BaseProductDiscountSchema>;

type ValidateProductDiscountDto = BaseProductDiscountDto;
type FindByIdProductDiscountResDto = BaseProductDiscountDto;
type FindAllProductDiscountResDto = BaseProductDiscountDto[];
type FindByProductIdProductDiscountResDto = BaseProductDiscountDto[];

export type {
  BaseProductDiscountDto,
  ValidateProductDiscountDto,
  FindByIdProductDiscountResDto,
  FindAllProductDiscountResDto,
  FindByProductIdProductDiscountResDto,
};
