import { Injectable } from '@nestjs/common';
import {
  Voucher,
  VoucherGroup,
  VoucherType,
} from 'src/generated/prisma/client';
import { MappedOrderItem } from 'src/model/orders/orders.interface';

@Injectable()
export class HandleCalculationOrder {
  calculateOrderItems(orderItems: MappedOrderItem[]) {
    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const totalFinalPrice = orderItems.reduce(
      (acc, item) => acc + item.finalPrice * item.quantity,
      0,
    );
    const totalDiscount = totalPrice - totalFinalPrice;
    return {
      totalPrice,
      totalFinalPrice,
      totalDiscount,
    };
  }

  calculateCheckoutVouchers(vouchers: Voucher[] | [], price: number): number {
    if (vouchers.length) {
      for (const voucher of vouchers) {
        if (voucher.value) {
          if (voucher.group === VoucherGroup.CHECKOUT) {
            if (voucher.type === VoucherType.FIXED) {
              return price - voucher.value;
            }
            if (voucher.type === VoucherType.PERCENTAGE) {
              return price - (price * voucher.value) / 100;
            }
          }
        }
      }
    }
    return price;
  }

  calculateShippingVouchers(
    vouchers: Voucher[] | [],
    shippingCost: number,
  ): number {
    if (vouchers.length) {
      for (const voucher of vouchers) {
        if (voucher.value) {
          if (voucher.group === VoucherGroup.SHIPPING) {
            if (voucher.type === VoucherType.FIXED) {
              return shippingCost - voucher.value;
            }
            if (voucher.type === VoucherType.PERCENTAGE) {
              return shippingCost - (shippingCost * voucher.value) / 100;
            }
          }
        }
      }
    }
    return shippingCost;
  }
}
