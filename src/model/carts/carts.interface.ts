import z from 'zod';
import { BaseCartSchema, BaseCartItemSchema } from './carts.validation';
import { BaseProductDto } from '../products/products.interface';

type BaseCartDto = z.infer<typeof BaseCartSchema>;
type BaseCartItemDto = z.infer<typeof BaseCartItemSchema>;

export type FindByUserCartDto = Pick<BaseCartDto, 'id'> & {
  cartItems: (Pick<BaseCartItemDto, 'id' | 'quantity'> & {
    products: Pick<
      BaseProductDto,
      'id' | 'name' | 'price' | 'categoryId' | 'imageUrl' | 'discountId'
    >;
  })[];
};
