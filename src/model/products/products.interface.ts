import z from 'zod';
import { BaseProductSchema } from './products.validation';
import { Prisma } from 'src/generated/prisma/client';

export type BaseProductDto = z.infer<typeof BaseProductSchema>;

export type ValidateProductDto = BaseProductDto;
export type FindOneProductResDto = Omit<
  BaseProductDto,
  'id' | 'createdAt' | 'updatedAt'
>;
export type FindAllProductResDto = FindOneProductResDto[];

export type FindCatalogProductResDto = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    imageUrl: true;
    description: true;
    price: true;
    productDiscounts: {
      select: {
        isActive: true;
        discounts: {
          select: {
            discountType: true;
            value: true;
            productId: true;
            quantity: true;
          };
        };
      };
    };
    inventory: {
      select: {
        quantity: true;
      };
    };
  };
}> & {
  rating: number;
};
