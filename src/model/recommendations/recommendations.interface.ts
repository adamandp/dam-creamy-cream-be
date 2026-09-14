import { Prisma } from 'src/generated/prisma/client';
import { DiscountType } from 'src/generated/prisma/enums';

interface ProductRecomendationRes {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  rate: number;
  price: number;
  discountPrice?: number | null;
  discountType?: DiscountType | null;
  discountValue?: number | null;
}

interface CategoriesRecomendationRes {
  id: string;
  imageUrl: string;
  category: string;
  categoryId: string;
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    reviews: { select: { rating: true } };
    productDiscounts: {
      include: { discounts: { select: { discountType: true; value: true } } };
    };
  };
}>;

export type {
  ProductRecomendationRes,
  CategoriesRecomendationRes,
  ProductWithRelations,
};
