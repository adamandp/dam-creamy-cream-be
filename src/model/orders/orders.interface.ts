import z from 'zod';
import { BaseOrderSchema } from './orders.validation';
import { DiscountType } from 'src/generated/prisma/enums';
import { Product } from 'src/generated/prisma/client';

export interface RawInventory {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RawCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface RawDiscount {
  id: string;
  name: string;
  discount_type: DiscountType;
  value: number | null;
  max_applied: number;
  max_redeemed: number;
  redeemed_count: number;
  description: string | null;
  product_id: string | null;
  quantity: number | null;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface MappedOrderItem {
  id: string;
  price: number;
  quantity: number;
  discountId?: string | null;
  discountValue?: number | null;
  discountType?: DiscountType | null;
  discountAmount?: number;
  finalPrice: number;
}

export type ProductBasicInfo = Pick<Product, 'id' | 'name' | 'price'>;

type BaseOrderDto = z.infer<typeof BaseOrderSchema>;
export type FindAllOrderResDto = BaseOrderDto[];
