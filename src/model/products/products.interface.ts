import z from 'zod';
import { BaseProductSchema } from './products.validation';
import { DiscountType } from 'src/generated/prisma/client';

export type BaseProductDto = z.infer<typeof BaseProductSchema>;

export type ValidateProductDto = BaseProductDto;
export type FindOneProductResDto = Omit<
  BaseProductDto,
  'id' | 'createdAt' | 'updatedAt'
>;
export type FindAllProductResDto = FindOneProductResDto[];

export type FindCatalogProductResDto = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  rate: number;
  price: number;
  discountPrice?: number | null;
  discountType?: DiscountType | null;
  discountValue?: number | null;
};

export type FindDetailProductResDto = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  rate: number;
  category: string;
  sales: number;
  price: number;
  discountPrice?: number | null;
  discountType?: DiscountType | null;
  discountValue?: number | null;
};
