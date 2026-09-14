import { DiscountType } from 'src/generated/prisma/enums';

export type FindOneProductResDto = {
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
