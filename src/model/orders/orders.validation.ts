import { baseDate, baseEnum, baseNumber, baseUUID } from 'src/utils/zod.helper';
import z from 'zod';

export const BaseOrderSchema = z.object({
  id: baseUUID('Order ID'),
  userId: baseUUID('User ID'),
  addressId: baseUUID('Address ID'),
  // voucherAmount: baseNumber('Voucher Amount'),
  // totalPrice: baseNumber('Total'),
  // finalPrice: baseNumber('Final Price'),
  status: baseEnum('Status', [
    'PENDING',
    'PAID',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});

export const BaseOrderItemSchema = z.object({
  id: baseUUID('Order Item ID'),
  orderId: baseUUID('Order ID'),
  productId: baseUUID('Product ID'),
  discountId: baseUUID('Discount ID').nullish(),
  discountAmount: baseNumber('Discount Amount'),
  price: baseNumber('Price'),
  finalPrice: baseNumber('Final Price'),
  quantity: baseNumber('Quantity'),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});
