import { Injectable } from '@nestjs/common';
import { DiscountType } from 'src/generated/prisma/client';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';
import {
  MappedOrderItem,
  ProductBasicInfo,
  RawDiscount,
} from 'src/model/orders/orders.interface';

@Injectable()
export class HandleMappingOrder {
  mapOrderItems(
    productsData: ProductBasicInfo[],
    discountsData: RawDiscount[] | [],
    orderItems: OrderItemInputDto,
  ): MappedOrderItem[] {
    return productsData.map((product) => {
      const order = orderItems.find((o) => o.productId === product.id);
      const discount = discountsData.find((d) => d.product_id === product.id);

      let discountAmount = 0;
      let finalPrice = product.price;

      if (discount?.value) {
        switch (discount.discount_type) {
          case DiscountType.FIXED:
            discountAmount = discount.value;
            break;
          case DiscountType.PERCENTAGE:
            discountAmount = (discount.value * product.price) / 100;
            break;
          case DiscountType.PRICE:
            discountAmount = product.price - discount.value;
            break;
        }
        finalPrice = product.price - discountAmount;
      }

      return {
        id: product.id,
        price: product.price,
        quantity: order!.quantity,
        discountId: discount?.id,
        discountValue: discount?.value,
        discountType: discount?.discount_type,
        discountAmount,
        finalPrice,
      };
    });
  }
}
